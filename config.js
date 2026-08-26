// Configuración de la app. CLIENT_ID: ver README.md para cómo se crea.
const CONFIG = {
  // Client ID de OAuth 2.0 (tipo "Aplicación web") creado en Google Cloud Console.
  CLIENT_ID: '533970188000-bnae6dgrpvrb1d97gvmohm1k1rf0lb97.apps.googleusercontent.com',

  // Permiso que se pide al usuario: leer y escribir en Google Sheets (cualquier hoja suya).
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets',
};

// Campos Si/No reutilizados en varios tableros.
const SI_NO = ['Si', 'No'];

// "★★★☆☆" a partir de un número de estrellas.
function starsText(n) {
  n = Math.round(parseNum(n));
  return '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n));
}

// Filtros compartidos por los tableros de Family To Dos (Tareas).
// Una tarea "En Barbecho" desaparece del resto de filtros.
const TODO_FILTERS = [
  { label: 'Pendientes', match: (it) => it.enBarbecho !== 'Si' && it.iniciada !== 'Si' && it.realizada !== 'Si' },
  { label: 'Iniciadas', match: (it) => it.enBarbecho !== 'Si' && it.iniciada === 'Si' && it.realizada !== 'Si' },
  { label: 'Hechas', match: (it) => it.enBarbecho !== 'Si' && it.realizada === 'Si' },
  { label: 'En Barbecho', match: (it) => it.enBarbecho === 'Si' },
];

// Botones rápidos compartidos por los tableros de Family To Dos (Tareas).
const TODO_QUICK_ACTIONS = [
  {
    label: 'Iniciar',
    variant: 'success',
    hideWhen: (it) => it.iniciada === 'Si',
    apply: (values) => {
      values.iniciada = 'Si';
      values.fechaInicio = todayISO();
    },
  },
  {
    label: 'Terminado',
    variant: 'primary',
    hideWhen: (it) => it.realizada === 'Si',
    apply: (values) => {
      values.realizada = 'Si';
      values.fechaFin = todayISO();
    },
  },
  {
    label: 'Postponer',
    variant: 'warn',
    hideWhen: (it) => it.enBarbecho === 'Si',
    apply: (values) => {
      values.enBarbecho = 'Si';
    },
  },
];

// ---------------------------------------------------------------------------
// ANIMALES: hoja con una pestaña "{Año} - GASTOS" y "{Año} - POBLACION" por
// cada año. El módulo usa un "árbol" de navegación (Año → Gastos/Población →
// Resumen/Detalle) en vez de la lista plana de tableros que usan los demás.
// ---------------------------------------------------------------------------
const ANIMALES_SPREADSHEET_ID = '1sUIJEddbucc5SyYfwnrNulOxL2I6fRI5GINo3uYSD84';
const ANIMALES_YEARS = [2026, 2025];
const PLANTAS_SPREADSHEET_ID = '17yCW3G1Fj4cJU_akGp0VIEfg_XpF6J5udMKdS4nb_Mk';
const PLANTAS_YEARS = [2026];
const ALMACEN_PRECIOS_SPREADSHEET_ID = '1yKc2UlePpejKCC1bQWftuCBPaXWfRYbpOQRyvt_001k';

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
function mesDe(it) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((it.fecha || '').trim());
  return m ? m[2].padStart(2, '0') : '';
}

function buildAnimalYear(year) {
  const gastosSheet = `${year} - GASTOS`;
  const poblacionSheet = `${year} - POBLACION`;
  return {
    type: 'picker',
    title: String(year),
    icon: '📅',
    items: [
      {
        type: 'picker',
        title: 'Gastos',
        icon: '💰',
        items: [
          {
            id: `gastos-resumen-${year}`,
            kind: 'resumen',
            sheetName: gastosSheet,
            title: 'Resumen',
            titleField: 'animal',
            groupField: 'animal',
            subGroupField: 'tipo',
            aggregates: [
              { key: 'importe', op: 'sum', label: 'Importe', format: 'euro' },
              { key: 'fecha', op: 'max', label: 'Última fecha', type: 'date' },
            ],
            fields: [
              { key: 'animal', col: 'A' },
              { key: 'tipo', col: 'B' },
              { key: 'importe', col: 'G' },
              { key: 'fecha', col: 'H' },
            ],
          },
          {
            id: `gastos-detalle-${year}`,
            sheetName: gastosSheet,
            title: 'Detalle',
            titleField: 'producto',
            subtitleFields: ['animal', 'tipo'],
            badge: { key: 'importe', label: '', format: 'euro' },
            searchFields: ['producto'],
            sort: { field: 'fecha', type: 'date', dir: 'desc' },
            facetFilters: [
              { key: 'mes', label: 'Mes', value: mesDe, optionLabel: (v) => MONTH_NAMES[Number(v) - 1] || v },
              { key: 'tipo', label: 'Tipo', value: (it) => it.tipo },
              { key: 'animal', label: 'Animal', value: (it) => it.animal },
            ],
            // "Lugar de compra" y "Peso" son columnas nuevas en la hoja (insertadas antes de
            // Producto y Cantidad respectivamente); solo aparecen en el formulario de alta/edición,
            // no se usan para agrupar, filtrar ni en la tarjeta de la lista.
            fields: [
              { key: 'animal', label: 'Animal', col: 'A', type: 'text', required: true, list: ['AVES', 'PERRA'] },
              { key: 'tipo', label: 'Tipo', col: 'B', type: 'text', required: true, list: ['ALIMENTACION', 'LIMPIEZA', 'VETERINARIO'] },
              { key: 'lugarCompra', label: 'Lugar de compra', col: 'C', type: 'text' },
              { key: 'producto', label: 'Producto', col: 'D', type: 'text', required: true },
              { key: 'peso', label: 'Peso', col: 'E', type: 'number', step: '0.01' },
              { key: 'cantidad', label: 'Cantidad', col: 'F', type: 'number', default: 1 },
              { key: 'importe', label: 'Importe (€)', col: 'G', type: 'number', step: '0.01', required: true },
              { key: 'fecha', label: 'Fecha', col: 'H', type: 'date', default: 'today' },
            ],
          },
        ],
      },
      buildPoblacionPicker(year, poblacionSheet),
    ],
  };
}

function buildPoblacionPicker(year, poblacionSheet) {
  const resumenBoard = {
    id: `poblacion-resumen-${year}`,
    kind: 'resumen',
    sheetName: poblacionSheet,
    title: 'Resumen',
    titleField: 'especie',
    groupField: 'especie',
    subGroupField: 'animales',
    groupBadge: { key: 'totalUgm', label: 'UGM total' },
    aggregates: [
      { key: 'cantidad', op: 'sum', label: 'Cantidad', decimals: 0 },
      { key: 'totalUgm', op: 'sum', label: 'UGM total', decimals: 3 },
      { key: 'fechaRevision', op: 'max', label: 'Última revisión', type: 'date' },
    ],
    fields: [
      { key: 'especie', col: 'A' },
      { key: 'animales', col: 'B' },
      { key: 'cantidad', col: 'C' },
      { key: 'totalUgm', col: 'E' },
      { key: 'fechaRevision', col: 'H' },
    ],
  };
  return {
    type: 'picker',
    title: 'Población',
    icon: '🐔',
    statBadge: { board: resumenBoard, key: 'totalUgm', op: 'sum', label: 'UGM total', decimals: 3 },
    items: [
      resumenBoard,
      {
            id: `poblacion-detalle-${year}`,
            sheetName: poblacionSheet,
            title: 'Detalle',
            titleField: 'animales',
            subtitleFields: ['especie', 'fechaRevision'],
            badge: { key: 'cantidad', label: 'cant.' },
            searchFields: ['animales', 'especie'],
            sort: { field: 'fechaRevision', type: 'date', dir: 'desc' },
            facetFilters: [
              { key: 'especie', label: 'Especie', value: (it) => it.especie },
            ],
            cardClass: (it) => hashClass(it.especie),
            // El UGM se rellena a partir del UGM ya usado para esa especie en otras filas.
            speciesLookup: { fromItems: true, keyField: 'especie' },
            autoCalc: [
              {
                targetKey: 'ugm',
                dependsOn: ['especie'],
                compute: (values, lookup) => {
                  const sp = lookupValue(lookup, values.especie);
                  return sp && sp.ugm ? sp.ugm : '';
                },
              },
            ],
            fields: [
              { key: 'especie', label: 'Especie', col: 'A', type: 'text', required: true, list: ['PERRO', 'PAJARO', 'OCA', 'PATO', 'GALLINA'] },
              { key: 'animales', label: 'Animal', col: 'B', type: 'text', required: true },
              { key: 'cantidad', label: 'Cantidad', col: 'C', type: 'number', default: 1 },
              { key: 'ugm', label: 'UGM', col: 'D', type: 'number', step: '0.001' },
              { key: 'totalUgm', label: 'UGM total', col: 'E', type: 'computed', compute: (v) => parseNum(v.cantidad) * parseNum(v.ugm) },
              { key: 'precio', label: 'Precio', col: 'F', type: 'number', step: '0.01' },
              { key: 'totalPrecio', label: 'Total precio', col: 'G', type: 'computed', compute: (v) => parseNum(v.cantidad) * parseNum(v.precio) },
              { key: 'fechaRevision', label: 'Fecha revisión', col: 'H', type: 'date', default: 'today' },
            ],
          },
        ],
      };
}

function buildAnimalesModule() {
  return {
    id: 'animales',
    title: 'Animales',
    subtitle: 'Gastos y población por año',
    icon: '🐾',
    spreadsheetId: ANIMALES_SPREADSHEET_ID,
    tree: ANIMALES_YEARS.map(buildAnimalYear),
  };
}

// ---------------------------------------------------------------------------
// MÓDULOS: cada uno es una hoja de cálculo. Cada módulo tiene uno o varios
// "tableros" (pestañas de esa hoja), que pueden tener columnas distintas.
// ---------------------------------------------------------------------------
const MODULES = [
  {
    id: 'congelados',
    title: 'Congelados',
    subtitle: 'Inventario de nevera y arcón',
    icon: '🧊',
    spreadsheetId: '1xtBrpzA9EaLztJ7-KR_XmyfxuywBK_Uf5xFxd1Usijk',
    boards: [
      {
        // Vista de solo lectura: lista de productos (con unidades > 0) agrupados
        // por descripción; al tocar uno se ve el desglose por tamaño/ubicación.
        id: 'resumen',
        kind: 'resumen',
        sheetName: 'Contenido',
        title: 'Resumen',
        titleField: 'descripcion',
        // Igual que en Detalles: el desplegable de Categoría se combina con la
        // búsqueda por texto del resumen.
        facetFilters: [
          { key: 'categoria', label: 'Categoría', value: (it) => it.categoria },
        ],
        fields: [
          { key: 'descripcion', col: 'A' },
          { key: 'categoria', col: 'B' },
          { key: 'ubicacion', col: 'C' },
          { key: 'tamano', col: 'D' },
          { key: 'congelada', col: 'G' },
        ],
      },
      {
        id: 'contenido',
        sheetName: 'Contenido',
        title: 'Detalles',
        titleField: 'descripcion',
        subtitleFields: ['ubicacion', 'tamano'],
        badge: { key: 'congelada', label: 'uds' },
        searchFields: ['descripcion'],
        sort: { field: 'descripcion', type: 'text', dir: 'asc' },
        filters: [
          { label: 'Todos', match: (it) => parseNum(it.congelada) > 0 },
          { label: 'Nevera', match: (it) => it.ubicacion === 'Nevera' && parseNum(it.congelada) > 0 },
          { label: 'Arcón', match: (it) => it.ubicacion === 'Arcon' && parseNum(it.congelada) > 0 },
          { label: 'Consumidos', match: (it) => parseNum(it.congelada) <= 0 },
        ],
        // Categoría se puede combinar con el filtro de arriba (Nevera/Arcón/...):
        // el desplegable de faceta y el chip de filtro se aplican a la vez.
        facetFilters: [
          { key: 'categoria', label: 'Categoría', value: (it) => it.categoria },
        ],
        cardClass: (it) => (it.ubicacion === 'Nevera' ? 'nevera' : it.ubicacion === 'Arcon' ? 'arcon' : ''),
        quickActions: [
          {
            label: 'Sacar',
            variant: 'danger',
            hideWhen: (it) => parseNum(it.congelada) <= 0,
            apply: (values) => {
              values.sacada = String(parseNum(values.sacada) + 1);
              values.fechaSalida = todayISO();
            },
          },
          {
            label: 'Añadir',
            variant: 'primary',
            apply: (values) => {
              values.metida = String(parseNum(values.metida) + 1);
              values.fechaEntrada = todayISO();
            },
          },
        ],
        // Categoría se rellena como <select> con los valores de categoría que ya
        // existan entre los productos cargados (sin lista fija en el código).
        speciesLookup: { fromItems: true, keyField: 'categoria' },
        selectFromLookup: { fieldKey: 'categoria' },
        fields: [
          { key: 'descripcion', label: 'Descripción', col: 'A', type: 'text', required: true, placeholder: 'Ej. Merluza' },
          { key: 'categoria', label: 'Categoría', col: 'B', type: 'text' },
          { key: 'ubicacion', label: 'Ubicación', col: 'C', type: 'select', options: ['Nevera', 'Arcon'], default: 'Nevera' },
          { key: 'tamano', label: 'Tamaño', col: 'D', type: 'text', placeholder: 'Ej. 500gr, Bolsa, Tupper…' },
          { key: 'metida', label: 'Cantidad metida', col: 'E', type: 'number', default: 1 },
          { key: 'sacada', label: 'Cantidad sacada', col: 'F', type: 'number', default: 0 },
          { key: 'congelada', label: 'Cantidad Congelada', col: 'G', type: 'computed', compute: (v) => parseNum(v.metida) - parseNum(v.sacada) },
          { key: 'fechaEntrada', label: 'Fecha última entrada', col: 'H', type: 'date', default: 'today' },
          { key: 'fechaSalida', label: 'Fecha última salida', col: 'I', type: 'date' },
        ],
      },
    ],
  },

  {
    id: 'familytodos',
    title: 'Tareas',
    subtitle: 'Tareas pendientes por casa',
    icon: '✅',
    spreadsheetId: '1KB6u9gM9iCF4vrX2bOn4QQIb9zVBISN0V6D07WZ1_Bg',
    boards: [
      {
        id: 'cabana', sheetName: 'Cabaña', title: 'Cabaña',
        titleField: 'tarea', subtitleFields: ['tipo'],
        badge: { key: 'prioridad', label: 'prio.' },
        doneField: 'realizada',
        searchFields: ['tarea', 'descripcion', 'tipo'],
        sort: { field: 'prioridad', type: 'number', dir: 'asc' },
        filters: TODO_FILTERS,
        filterCounts: true,
        quickActions: TODO_QUICK_ACTIONS,
        fields: [
          { key: 'prioridad', label: 'Prioridad (1 = más urgente)', col: 'A', type: 'number', default: 3 },
          { key: 'tarea', label: 'Tarea', col: 'B', type: 'text', required: true },
          { key: 'tipo', label: 'Tipo', col: 'C', type: 'text', placeholder: 'Ej. Construccion, Compra…', list: ['Construccion', 'Solicitud', 'Carpinteria', 'Compra', 'Electricidad', 'Burocratica', 'Pintar'] },
          { key: 'descripcion', label: 'Descripción', col: 'D', type: 'text' },
          { key: 'tiempoEstimado', label: 'Tiempo estimado (días)', col: 'E', type: 'number' },
          { key: 'costeEstimado', label: 'Coste estimado', col: 'F', type: 'number' },
          { key: 'fechaLimite', label: 'Fecha límite', col: 'G', type: 'date' },
          { key: 'iniciada', label: 'Iniciada', col: 'H', type: 'select', options: SI_NO, default: 'No' },
          { key: 'realizada', label: 'Realizada', col: 'I', type: 'select', options: SI_NO, default: 'No' },
          { key: 'fechaInicio', label: 'Fecha inicio', col: 'J', type: 'date' },
          { key: 'fechaFin', label: 'Fecha fin', col: 'K', type: 'date' },
          { key: 'enBarbecho', label: 'En barbecho', col: 'L', type: 'select', options: SI_NO, default: 'No' },
        ],
      },
      {
        id: 'cisneros', sheetName: 'Cisneros', title: 'Cisneros',
        titleField: 'tarea', subtitleFields: ['tipo'],
        badge: { key: 'prioridad', label: 'prio.' },
        doneField: 'realizada',
        searchFields: ['tarea', 'descripcion', 'tipo'],
        sort: { field: 'prioridad', type: 'number', dir: 'asc' },
        filters: TODO_FILTERS,
        filterCounts: true,
        quickActions: TODO_QUICK_ACTIONS,
        fields: [
          { key: 'prioridad', label: 'Prioridad (1 = más urgente)', col: 'A', type: 'number', default: 3 },
          { key: 'tarea', label: 'Tarea', col: 'B', type: 'text', required: true },
          { key: 'tipo', label: 'Tipo', col: 'C', type: 'text', placeholder: 'Ej. Pintar, Burocratica…' },
          { key: 'descripcion', label: 'Descripción', col: 'D', type: 'text' },
          { key: 'tiempoEstimado', label: 'Tiempo estimado (días)', col: 'E', type: 'number' },
          { key: 'fechaLimite', label: 'Fecha límite', col: 'F', type: 'date' },
          { key: 'iniciada', label: 'Iniciada', col: 'G', type: 'select', options: SI_NO, default: 'No' },
          { key: 'realizada', label: 'Realizada', col: 'H', type: 'select', options: SI_NO, default: 'No' },
          { key: 'fechaInicio', label: 'Fecha inicio', col: 'I', type: 'date' },
          { key: 'fechaFin', label: 'Fecha fin', col: 'J', type: 'date' },
          { key: 'enBarbecho', label: 'En barbecho', col: 'K', type: 'select', options: SI_NO, default: 'No' },
        ],
      },
      {
        id: 'clinica', sheetName: 'Clinica', title: 'Clínica',
        titleField: 'tarea', subtitleFields: ['tipo'],
        badge: { key: 'prioridad', label: 'prio.' },
        doneField: 'realizada',
        searchFields: ['tarea', 'descripcion', 'tipo'],
        sort: { field: 'prioridad', type: 'number', dir: 'asc' },
        filters: TODO_FILTERS,
        filterCounts: true,
        quickActions: TODO_QUICK_ACTIONS,
        fields: [
          { key: 'prioridad', label: 'Prioridad (1 = más urgente)', col: 'A', type: 'number', default: 3 },
          { key: 'tarea', label: 'Tarea', col: 'B', type: 'text', required: true },
          { key: 'tipo', label: 'Tipo', col: 'C', type: 'text', placeholder: 'Ej. Compra, Electricidad…' },
          { key: 'descripcion', label: 'Descripción', col: 'D', type: 'text' },
          { key: 'tiempoEstimado', label: 'Tiempo estimado (días)', col: 'E', type: 'number' },
          { key: 'fechaLimite', label: 'Fecha límite', col: 'F', type: 'date' },
          { key: 'iniciada', label: 'Iniciada', col: 'G', type: 'select', options: SI_NO, default: 'No' },
          { key: 'realizada', label: 'Realizada', col: 'H', type: 'select', options: SI_NO, default: 'No' },
          { key: 'fechaInicio', label: 'Fecha inicio', col: 'I', type: 'date' },
          { key: 'fechaFin', label: 'Fecha fin', col: 'J', type: 'date' },
          { key: 'enBarbecho', label: 'En barbecho', col: 'K', type: 'select', options: SI_NO, default: 'No' },
        ],
      },
      {
        id: 'general', sheetName: 'General', title: 'General',
        titleField: 'tarea', subtitleFields: ['tipo'],
        badge: { key: 'prioridad', label: 'prio.' },
        doneField: 'realizada',
        searchFields: ['tarea', 'descripcion', 'tipo'],
        sort: { field: 'prioridad', type: 'number', dir: 'asc' },
        filters: TODO_FILTERS,
        filterCounts: true,
        quickActions: TODO_QUICK_ACTIONS,
        fields: [
          { key: 'prioridad', label: 'Prioridad (1 = más urgente)', col: 'A', type: 'number', default: 3 },
          { key: 'tarea', label: 'Tarea', col: 'B', type: 'text', required: true },
          { key: 'tipo', label: 'Tipo', col: 'C', type: 'text' },
          { key: 'descripcion', label: 'Descripción', col: 'D', type: 'text' },
          { key: 'tiempoEstimado', label: 'Tiempo estimado (días)', col: 'E', type: 'number' },
          { key: 'fechaLimite', label: 'Fecha límite', col: 'F', type: 'date' },
          { key: 'iniciada', label: 'Iniciada', col: 'G', type: 'select', options: SI_NO, default: 'No' },
          { key: 'realizada', label: 'Realizada', col: 'H', type: 'select', options: SI_NO, default: 'No' },
          { key: 'fechaInicio', label: 'Fecha inicio', col: 'I', type: 'date' },
          { key: 'fechaFin', label: 'Fecha fin', col: 'J', type: 'date' },
          { key: 'enBarbecho', label: 'En barbecho', col: 'K', type: 'select', options: SI_NO, default: 'No' },
        ],
      },
    ],
  },

  {
    id: 'listalectura',
    title: 'Lista de Lectura',
    subtitle: 'Libros pendientes y leídos',
    icon: '📚',
    spreadsheetId: '1GptVxUE5TPgvo6bAMewT7yO_8UpPP9xTjSX7_pNVbYk',
    boards: [
      {
        id: 'hoja1', sheetName: 'Hoja 1', title: 'Lista de Lectura',
        titleField: 'libro', subtitleFields: ['autor'],
        badge: { key: 'interes', label: 'interés' },
        searchFields: ['libro', 'autor'],
        sort: { field: 'interes', type: 'number', dir: 'desc' },
        filters: [
          { label: 'Todos' },
          { label: 'Pendientes', match: (it) => !it.fechaLectura && it.iniciado !== 'Si' },
          { label: 'Leyendo', match: (it) => !it.fechaLectura && it.iniciado === 'Si' },
          { label: 'Leídos', match: (it) => !!it.fechaLectura },
        ],
        quickActions: [
          {
            label: 'Iniciar lectura', field: 'iniciado', value: 'Si', variant: 'success',
            hideWhen: (it) => it.iniciado === 'Si',
          },
          {
            label: 'Leído', field: 'fechaLectura', value: 'today', variant: 'primary',
            hideWhen: (it) => !!it.fechaLectura,
          },
        ],
        // Fondo de la tarjeta según el estado de lectura.
        cardClass: (it) => {
          if (it.fechaLectura) return 'finished';
          if (it.iniciado === 'Si') return 'reading';
          return '';
        },
        // Estrellas de valoración, solo se muestran en la tarjeta si hay valor.
        extraTags: (it) => (parseNum(it.valoracion) > 0 ? [starsText(it.valoracion)] : []),
        fields: [
          { key: 'libro', label: 'Libro', col: 'A', type: 'text', required: true },
          { key: 'autor', label: 'Autor', col: 'B', type: 'text' },
          { key: 'interes', label: 'Interés (0-10)', col: 'C', type: 'number', step: '0.5', min: 0, max: 10 },
          { key: 'enBiblioteca', label: 'En biblioteca', col: 'D', type: 'select', options: SI_NO, default: 'No' },
          { key: 'enEbook', label: 'En ebook', col: 'E', type: 'select', options: SI_NO, default: 'No' },
          { key: 'iniciado', label: 'Iniciado', col: 'F', type: 'select', options: SI_NO, default: 'No' },
          { key: 'fechaLectura', label: 'Fecha de lectura', col: 'G', type: 'date' },
          { key: 'valoracion', label: 'Valoración', col: 'H', type: 'stars', max: 5 },
        ],
      },
    ],
  },

  buildAnimalesModule(),

  buildIncubacionesModule(),

  buildPlantasModule(),

  buildAlmacenPreciosModule(),
];

// ---------------------------------------------------------------------------
// ALMACÉN PRECIOS: hoja "Listado" con los precios de productos de varias
// tiendas, todos en la misma pestaña (columna "Tienda" para distinguirlos).
// La app lee esa columna y genera un submódulo (tablero) por cada tienda que
// encuentre — si añades una tienda nueva en la hoja, aparece sola la próxima
// vez que abras el módulo, sin tocar este archivo.
// ---------------------------------------------------------------------------

// Campos de la hoja "Listado". Con `tiendaFija` construye los campos de un
// tablero de una tienda concreta (la columna Tienda queda fija a ese valor y
// no se muestra en el formulario); sin ella, se usan para detectar qué
// tiendas hay (recorrido inicial de toda la hoja).
function almacenPreciosFields(tiendaFija) {
  return [
    { key: 'tienda', label: 'Tienda', col: 'A', type: tiendaFija != null ? 'fixed' : 'text', value: tiendaFija },
    { key: 'producto', label: 'Producto', col: 'B', type: 'text', required: true },
    { key: 'peso', label: 'Peso', col: 'C', type: 'number', step: '0.01' },
    { key: 'importe', label: 'Importe (€)', col: 'D', type: 'number', step: '0.01', required: true },
    { key: 'medida', label: 'Medida', col: 'E', type: 'text' },
  ];
}

function buildAlmacenPreciosBoard(tienda) {
  return {
    id: `almacenprecios-${tienda}`,
    sheetName: 'Listado',
    title: tienda,
    titleField: 'producto',
    // Peso solo se muestra si esa fila lo tiene informado (subtitleFields ya
    // descarta los valores vacíos).
    subtitleFields: ['peso', 'medida'],
    badge: { key: 'importe', label: '', format: 'euro' },
    searchFields: ['producto'],
    sort: { field: 'producto', type: 'text', dir: 'asc' },
    // Solo se listan/editan filas de esta tienda; al guardar, la columna
    // Tienda se rellena sola con este valor (ver campo type: 'fixed' arriba).
    fixedFilter: { field: 'tienda', value: tienda },
    fields: almacenPreciosFields(tienda),
  };
}

function buildAlmacenPreciosModule() {
  return {
    id: 'almacenprecios',
    title: 'Almacén Precios',
    subtitle: 'Precios por tienda',
    icon: '🏷️',
    spreadsheetId: ALMACEN_PRECIOS_SPREADSHEET_ID,
    // Árbol dinámico: en vez de una lista fija de nodos (como los años de
    // Animales/Plantas), la app rellena esto al abrir el módulo, leyendo las
    // tiendas que haya en ese momento en la hoja.
    dynamicTree: {
      sheetName: 'Listado',
      groupField: 'tienda',
      fields: almacenPreciosFields(),
      buildBoard: buildAlmacenPreciosBoard,
    },
  };
}

function buildIncubacionesModule() {
  // Tabla de referencia (solo lectura): parámetros de incubación por especie.
  // La cabecera está en la fila 3 y hay una nota a pie de tabla en la fila 23.
  const informacionBoard = {
    id: 'informacion',
    sheetName: 'BBDD',
    title: 'Información',
    dataStartRow: 4,
    dataEndRow: 22,
    readOnly: true,
    titleField: 'especie',
    searchFields: ['especie'],
    sort: { field: 'especie', type: 'text', dir: 'asc' },
    extraTags: (it) => [`${it.periodoMin}-${it.periodoMax} días`, `${it.temp}°C`],
    fields: [
      { key: 'especie', label: 'Especie', col: 'A', type: 'text' },
      { key: 'periodoMin', label: 'Periodo incub. mín. (días)', col: 'B', type: 'number' },
      { key: 'periodoMax', label: 'Periodo incub. máx. (días)', col: 'C', type: 'number' },
      { key: 'temp', label: 'Temperatura (°C)', col: 'D', type: 'text' },
      { key: 'humedad', label: 'Humedad', col: 'E', type: 'text' },
      { key: 'noVuelta', label: 'No dar vuelta después del día', col: 'F', type: 'number' },
      { key: 'humedadUlt3', label: 'Humedad últimos 3 días', col: 'G', type: 'text' },
      { key: 'ventilacion', label: 'Ventilación totalmente abierta', col: 'H', type: 'text' },
    ],
  };

  const registroBoard = {
    // Registro editable de incubaciones en curso o realizadas.
    // La cabecera está en la fila 2 (fila 1 vacía).
    id: 'registro',
    sheetName: 'Registro Incubaciones',
    title: 'Registro Incubaciones',
    dataStartRow: 3,
    titleField: 'especie',
    subtitleFields: ['tipoIncubacion'],
    extraTags: (it) => [
      it.fechaInicio ? `Inicio: ${it.fechaInicio}` : null,
      it.eclosionMax ? `Fin: ${it.eclosionMax}` : null,
    ].filter(Boolean),
    badge: { key: 'resultado', label: 'result.' },
    searchFields: ['especie'],
    sort: { field: 'fechaInicio', type: 'date', dir: 'desc' },
    filters: [
      { label: 'En curso', match: (it) => !it.resultado },
      { label: 'Finalizadas', match: (it) => !!it.resultado },
    ],
    // Naranja si está en curso (sin resultado) y quedan 7 días o menos para la eclosión.
    cardClass: (it) => {
      if (it.resultado) return '';
      const d = daysUntil(it.eclosionMax);
      return d != null && d <= 7 ? 'warn' : '';
    },
    // El campo Especie se rellena como <select> con las especies de Información.
    speciesLookup: { board: informacionBoard, keyField: 'especie' },
    selectFromLookup: { fieldKey: 'especie' },
    // Quitar giro y Eclosión máx. se recalculan al elegir Especie o Fecha inicio,
    // usando los datos de esa especie en Información.
    autoCalc: [
      {
        targetKey: 'quitarGiro',
        dependsOn: ['especie', 'fechaInicio'],
        compute: (values, lookup) => {
          const sp = lookupValue(lookup, values.especie);
          if (!sp || !values.fechaInicio) return '';
          return addDaysISO(values.fechaInicio, sp.noVuelta);
        },
      },
      {
        targetKey: 'eclosionMax',
        dependsOn: ['especie', 'fechaInicio'],
        compute: (values, lookup) => {
          const sp = lookupValue(lookup, values.especie);
          if (!sp || !values.fechaInicio) return '';
          return addDaysISO(values.fechaInicio, sp.periodoMax);
        },
      },
    ],
    fields: [
      { key: 'especie', label: 'Especie', col: 'A', type: 'text', required: true },
      { key: 'tipoIncubacion', label: 'Tipo incubación', col: 'B', type: 'select', options: ['Incubadora', 'Natural'], default: 'Incubadora' },
      { key: 'huevos', label: 'Huevos', col: 'C', type: 'number', default: 1 },
      { key: 'fechaInicio', label: 'Fecha inicio', col: 'D', type: 'date', default: 'today' },
      { key: 'quitarGiro', label: 'Quitar giro', col: 'E', type: 'date' },
      { key: 'eclosionMax', label: 'Eclosión máx.', col: 'F', type: 'date' },
      { key: 'resultado', label: 'Resultado (huevos eclosionados)', col: 'G', type: 'number' },
    ],
  };

  return {
    id: 'incubaciones',
    title: 'Incubaciones',
    subtitle: 'Tabla de referencia y registro de incubaciones',
    icon: '🥚',
    spreadsheetId: '1i7ZyxM4B8cRzhOnEX_5g0uJ2mDPHNY-xt_SHaKd8_zs',
    boards: [informacionBoard, registroBoard],
  };
}

// ---------------------------------------------------------------------------
// PLANTAS: hoja con pestañas "{Año} - Huerta", "{Año} - Arboles" y
// "{Año} - Productos" por cada año. Igual que Animales, el Año es el primer
// nivel; dentro, tres tableros planos (sin Resumen).
// ---------------------------------------------------------------------------

function buildPlantasYear(year) {
  const huertaSheet = `${year} - Huerta`;
  const arbolesSheet = `${year} - Arboles`;
  const productosSheet = `${year} - Productos`;

  const arbolesBoard = {
    id: `arboles-${year}`,
    sheetName: arbolesSheet,
    title: 'Árboles',
    titleField: 'arbol',
    subtitleFields: ['obtencion'],
    badge: { key: 'cantidad', label: 'cant.' },
    searchFields: ['arbol', 'obtencion'],
    sort: { field: 'fechaPlantacion', type: 'date', dir: 'desc' },
    fields: [
      { key: 'obtencion', label: 'Obtención', col: 'A', type: 'text', required: true, placeholder: 'Ej. Comprado, Regalo…' },
      { key: 'arbol', label: 'Árbol', col: 'B', type: 'text', required: true },
      { key: 'precio', label: 'Precio', col: 'C', type: 'number', step: '0.01', default: 0 },
      { key: 'cantidad', label: 'Cantidad', col: 'D', type: 'number', default: 1 },
      { key: 'fechaCompra', label: 'Fecha compra', col: 'E', type: 'date', default: 'today' },
      { key: 'fechaPlantacion', label: 'Fecha plantación', col: 'F', type: 'date', default: 'today' },
      { key: 'sobreviven', label: 'Sobreviven', col: 'G', type: 'number' },
    ],
  };
  // Árboles no tiene columna de importe total en la hoja: se calcula como Precio × Cantidad.
  arbolesBoard.statBadge = {
    board: arbolesBoard,
    compute: (it) => parseNum(it.precio) * parseNum(it.cantidad),
    op: 'sum',
    label: 'Importe total',
    format: 'euro',
  };

  // --- Productos: Resumen (agrupado por Tipo Producto → Producto) + Detalle ---
  const productosDetalleBoard = {
    id: `productos-detalle-${year}`,
    sheetName: productosSheet,
    title: 'Detalle',
    dataStartRow: 4,
    titleField: 'producto',
    subtitleFields: ['tipoProducto', 'lugarCompra'],
    badge: { key: 'total', label: '', format: 'euro' },
    searchFields: ['producto', 'lugarCompra'],
    sort: { field: 'fecha', type: 'date', dir: 'desc' },
    fields: [
      { key: 'lugarCompra', label: 'Lugar de compra', col: 'A', type: 'text', required: true },
      { key: 'tipoProducto', label: 'Tipo producto', col: 'B', type: 'text', required: true, list: ['Insecticida', 'Herbicida', 'Abono'] },
      { key: 'producto', label: 'Producto', col: 'C', type: 'text', required: true },
      { key: 'precioUnitario', label: 'Precio unitario (€)', col: 'D', type: 'number', step: '0.0001', required: true },
      { key: 'cantidad', label: 'Cantidad', col: 'E', type: 'number', default: 1 },
      { key: 'total', label: 'Total', col: 'F', type: 'computed', compute: (v) => parseNum(v.precioUnitario) * parseNum(v.cantidad) },
      { key: 'fecha', label: 'Fecha', col: 'G', type: 'date', default: 'today' },
    ],
  };
  const productosResumenBoard = {
    id: `productos-resumen-${year}`,
    kind: 'resumen',
    sheetName: productosSheet,
    title: 'Resumen',
    dataStartRow: 4,
    titleField: 'tipoProducto',
    groupField: 'tipoProducto',
    subGroupField: 'producto',
    groupBadge: { key: 'total', label: '', format: 'euro' },
    groupTags: (g) => [`Última compra: ${g.totals.fecha || '—'}`],
    aggregates: [
      { key: 'total', op: 'sum', label: 'Total', format: 'euro' },
      { key: 'cantidad', op: 'sum', label: 'Cantidad', decimals: 0 },
      { key: 'fecha', op: 'max', label: 'Última compra', type: 'date' },
    ],
    fields: [
      { key: 'tipoProducto', col: 'B' },
      { key: 'producto', col: 'C' },
      { key: 'cantidad', col: 'E' },
      { key: 'total', col: 'F' },
      { key: 'fecha', col: 'G' },
    ],
  };
  const productosPicker = {
    type: 'picker',
    title: 'Productos',
    icon: '🧺',
    statBadge: { board: productosDetalleBoard, key: 'total', op: 'sum', label: 'Importe total', format: 'euro' },
    items: [productosResumenBoard, productosDetalleBoard],
  };

  // --- Huerta: Resumen (agrupado por Planta) + Detalle ---
  const huertaLookupBoard = {
    sheetName: huertaSheet,
    titleField: 'planta',
    fields: [
      { key: 'proveedor', col: 'J' },
      { key: 'planta', col: 'K' },
      { key: 'precioCiento', col: 'L' },
      { key: 'precioUnidad', col: 'M' },
    ],
  };
  const huertaDetalleBoard = {
    id: `huerta-detalle-${year}`,
    sheetName: huertaSheet,
    title: 'Detalle',
    titleField: 'planta',
    subtitleFields: ['lugarCompra'],
    badge: { key: 'importe', label: '', format: 'euro' },
    searchFields: ['planta', 'lugarCompra'],
    sort: { field: 'fecha', type: 'date', dir: 'desc' },
    // El Importe Unitario y el Lugar de compra se rellenan desde la tabla de
    // precios de la propia hoja (columnas J a M: Proveedor, Planta, Precio Ciento, Precio Unidad).
    speciesLookup: { board: huertaLookupBoard, keyField: 'planta' },
    selectFromLookup: [
      { fieldKey: 'planta' },
      { fieldKey: 'lugarCompra', valueField: 'proveedor' },
    ],
    autoCalc: [
      {
        targetKey: 'importeUnitario',
        dependsOn: ['planta'],
        compute: (values, lookup) => {
          const sp = lookupValue(lookup, values.planta);
          return sp && sp.precioUnidad ? String(parseNum(sp.precioUnidad)) : '';
        },
      },
    ],
    fields: [
      { key: 'lugarCompra', label: 'Lugar de compra', col: 'A', type: 'text', required: true },
      { key: 'planta', label: 'Planta', col: 'B', type: 'text', required: true },
      { key: 'importeUnitario', label: 'Importe unitario (€)', col: 'C', type: 'number', step: '0.0001' },
      { key: 'cantidadCompra', label: 'Cantidad', col: 'D', type: 'number', default: 1 },
      { key: 'importe', label: 'Importe', col: 'E', type: 'computed', compute: (v) => parseNum(v.importeUnitario) * parseNum(v.cantidadCompra) },
      { key: 'fecha', label: 'Fecha compra', col: 'F', type: 'date', default: 'today' },
    ],
  };
  const huertaResumenBoard = {
    id: `huerta-resumen-${year}`,
    kind: 'resumen',
    sheetName: huertaSheet,
    title: 'Resumen',
    titleField: 'planta',
    groupField: 'planta',
    groupBadge: { key: 'importe', label: '', format: 'euro' },
    groupTags: (g) => [
      `Cantidad: ${formatAggValue(g.totals.cantidadCompra, { decimals: 0 })}`,
      `Última compra: ${g.totals.fecha || '—'}`,
    ],
    aggregates: [
      { key: 'importe', op: 'sum', label: 'Importe', format: 'euro' },
      { key: 'cantidadCompra', op: 'sum', label: 'Cantidad', decimals: 0 },
      { key: 'fecha', op: 'max', label: 'Última compra', type: 'date' },
    ],
    fields: [
      { key: 'planta', col: 'B' },
      { key: 'cantidadCompra', col: 'D' },
      { key: 'importe', col: 'E' },
      { key: 'fecha', col: 'F' },
    ],
  };
  const huertaPicker = {
    type: 'picker',
    title: 'Huerta',
    icon: '🥕',
    statBadge: { board: huertaDetalleBoard, key: 'importe', op: 'sum', label: 'Importe total', format: 'euro' },
    items: [huertaResumenBoard, huertaDetalleBoard],
  };

  return {
    type: 'picker',
    title: String(year),
    icon: '📅',
    items: [productosPicker, arbolesBoard, huertaPicker],
  };
}

function buildPlantasModule() {
  return {
    id: 'plantas',
    title: 'Plantas',
    subtitle: 'Huerta, árboles y productos por año',
    icon: '🌱',
    spreadsheetId: PLANTAS_SPREADSHEET_ID,
    tree: PLANTAS_YEARS.map(buildPlantasYear),
  };
}
