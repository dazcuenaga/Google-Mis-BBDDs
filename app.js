'use strict';

const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

let accessToken = null;
let tokenClient = null;

let currentModule = null;
let currentBoard = null;
let navStack = [];         // pila de nodos "picker" (módulos con árbol, ej. Animales)
let items = [];            // filas ya parseadas del tablero actual
let facetState = {};       // valor seleccionado por cada facetFilter activo
let activeFilterIdx = 0;
let searchTerm = '';
let editingRow = null;     // null = alta nueva, número = edición de esa fila
let sheetIdCache = {};     // `${spreadsheetId}:${sheetName}` -> sheetId numérico

// ---------- Elementos ----------
const el = (id) => document.getElementById(id);
const loginBtnGate = el('loginBtnGate');
const logoutBtn = el('logoutBtn');
const backBtn = el('backBtn');
const topIcon = el('topIcon');
const topTitle = el('topTitle');
const loginGate = el('loginGate');
const modulesScreen = el('modulesScreen');
const boardsScreen = el('boardsScreen');
const boardScreen = el('boardScreen');
const moduleList = el('moduleList');
const boardList = el('boardList');
const listEl = el('list');
const statusEl = el('status');
const searchInput = el('searchInput');
const filterChips = el('filterChips');
const facetFiltersEl = el('facetFilters');
const addBtn = el('addBtn');
const modalOverlay = el('modalOverlay');
const modalTitle = el('modalTitle');
const itemForm = el('itemForm');
const dynamicFields = el('dynamicFields');
const fichaContent = el('fichaContent');
const modalClose = el('modalClose');
const cancelBtn = el('cancelBtn');
const deleteBtn = el('deleteBtn');
const toastEl = el('toast');

// ---------- Autenticación ----------
window.addEventListener('load', () => {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CONFIG.CLIENT_ID,
    scope: CONFIG.SCOPES,
    callback: (resp) => {
      if (resp.error) {
        showToast('No se pudo iniciar sesión: ' + resp.error, true);
        return;
      }
      accessToken = resp.access_token;
      onLogin();
    },
  });
});

function requestLogin() {
  tokenClient.requestAccessToken({ prompt: accessToken ? '' : 'consent' });
}

loginBtnGate.addEventListener('click', requestLogin);

logoutBtn.addEventListener('click', () => {
  if (accessToken) google.accounts.oauth2.revoke(accessToken, () => {});
  accessToken = null;
  showGate();
});

function onLogin() {
  loginGate.classList.add('hidden');
  logoutBtn.classList.remove('hidden');
  showModules();
}

function showGate() {
  loginGate.classList.remove('hidden');
  modulesScreen.classList.add('hidden');
  boardsScreen.classList.add('hidden');
  boardScreen.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  backBtn.classList.add('hidden');
  topIcon.textContent = '📋';
  topTitle.textContent = 'Mis-BBDDs';
}

// ---------- Navegación entre pantallas ----------
function showModules() {
  currentModule = null;
  currentBoard = null;
  navStack = [];
  modulesScreen.classList.remove('hidden');
  boardsScreen.classList.add('hidden');
  boardScreen.classList.add('hidden');
  backBtn.classList.add('hidden');
  topIcon.textContent = '📋';
  topTitle.textContent = 'Mis-BBDDs';
  renderModules();
}

function showBoards(mod) {
  currentModule = mod;
  currentBoard = null;
  navStack = [];
  modulesScreen.classList.add('hidden');
  boardsScreen.classList.remove('hidden');
  boardScreen.classList.add('hidden');
  backBtn.classList.remove('hidden');
  topIcon.textContent = mod.icon;
  topTitle.textContent = mod.title;
  renderPickerItems(mod.boards);
}

// Pantalla de un nodo "picker" dentro de un módulo con árbol (ej. Animales: Año → Gastos/Población → Resumen/Detalle).
function showPicker() {
  const node = navStack[navStack.length - 1];
  currentBoard = null;
  modulesScreen.classList.add('hidden');
  boardsScreen.classList.remove('hidden');
  boardScreen.classList.add('hidden');
  backBtn.classList.remove('hidden');
  topIcon.textContent = node.icon || currentModule.icon;
  topTitle.textContent = node.title;
  renderPickerItems(node.items);
}

// Pantalla de un módulo con "árbol dinámico" (ej. Almacén Precios): en vez de
// una lista fija de nodos ya definida en config.js, primero se lee toda la
// hoja para ver qué valores hay en `groupField` (ej. las tiendas) y se
// construye un tablero por cada uno con `buildBoard`, antes de mostrarlos
// como si fueran los items de un picker normal.
async function openDynamicPicker(mod) {
  currentModule = mod;
  currentBoard = null;
  navStack = [];
  modulesScreen.classList.add('hidden');
  boardsScreen.classList.remove('hidden');
  boardScreen.classList.add('hidden');
  backBtn.classList.remove('hidden');
  topIcon.textContent = mod.icon;
  topTitle.textContent = mod.title;
  boardList.innerHTML = '<div class="status">Cargando…</div>';
  try {
    const dyn = mod.dynamicTree;
    const rows = await fetchBoardItems(mod.spreadsheetId, {
      sheetName: dyn.sheetName,
      fields: dyn.fields,
      titleField: dyn.groupField,
      dataStartRow: dyn.dataStartRow,
    });
    const values = [...new Set(rows.map((r) => r[dyn.groupField]).filter(Boolean))]
      .sort((a, b) => String(a).localeCompare(String(b), 'es'));
    if (values.length === 0) {
      boardList.innerHTML = '<div class="status">No hay datos todavía en la hoja.</div>';
      return;
    }
    const nodes = values.map((v) => dyn.buildBoard(v));
    navStack = [{ type: 'picker', title: mod.title, icon: mod.icon, items: nodes }];
    renderPickerItems(nodes);
  } catch (err) {
    console.error(err);
    boardList.innerHTML = '';
    showToast(err.message, true);
  }
}

function showBoard(mod, board) {
  currentModule = mod;
  currentBoard = board;
  modulesScreen.classList.add('hidden');
  boardsScreen.classList.add('hidden');
  boardScreen.classList.remove('hidden');
  backBtn.classList.remove('hidden');
  topIcon.textContent = mod.icon;
  topTitle.textContent = board.title;
  activeFilterIdx = 0;
  searchTerm = '';
  searchInput.value = '';
  facetState = {};
  facetFiltersEl.innerHTML = '';
  addBtn.classList.toggle('hidden', board.kind === 'resumen' || board.noAdd === true || board.readOnly === true);
  renderFilterChips();
  loadItems();
}

backBtn.addEventListener('click', () => {
  if (!currentModule) return;
  if (currentBoard) {
    currentBoard = null;
    if (navStack.length > 0) showPicker();
    else if (currentModule.boards && currentModule.boards.length > 1) showBoards(currentModule);
    else showModules();
  } else if (navStack.length > 1) {
    navStack.pop();
    showPicker();
  } else {
    showModules();
  }
});

function renderModules() {
  moduleList.innerHTML = '';
  for (const mod of MODULES) {
    const card = document.createElement('div');
    card.className = 'card module-card';
    card.innerHTML = `
      <div class="module-icon">${mod.icon}</div>
      <div class="card-main">
        <p class="card-title">${escapeHtml(mod.title)}</p>
        <div class="card-meta">${escapeHtml(mod.subtitle || '')}</div>
      </div>
      <div class="chevron">›</div>
    `;
    card.addEventListener('click', () => {
      if (mod.dynamicTree) {
        openDynamicPicker(mod);
      } else if (mod.tree) {
        currentModule = mod;
        navStack = [{ type: 'picker', title: mod.title, icon: mod.icon, items: mod.tree }];
        showPicker();
      } else if (mod.boards.length > 1) {
        showBoards(mod);
      } else {
        navStack = [];
        showBoard(mod, mod.boards[0]);
      }
    });
    moduleList.appendChild(card);
  }
}

// Lista de tarjetas de un nivel de navegación: puede contener nodos "picker"
// (llevan a otro nivel) o tableros hoja (abren el listado).
function renderPickerItems(items) {
  boardList.innerHTML = '';
  const mod = currentModule;
  items.forEach((node, idx) => {
    const card = document.createElement('div');
    card.className = 'card module-card';
    const statsId = `stats-${idx}-${(node.id || node.title || '').replace(/[^a-z0-9]+/gi, '-')}`;
    card.innerHTML = `
      <div class="module-icon">${node.icon || mod.icon}</div>
      <div class="card-main">
        <p class="card-title">${escapeHtml(node.title)}</p>
        ${node.filterCounts || node.statBadge ? `<div class="board-stats" id="${statsId}">Cargando…</div>` : ''}
      </div>
      <div class="chevron">›</div>
    `;
    card.addEventListener('click', () => {
      if (node.type === 'picker') {
        navStack.push(node);
        showPicker();
      } else {
        showBoard(mod, node);
      }
    });
    boardList.appendChild(card);

    if (node.filterCounts && node.filters) {
      loadBoardStats(mod, node, card.querySelector(`#${statsId}`));
    } else if (node.statBadge) {
      loadNodeStat(mod, node, card.querySelector(`#${statsId}`));
    }
  });
}

// Estadística agregada (ej. "UGM total") mostrada en la tarjeta de un nodo
// "picker" (ej. Población), calculada a partir de otro tablero del árbol.
async function loadNodeStat(mod, node, statsEl) {
  try {
    const { board, key, compute, op, label, decimals, format } = node.statBadge;
    const rows = await fetchBoardItems(mod.spreadsheetId, board);
    let value = op === 'max' ? -Infinity : 0;
    for (const it of rows) {
      const n = compute ? compute(it) : parseNum(it[key]);
      value = op === 'max' ? Math.max(value, n) : value + n;
    }
    if (rows.length === 0 && op === 'max') value = 0;
    if (!statsEl) return;
    const display = format === 'euro' ? formatEuro(value) : formatAggValue(value, { decimals });
    statsEl.innerHTML = `<span class="board-stat"><b>${escapeHtml(display)}</b> ${escapeHtml(label)}</span>`;
  } catch (err) {
    console.error(err);
    if (statsEl) statsEl.textContent = 'Error al cargar';
  }
}

async function loadBoardStats(mod, board, statsEl) {
  try {
    const boardItems = await fetchBoardItems(mod.spreadsheetId, board);
    if (!statsEl) return;
    statsEl.innerHTML = board.filters
      .map((f) => {
        const count = boardItems.filter((it) => matchesFilter(it, f)).length;
        return `<span class="board-stat"><b>${count}</b> ${escapeHtml(f.label)}</span>`;
      })
      .join('');
  } catch (err) {
    console.error(err);
    if (statsEl) statsEl.textContent = 'Error al cargar';
  }
}

// La notación A1 de Sheets exige comillas simples si el nombre de la pestaña
// tiene espacios u otros caracteres especiales (ej. "Hoja 1", "2026 - GASTOS").
function quoteSheet(name) {
  return `'${String(name).replace(/'/g, "''")}'`;
}

async function fetchBoardItems(spreadsheetId, board) {
  const start = dataStartRow(board);
  const range = `${quoteSheet(board.sheetName)}!A${start}:${dataRangeEnd(board)}`;
  const data = await sheetsFetch(spreadsheetId, `/values/${encodeURIComponent(range)}`);
  const rows = data.values || [];
  let boardItems = rows
    .map((r, i) => parseRow(board, r, i + start))
    .filter((it) => (it[board.titleField] || '').trim() !== '');
  if (board.fixedFilter) {
    boardItems = boardItems.filter((it) => it[board.fixedFilter.field] === board.fixedFilter.value);
  }
  return boardItems;
}

// ---------- Utilidades de columnas ----------
function colToIndex(letter) { return letter.toUpperCase().charCodeAt(0) - 65; }
function indexToCol(i) { return String.fromCharCode(65 + i); }
function lastColIndex(board) { return Math.max(...board.fields.map((f) => colToIndex(f.col))); }
function lastColLetter(board) { return indexToCol(lastColIndex(board)); }

// La mayoría de hojas tienen la cabecera en la fila 1 y los datos desde la 2,
// pero alguna (ej. "Registro Incubaciones", "BBDD") tiene la cabecera más abajo.
function dataStartRow(board) { return board.dataStartRow || 2; }
function dataRangeEnd(board) {
  const col = lastColLetter(board);
  return board.dataEndRow ? `${col}${board.dataEndRow}` : col;
}

// ---------- Llamadas a la API de Sheets ----------
async function sheetsFetch(spreadsheetId, path, options = {}) {
  const res = await fetch(`${SHEETS_BASE}/${spreadsheetId}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Error API Sheets (${res.status}): ${body}`);
  }
  return res.json();
}

async function getSheetId(spreadsheetId, sheetName) {
  const cacheKey = `${spreadsheetId}:${sheetName}`;
  if (sheetIdCache[cacheKey] != null) return sheetIdCache[cacheKey];
  const meta = await sheetsFetch(spreadsheetId, '');
  const sheet = meta.sheets.find((s) => s.properties.title === sheetName);
  sheetIdCache[cacheKey] = sheet.properties.sheetId;
  return sheet.properties.sheetId;
}

function parseRow(board, rowArr, rowNumber) {
  const obj = { row: rowNumber };
  for (const f of board.fields) {
    obj[f.key] = rowArr[colToIndex(f.col)] || '';
  }
  return obj;
}

async function loadItems() {
  setStatus('Cargando…');
  listEl.innerHTML = '';
  try {
    const start = dataStartRow(currentBoard);
    const range = `${quoteSheet(currentBoard.sheetName)}!A${start}:${dataRangeEnd(currentBoard)}`;
    const data = await sheetsFetch(currentModule.spreadsheetId, `/values/${encodeURIComponent(range)}`);
    const rows = data.values || [];
    items = rows
      .map((r, i) => parseRow(currentBoard, r, i + start))
      .filter((it) => (it[currentBoard.titleField] || '').trim() !== '');
    if (currentBoard.fixedFilter) {
      items = items.filter((it) => it[currentBoard.fixedFilter.field] === currentBoard.fixedFilter.value);
    }
    renderFacetFilters();
    updateFilterChipCounts();
    setStatus('');
    render();
  } catch (err) {
    console.error(err);
    setStatus('Error al cargar la hoja. Comprueba tu conexión o vuelve a iniciar sesión.');
    showToast(err.message, true);
  }
}

function buildRowArray(board, values) {
  const arr = new Array(lastColIndex(board) + 1).fill('');
  for (const f of board.fields) {
    let v = f.type === 'computed' ? f.compute(values) : values[f.key];
    if (f.type === 'date') v = fromDateInputValue(v);
    arr[colToIndex(f.col)] = v == null ? '' : v;
  }
  return arr;
}

async function appendItem(values) {
  const range = `${quoteSheet(currentBoard.sheetName)}!A:${lastColLetter(currentBoard)}`;
  await sheetsFetch(
    currentModule.spreadsheetId,
    `/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: 'POST', body: JSON.stringify({ values: [buildRowArray(currentBoard, values)] }) }
  );
}

async function updateItem(row, values) {
  const range = `${quoteSheet(currentBoard.sheetName)}!A${row}:${lastColLetter(currentBoard)}${row}`;
  await sheetsFetch(
    currentModule.spreadsheetId,
    `/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    { method: 'PUT', body: JSON.stringify({ values: [buildRowArray(currentBoard, values)] }) }
  );
}

async function deleteItemRow(row) {
  const sheetId = await getSheetId(currentModule.spreadsheetId, currentBoard.sheetName);
  await sheetsFetch(currentModule.spreadsheetId, ':batchUpdate', {
    method: 'POST',
    body: JSON.stringify({
      requests: [{
        deleteDimension: { range: { sheetId, dimension: 'ROWS', startIndex: row - 1, endIndex: row } },
      }],
    }),
  });
}

// ---------- Render del listado ----------
function matchesFilter(it, filter) {
  if (filter.match) return filter.match(it);
  if (!filter.field) return true;
  const val = it[filter.field] || '';
  const isMatch = val === filter.value;
  return filter.negate ? !isMatch : isMatch;
}

function ubicacionOrder(u) {
  return u === 'Nevera' ? 0 : u === 'Arcon' ? 1 : 2;
}

function buildResumenGroups(rows) {
  const map = new Map();
  for (const it of rows) {
    const qty = parseNum(it.congelada);
    if (qty <= 0) continue;
    if (!map.has(it.descripcion)) map.set(it.descripcion, { descripcion: it.descripcion, total: 0, rows: [] });
    const g = map.get(it.descripcion);
    g.total += qty;
    g.rows.push({ ubicacion: it.ubicacion, tamano: it.tamano, congelada: qty });
  }
  const groups = [...map.values()].sort((a, b) => a.descripcion.localeCompare(b.descripcion, 'es'));
  for (const g of groups) {
    g.rows.sort((a, b) => ubicacionOrder(a.ubicacion) - ubicacionOrder(b.ubicacion));
  }
  return groups;
}

function renderResumen(allGroups) {
  const term = searchTerm.trim().toLowerCase();
  const groups = term
    ? allGroups.filter((g) => g.descripcion.toLowerCase().includes(term))
    : allGroups;

  listEl.innerHTML = '';
  if (groups.length === 0) {
    setStatus('No hay productos congelados.');
    return;
  }
  setStatus('');

  for (const g of groups) {
    const card = document.createElement('div');
    card.className = 'card module-card';
    card.innerHTML = `
      <div class="card-main">
        <p class="card-title">${escapeHtml(g.descripcion)}</p>
      </div>
      <div class="chevron">›</div>
    `;
    card.addEventListener('click', () => openFicha(g));
    listEl.appendChild(card);
  }
}

// Compara fechas dd/mm/aaaa cronológicamente (convirtiendo a aaaa-mm-dd).
function compareDateStrings(a, b) {
  return toDateInputValue(a).localeCompare(toDateInputValue(b));
}

// Agrupado en dos niveles con agregados (suma/máximo) por subgrupo.
// Ej. Gastos: agrupado por Animal, subgrupo por Tipo, suma de Importe y última Fecha.
function applyAgg(agg, aggregates, it) {
  for (const a of aggregates) {
    if (a.op === 'sum') {
      agg[a.key] = parseNum(agg[a.key]) + parseNum(it[a.key]);
    } else if (a.op === 'max') {
      if (a.type === 'date') {
        if (!agg[a.key] || compareDateStrings(it[a.key], agg[a.key]) > 0) agg[a.key] = it[a.key];
      } else if (agg[a.key] === '' || parseNum(it[a.key]) > parseNum(agg[a.key])) {
        agg[a.key] = it[a.key];
      }
    }
  }
}

// Si el tablero no define subGroupField, solo se calculan los totales por
// grupo (ej. Huerta: agrupado por Planta, sin desglose interno).
function buildAggResumenGroups(board, rows) {
  const map = new Map();
  const totalsMap = new Map(); // group -> agregados sobre todas las filas del grupo (no solo por subgrupo)
  for (const it of rows) {
    const g = it[board.groupField];
    if (!g) continue;
    if (!totalsMap.has(g)) {
      const t = {};
      for (const a of board.aggregates) t[a.key] = a.op === 'max' ? '' : 0;
      totalsMap.set(g, t);
    }
    applyAgg(totalsMap.get(g), board.aggregates, it);

    if (board.subGroupField) {
      if (!map.has(g)) map.set(g, new Map());
      const subMap = map.get(g);
      const sKey = it[board.subGroupField] || '—';
      if (!subMap.has(sKey)) {
        const agg = {};
        for (const a of board.aggregates) agg[a.key] = a.op === 'max' ? '' : 0;
        subMap.set(sKey, agg);
      }
      applyAgg(subMap.get(sKey), board.aggregates, it);
    }
  }
  const groups = [...totalsMap.entries()].map(([group, totals]) => ({
    group,
    totals,
    subgroups: board.subGroupField
      ? [...map.get(group).entries()]
          .map(([label, values]) => ({ label, values }))
          .sort((a, b) => a.label.localeCompare(b.label, 'es'))
      : [],
  }));
  groups.sort((a, b) => a.group.localeCompare(b.group, 'es'));
  return groups;
}

function formatAggValue(value, agg) {
  if (agg.type === 'date') return value || '—';
  const n = parseNum(value);
  if (agg.format === 'euro') return formatEuro(n);
  const dec = agg.decimals != null ? agg.decimals : 2;
  const factor = Math.pow(10, dec);
  return String(Math.round(n * factor) / factor);
}

function renderResumenAgg(allGroups) {
  const term = searchTerm.trim().toLowerCase();
  const groups = term
    ? allGroups.filter((g) => g.group.toLowerCase().includes(term))
    : allGroups;

  listEl.innerHTML = '';
  if (groups.length === 0) {
    setStatus('No hay datos.');
    return;
  }
  setStatus('');

  for (const g of groups) {
    const card = document.createElement('div');
    card.className = 'card module-card';
    let badgeHtml = '';
    if (currentBoard.groupBadge) {
      const aggDef = currentBoard.aggregates.find((a) => a.key === currentBoard.groupBadge.key);
      const display = formatAggValue(g.totals[currentBoard.groupBadge.key], aggDef);
      badgeHtml = `
        <div class="card-qty">
          <div class="num">${escapeHtml(display)}</div>
          <div class="lbl">${escapeHtml(currentBoard.groupBadge.label)}</div>
        </div>`;
    }
    const tagValues = currentBoard.groupTags ? currentBoard.groupTags(g) : [];
    const tags = tagValues.map((v) => `<span class="tag">${escapeHtml(v)}</span>`).join('');
    const hasDrilldown = !!currentBoard.subGroupField;
    card.innerHTML = `
      <div class="card-top">
        <div class="card-main">
          <p class="card-title">${escapeHtml(g.group)}</p>
          ${tags ? `<div class="card-meta">${tags}</div>` : ''}
        </div>
        ${badgeHtml}
        ${hasDrilldown ? '<div class="chevron">›</div>' : ''}
      </div>
    `;
    if (hasDrilldown) {
      card.addEventListener('click', () => openFichaAgg(g));
    } else {
      card.style.cursor = 'default';
    }
    listEl.appendChild(card);
  }
}

function render() {
  if (currentBoard.kind === 'resumen') {
    let baseItems = items;
    if (currentBoard.facetFilters) {
      baseItems = baseItems.filter((it) =>
        currentBoard.facetFilters.every((f) => !facetState[f.key] || String(f.value(it)) === facetState[f.key])
      );
    }
    if (currentBoard.groupField) renderResumenAgg(buildAggResumenGroups(currentBoard, baseItems));
    else renderResumen(buildResumenGroups(baseItems));
    return;
  }

  const board = currentBoard;
  const term = searchTerm.trim().toLowerCase();
  const filter = (board.filters || [{ label: 'Todos' }])[activeFilterIdx];

  let filtered = items.filter((it) => matchesFilter(it, filter));
  if (term) {
    const fields = board.searchFields || [board.titleField];
    filtered = filtered.filter((it) => fields.some((f) => (it[f] || '').toLowerCase().includes(term)));
  }
  if (board.facetFilters) {
    filtered = filtered.filter((it) =>
      board.facetFilters.every((f) => !facetState[f.key] || String(f.value(it)) === facetState[f.key])
    );
  }
  if (board.sort) {
    const { field, type, dir } = board.sort;
    filtered = filtered.slice().sort((a, b) => {
      let cmp;
      if (type === 'number') cmp = parseNum(a[field]) - parseNum(b[field]);
      else if (type === 'date') cmp = toDateInputValue(a[field]).localeCompare(toDateInputValue(b[field]));
      else cmp = (a[field] || '').localeCompare(b[field] || '', 'es');
      return dir === 'desc' ? -cmp : cmp;
    });
  }

  listEl.innerHTML = '';
  if (filtered.length === 0) {
    setStatus('No hay elementos que coincidan.');
    return;
  }
  setStatus('');

  for (const it of filtered) {
    const card = document.createElement('div');
    const isDone = board.doneField && it[board.doneField] === 'Si';
    const extraClass = board.cardClass ? board.cardClass(it) : '';
    card.className = 'card' + (isDone ? ' done' : '') + (extraClass ? ' ' + extraClass : '');

    const tagValues = (board.subtitleFields || []).map((k) => it[k]).filter((v) => v);
    if (board.extraTags) tagValues.push(...board.extraTags(it));
    const tags = tagValues.map((v) => `<span class="tag">${escapeHtml(v)}</span>`).join('');

    let badgeHtml = '';
    if (board.badge) {
      const val = it[board.badge.key];
      if (val !== '' && val != null) {
        const display = board.badge.format === 'euro' ? formatEuro(val) : val;
        badgeHtml = `
          <div class="card-qty">
            <div class="num ${parseNum(val) <= 0 ? 'zero' : ''}">${escapeHtml(String(display))}</div>
            <div class="lbl">${escapeHtml(board.badge.label)}</div>
          </div>`;
      }
    }

    const visibleActions = (board.quickActions || []).filter((a) => !a.hideWhen || !a.hideWhen(it));
    const actionsHtml = visibleActions.length
      ? `<div class="card-actions">${visibleActions.map((a, i) => `<button type="button" class="quick-btn${a.variant ? ' quick-btn-' + a.variant : ''}" data-idx="${i}">${escapeHtml(a.label)}</button>`).join('')}</div>`
      : '';

    card.innerHTML = `
      <div class="card-top">
        <div class="card-main">
          <p class="card-title">${escapeHtml(it[board.titleField])}</p>
          <div class="card-meta">${tags}</div>
        </div>
        ${badgeHtml}
      </div>
      ${actionsHtml}
    `;
    card.addEventListener('click', () => (board.readOnly ? openInfoFicha(it) : openEditModal(it)));
    card.querySelectorAll('.quick-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        quickUpdate(it, visibleActions[Number(btn.dataset.idx)]);
      });
    });
    listEl.appendChild(card);
  }
}

function formValuesFromItem(board, it) {
  const values = {};
  for (const f of board.fields) {
    if (f.type === 'computed') continue;
    values[f.key] = f.type === 'date' ? toDateInputValue(it[f.key]) : it[f.key];
  }
  return values;
}

async function quickUpdate(it, action) {
  const values = formValuesFromItem(currentBoard, it);
  if (action.apply) {
    action.apply(values, it);
  } else {
    const field = currentBoard.fields.find((f) => f.key === action.field);
    values[action.field] = action.value === 'today' && field && field.type === 'date' ? todayISO() : action.value;
  }
  try {
    await updateItem(it.row, values);
    showToast('Guardado', false);
    await loadItems();
  } catch (err) {
    console.error(err);
    showToast(err.message, true);
  }
}

function setStatus(msg) {
  statusEl.textContent = msg;
  statusEl.classList.toggle('hidden', !msg);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// ---------- Filtros / búsqueda ----------
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  render();
});

function renderFilterChips() {
  filterChips.innerHTML = '';
  if (!currentBoard.filters || currentBoard.filters.length === 0) return;
  const filters = currentBoard.filters;
  filters.forEach((f, idx) => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (idx === 0 ? ' active' : '');
    btn.textContent = f.label;
    btn.dataset.label = f.label;
    btn.addEventListener('click', () => {
      activeFilterIdx = idx;
      [...filterChips.children].forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
    filterChips.appendChild(btn);
  });
}

// Desplegables de filtro por faceta (ej. Mes/Tipo/Animal en Gastos), con las
// opciones calculadas a partir de los valores presentes en los datos cargados.
function renderFacetFilters() {
  facetFiltersEl.innerHTML = '';
  facetState = {};
  if (!currentBoard.facetFilters) return;
  for (const facet of currentBoard.facetFilters) {
    const values = [...new Set(items.map((it) => facet.value(it)).filter((v) => v !== '' && v != null))];
    values.sort((a, b) => String(a).localeCompare(String(b), 'es', { numeric: true }));
    const sel = document.createElement('select');
    const optAll = document.createElement('option');
    optAll.value = '';
    optAll.textContent = facet.label;
    sel.appendChild(optAll);
    for (const v of values) {
      const o = document.createElement('option');
      o.value = v;
      o.textContent = facet.optionLabel ? facet.optionLabel(v) : v;
      sel.appendChild(o);
    }
    sel.addEventListener('change', () => {
      facetState[facet.key] = sel.value;
      render();
    });
    facetFiltersEl.appendChild(sel);
  }
}

function updateFilterChipCounts() {
  if (!currentBoard.filterCounts || !currentBoard.filters) return;
  const chips = [...filterChips.children];
  currentBoard.filters.forEach((f, idx) => {
    const count = items.filter((it) => matchesFilter(it, f)).length;
    if (chips[idx]) chips[idx].textContent = `${chips[idx].dataset.label} (${count})`;
  });
}

// ---------- Modal alta / edición ----------
addBtn.addEventListener('click', () => openAddModal());
modalClose.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

function buildFieldInput(f, value) {
  const wrap = document.createElement('label');
  wrap.textContent = f.label;
  let input;
  if (f.type === 'stars') {
    const row = document.createElement('div');
    row.className = 'stars-input';
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.id = `f_${f.key}`;
    hidden.value = value != null && value !== '' ? value : '';
    const max = f.max || 5;
    const buttons = [];
    const refresh = () => {
      const v = Number(hidden.value) || 0;
      buttons.forEach((b, i) => {
        b.textContent = i < v ? '★' : '☆';
        b.classList.toggle('filled', i < v);
      });
    };
    for (let i = 0; i < max; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'star-btn';
      b.addEventListener('click', () => {
        hidden.value = Number(hidden.value) === i + 1 ? '' : i + 1;
        refresh();
      });
      buttons.push(b);
      row.appendChild(b);
    }
    refresh();
    wrap.appendChild(row);
    wrap.appendChild(hidden);
    return wrap;
  }
  if (f.type === 'select') {
    input = document.createElement('select');
    for (const opt of f.options) {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt === 'Si' ? 'Sí' : opt === 'Arcon' ? 'Arcón' : opt;
      input.appendChild(o);
    }
    input.value = value != null ? value : (f.default || f.options[0]);
  } else {
    input = document.createElement('input');
    input.type = f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text';
    if (f.placeholder) input.placeholder = f.placeholder;
    if (f.step != null) input.step = f.step;
    if (f.min != null) input.min = f.min;
    if (f.max != null) input.max = f.max;
    if (f.list) {
      const listId = `list_${f.key}`;
      input.setAttribute('list', listId);
      const dl = document.createElement('datalist');
      dl.id = listId;
      f.list.forEach((v) => {
        const o = document.createElement('option');
        o.value = v;
        dl.appendChild(o);
      });
      wrap.appendChild(dl);
    }
    if (f.type === 'date') {
      input.value = value != null ? value : (f.default === 'today' ? todayISO() : '');
    } else if (f.type === 'number') {
      input.value = value != null && value !== '' ? parseNum(value) : (f.default != null ? f.default : '');
    } else {
      input.value = value != null ? value : (f.default != null ? f.default : '');
    }
  }
  input.id = `f_${f.key}`;
  if (f.required) input.required = true;
  wrap.appendChild(input);
  return wrap;
}

// Para tableros con `speciesLookup`: trae los datos del tablero de referencia
// (ej. Información de Incubaciones) indexados por el campo clave (ej. especie).
// Busca en un lookup {clave: fila} tolerando espacios/mayúsculas distintas
// entre lo que escribe/elige el usuario y lo que hay en la hoja.
function lookupValue(lookup, key) {
  if (!lookup || !key) return null;
  if (lookup[key] != null) return lookup[key];
  const norm = String(key).trim().toLowerCase();
  const foundKey = Object.keys(lookup).find((k) => k.trim().toLowerCase() === norm);
  return foundKey ? lookup[foundKey] : null;
}

async function fetchLookup(board) {
  const src = board.speciesLookup;
  if (!src) return null;
  // Algunos tableros no tienen una hoja de referencia aparte: el valor típico
  // por especie se deduce de las filas ya cargadas de este mismo tablero.
  if (src.fromItems) {
    const map = {};
    for (const it of items) {
      if (it[src.keyField] && !(it[src.keyField] in map)) map[it[src.keyField]] = it;
    }
    return map;
  }
  try {
    const rows = await fetchBoardItems(currentModule.spreadsheetId, src.board);
    const map = {};
    for (const r of rows) map[r[src.keyField]] = r;
    return map;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Recalcula campos de fecha derivados (ej. Quitar giro / Eclosión máx.) cada
// vez que cambia alguno de sus campos de origen (ej. Especie / Fecha inicio).
function wireAutoCalc(lookup, runInitial) {
  if (!currentBoard.autoCalc || !lookup) return;
  const recalc = () => {
    const values = {};
    for (const f of currentBoard.fields) {
      if (f.type === 'computed') continue;
      const input = el(`f_${f.key}`);
      if (input) values[f.key] = input.value;
    }
    for (const calc of currentBoard.autoCalc) {
      const targetInput = el(`f_${calc.targetKey}`);
      if (!targetInput) continue;
      const val = calc.compute(values, lookup);
      if (val) targetInput.value = val;
    }
  };
  const deps = new Set();
  currentBoard.autoCalc.forEach((c) => c.dependsOn.forEach((k) => deps.add(k)));
  deps.forEach((key) => {
    const input = el(`f_${key}`);
    if (!input) return;
    // 'input' cubre selección de <datalist> y tecleo; 'change' cubre <select>
    // y el caso en que el navegador solo dispare al perder el foco.
    input.addEventListener('input', recalc);
    input.addEventListener('change', recalc);
  });
  // En alta, los campos dependientes ya tienen valor por defecto (especie,
  // fecha de hoy): calculamos una vez para no dejar las fechas vacías.
  if (runInitial) recalc();
}

// Si el tablero define `selectFromLookup`, convierte ese campo de texto en un
// <select> con las opciones obtenidas del tablero de referencia.
function resolveField(f, lookup) {
  if (!lookup || !currentBoard.selectFromLookup) return f;
  const configs = Array.isArray(currentBoard.selectFromLookup) ? currentBoard.selectFromLookup : [currentBoard.selectFromLookup];
  const cfg = configs.find((c) => c.fieldKey === f.key);
  if (!cfg) return f;
  // Sin valueField: las opciones son las claves del lookup (ej. especies).
  // Con valueField: las opciones son los valores únicos de ese campo (ej. proveedores).
  const options = cfg.valueField
    ? [...new Set(Object.values(lookup).map((r) => r[cfg.valueField]).filter(Boolean))]
    : Object.keys(lookup);
  options.sort((a, b) => a.localeCompare(b, 'es'));
  return { ...f, type: 'select', options };
}

async function openAddModal() {
  editingRow = null;
  modalTitle.textContent = 'Añadir';
  deleteBtn.classList.add('hidden');
  itemForm.classList.remove('hidden');
  fichaContent.classList.add('hidden');
  dynamicFields.innerHTML = '';
  const lookup = await fetchLookup(currentBoard);
  for (const f of currentBoard.fields) {
    if (f.type === 'computed' || f.type === 'fixed') continue;
    dynamicFields.appendChild(buildFieldInput(resolveField(f, lookup), null));
  }
  wireAutoCalc(lookup, true);
  modalOverlay.classList.remove('hidden');
}

async function openEditModal(it) {
  editingRow = it.row;
  modalTitle.textContent = 'Editar';
  deleteBtn.classList.remove('hidden');
  itemForm.classList.remove('hidden');
  fichaContent.classList.add('hidden');
  dynamicFields.innerHTML = '';
  const lookup = await fetchLookup(currentBoard);
  for (const f of currentBoard.fields) {
    if (f.type === 'computed' || f.type === 'fixed') continue;
    const val = f.type === 'date' ? toDateInputValue(it[f.key]) : it[f.key];
    dynamicFields.appendChild(buildFieldInput(resolveField(f, lookup), val));
  }
  wireAutoCalc(lookup);
  modalOverlay.classList.remove('hidden');
}

// Ficha de solo lectura para un elemento de un tablero readOnly (ej. tabla de
// referencia de incubación): un renglón por cada campo, sin edición posible.
function openInfoFicha(it) {
  editingRow = null;
  modalTitle.textContent = it[currentBoard.titleField];
  itemForm.classList.add('hidden');
  fichaContent.classList.remove('hidden');
  const rowsHtml = currentBoard.fields
    .filter((f) => f.type !== 'computed' && f.key !== currentBoard.titleField)
    .map((f) => `
      <div class="ficha-row">
        <span class="ficha-loc">${escapeHtml(f.label || f.key)}</span>
        <span class="ficha-qty">${escapeHtml(it[f.key] || '—')}</span>
      </div>`)
    .join('');
  fichaContent.innerHTML = `<div class="ficha-rows">${rowsHtml}</div>`;
  modalOverlay.classList.remove('hidden');
}

// Ficha de solo lectura para un grupo del Resumen de Congelados.
function openFicha(group) {
  editingRow = null;
  modalTitle.textContent = group.descripcion;
  itemForm.classList.add('hidden');
  fichaContent.classList.remove('hidden');
  const rowsHtml = group.rows
    .map((r) => `
      <div class="ficha-row">
        <span class="ficha-loc">${escapeHtml(r.ubicacion || '—')}</span>
        <span class="ficha-size">${escapeHtml(r.tamano || '—')}</span>
        <span class="ficha-qty">${escapeHtml(String(r.congelada))} uds</span>
      </div>`)
    .join('');
  fichaContent.innerHTML = `
    <div class="ficha-total">
      <div class="num">${escapeHtml(String(group.total))}</div>
      <div class="lbl">uds congeladas en total</div>
    </div>
    <div class="ficha-rows">${rowsHtml}</div>
  `;
  modalOverlay.classList.remove('hidden');
}

// Ficha de solo lectura para un grupo del resumen agregado (Gastos/Población):
// desglose por subgrupo con los valores calculados (suma/última fecha…).
function openFichaAgg(group) {
  editingRow = null;
  modalTitle.textContent = group.group;
  itemForm.classList.add('hidden');
  fichaContent.classList.remove('hidden');
  const board = currentBoard;
  const rowsHtml = group.subgroups
    .map((sg) => {
      const valuesHtml = board.aggregates
        .map((a) => `<span class="ficha-agg-val"><b>${escapeHtml(formatAggValue(sg.values[a.key], a))}</b> ${escapeHtml(a.label)}</span>`)
        .join('');
      return `
        <div class="ficha-row-agg">
          <div class="ficha-row-title">${escapeHtml(sg.label)}</div>
          <div class="ficha-row-values">${valuesHtml}</div>
        </div>`;
    })
    .join('');
  fichaContent.innerHTML = `<div class="ficha-rows">${rowsHtml}</div>`;
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  editingRow = null;
  itemForm.classList.remove('hidden');
  fichaContent.classList.add('hidden');
}

itemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const values = {};
  for (const f of currentBoard.fields) {
    if (f.type === 'computed') continue;
    if (f.type === 'fixed') { values[f.key] = f.value; continue; }
    const input = el(`f_${f.key}`);
    values[f.key] = input.value.trim ? input.value.trim() : input.value;
  }
  if (currentBoard.titleField && !values[currentBoard.titleField]) return;

  const submitBtn = itemForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  try {
    if (editingRow) {
      await updateItem(editingRow, values);
      showToast('Guardado', false);
    } else {
      await appendItem(values);
      showToast('Añadido', false);
    }
    closeModal();
    await loadItems();
  } catch (err) {
    console.error(err);
    showToast(err.message, true);
  } finally {
    submitBtn.disabled = false;
  }
});

deleteBtn.addEventListener('click', async () => {
  if (!editingRow) return;
  if (!confirm('¿Eliminar este elemento de la hoja?')) return;
  try {
    await deleteItemRow(editingRow);
    showToast('Eliminado', false);
    closeModal();
    await loadItems();
  } catch (err) {
    console.error(err);
    showToast(err.message, true);
  }
});

// ---------- Utilidades ----------
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Convierte valores numéricos leídos de la hoja (que pueden venir con coma
// decimal por el locale español, o con símbolo de moneda) a un Number JS.
function parseNum(v) {
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return v;
  let s = String(v).trim().replace(/[€\s]/g, '');
  if (!s) return 0;
  if (/,\d+$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function formatEuro(v) {
  return `${(Math.round(parseNum(v) * 100) / 100).toFixed(2).replace('.', ',')} €`;
}

// Paleta de colores determinista a partir de un texto (ej. especie de animal).
// Usa índices ya repartidos a mano para que valores distintos, aunque el hash
// colisione, tiendan a caer en huecos distintos de la paleta.
const HUE_CLASSES = ['hue-a', 'hue-e', 'hue-b', 'hue-f', 'hue-c', 'hue-g', 'hue-d', 'hue-h'];
function hashClass(str) {
  let h = 0;
  for (const c of String(str || '')) h = (h * 131 + c.charCodeAt(0)) % 7919;
  return HUE_CLASSES[h % HUE_CLASSES.length];
}

// Las hojas guardan fechas como dd/mm/aaaa; los <input type=date> usan aaaa-mm-dd.
function toDateInputValue(str) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((str || '').trim());
  if (!m) return '';
  const [, d, mo, y] = m;
  return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

// Días entre hoy y una fecha dd/mm/aaaa (negativo si ya ha pasado). null si no es una fecha válida.
function daysUntil(ddmmyyyy) {
  const iso = toDateInputValue(ddmmyyyy);
  if (!iso) return null;
  const [y, mo, d] = iso.split('-').map(Number);
  const [ty, tmo, td] = todayISO().split('-').map(Number);
  return Math.round((Date.UTC(y, mo - 1, d) - Date.UTC(ty, tmo - 1, td)) / 86400000);
}

function fromDateInputValue(str) {
  if (!str) return '';
  const [y, mo, d] = str.split('-');
  return `${d}/${mo}/${y}`;
}

// Suma días a una fecha en formato de <input type=date> (aaaa-mm-dd).
function addDaysISO(iso, days) {
  if (!iso) return '';
  const [y, mo, d] = (iso || '').split('-').map(Number);
  if (!y || !mo || !d) return '';
  // Aritmética en UTC puro para no desplazar el día por la zona horaria local.
  const dt = new Date(Date.UTC(y, mo - 1, d));
  dt.setUTCDate(dt.getUTCDate() + Math.round(parseNum(days)));
  return dt.toISOString().slice(0, 10);
}

let toastTimer = null;
function showToast(msg, isError) {
  toastEl.textContent = msg;
  toastEl.className = 'toast ' + (isError ? 'error' : 'ok');
  toastEl.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.add('hidden'), 3500);
}

// ---------- Service worker (instalación como app) ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
