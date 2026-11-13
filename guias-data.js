// Datos del módulo "Guías": no lee ninguna hoja de cálculo — es una galería
// fija de imágenes de guías rápidas (herramientas, tornillería, etc.,
// aportadas por el usuario desde su carpeta de Descargas), igual que
// Electricidad el Rellano / Fontanería / Recetas (ver esos módulos para el
// mismo patrón `custom: '<nombre>'`). Las imágenes viven en la carpeta
// guias/ del propio proyecto (para que se sirvan igual que el resto de la
// app en GitHub Pages), con nombre de archivo normalizado (sin espacios ni
// tildes) aunque el título mostrado sí lleve el nombre original.
//
// Cada guía de GUIAS_LISTA es:
//   - `id`, `icon` (emoji), `titulo`
//   - o bien `imagen` (ruta a un único archivo dentro de guias/), o bien
//     `imagenes` (lista de { id, titulo, imagen } cuando la guía tiene
//     varias fotos — caso de Multímetro: Uso y Símbolos). Con `imagenes`,
//     tocar la guía en el listado abre antes un submenú (mismo patrón que
//     el listado principal) con esos apartados; cada uno abre su imagen.
//   - o bien `html` (ficha de texto con su propio contenido, ej. el cuadro
//     eléctrico): se pinta tal cual en la misma pantalla que las imágenes
//     (guiaImagenScreen, ver openGuiaImagen en app.js). Es contenido propio de
//     este archivo, nunca datos de usuario, por eso se inserta sin escapar.

// Esquema SVG del cuadro eléctrico de una vivienda con electrificación básica
// (derivación → general → diferencial → 5 circuitos). El grosor de la línea de
// cada circuito es proporcional a la sección de su cable. Colores con las
// variables de style.css para que valga en tema claro y oscuro.
function cuadroElectricoSvg() {
  const edge = 'var(--text-dim)', accent = 'var(--primary)', ink = 'var(--text)', quiet = 'var(--text-dim)';
  const head = (y, nombre, detalle) => `
    <rect x="240" y="${y}" width="280" height="48" rx="8" fill="none" stroke="${edge}" stroke-width="1.25"/>
    <text x="380" y="${y + 20}" text-anchor="middle" font-weight="600" fill="${ink}">${nombre}</text>
    <text x="380" y="${y + 38}" text-anchor="middle" font-size="11.5" fill="${quiet}">${detalle}</text>`;
  const circuitos = [
    { cx: 104, id: 'C1', uso: ['Iluminación'], cable: '1,5', grosor: 1.65, magneto: 10 },
    { cx: 242, id: 'C2', uso: ['Enchufes', 'generales'], cable: '2,5', grosor: 2.75, magneto: 16 },
    { cx: 380, id: 'C3', uso: ['Vitrocerámica', 'y horno'], cable: '6', grosor: 6.6, magneto: 25 },
    { cx: 518, id: 'C4', uso: ['Lavadora y', 'lavavajillas'], cable: '4', grosor: 4.4, magneto: 20 },
    { cx: 656, id: 'C5', uso: ['Enchufes', 'húmedos'], cable: '2,5', grosor: 2.75, magneto: 16 },
  ];
  const circuito = (c) => `
    <rect x="${c.cx - 62}" y="276" width="124" height="116" rx="8" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-width="1.25"/>
    <text x="${c.cx}" y="298" text-anchor="middle" font-weight="600" fill="${ink}">${c.id}</text>
    ${c.uso.map((t, i) => `<text x="${c.cx}" y="${316 + i * 15}" text-anchor="middle" font-size="11.5" fill="${ink}">${t}</text>`).join('')}
    <line x1="${c.cx - 30}" x2="${c.cx + 30}" y1="346" y2="346" stroke="${ink}" stroke-width="${c.grosor}" stroke-linecap="round"/>
    <text x="${c.cx}" y="366" text-anchor="middle" font-size="11.5" fill="${quiet}">Cable ${c.cable} mm²</text>
    <text x="${c.cx}" y="384" text-anchor="middle" font-weight="600" fill="${ink}">Magneto ${c.magneto} A</text>`;
  const bajadas = circuitos.map((c) => `<path d="M${c.cx} 256V276" marker-end="url(#cuadro-arrow)"/>`).join('');
  return `<svg viewBox="0 0 760 416" role="img" aria-label="Cinco circuitos cuelgan del general y del diferencial" font-size="13">
    <defs><marker id="cuadro-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${edge}"/></marker></defs>
    <text x="24" y="28" font-size="15" font-weight="600" fill="${ink}">Cinco circuitos cuelgan del general y del diferencial</text>
    ${head(52, 'Derivación individual', 'Cable de 10 mm²')}
    ${head(120, 'Magnetotérmico general', '40 A')}
    ${head(188, 'Diferencial', '30 mA · corta si hay fuga a tierra')}
    <g fill="none" stroke="${edge}" stroke-width="1.25">
      <path d="M380 100V120" marker-end="url(#cuadro-arrow)"/><path d="M380 168V188" marker-end="url(#cuadro-arrow)"/>
      <path d="M380 236V256"/><path d="M104 256H656"/>${bajadas}
    </g>
    <text x="392" y="250" font-size="11.5" fill="${quiet}">cinco circuitos en paralelo</text>
    ${circuitos.map(circuito).join('')}
  </svg>`;
}

const GUIA_BIGMAT = 'https://cdnstatic.bigmat.es/bigmat/storage//ProductAttachmentsB2C/';

const GUIA_CUADRO_ELECTRICO_HTML = `
  <p>Una vivienda con electrificación básica reparte la corriente en cinco circuitos, cada uno con un cable y un magnetotérmico coordinados, detrás de un magnetotérmico general y un diferencial.</p>

  <h2>Esquema</h2>
  <div class="guia-doc-scroll guia-doc-svg">${cuadroElectricoSvg()}</div>
  <p>El grosor de la línea de cada circuito es proporcional a la sección de su cable. C4 también alimenta el termo y C5 cubre los enchufes de baños y auxiliares de cocina.</p>

  <h2>Qué hace cada protección</h2>
  <p>El magnetotérmico protege el cable y el diferencial protege a las personas; por eso cada circuito necesita las dos cosas.</p>
  <ul>
    <li><strong>Magnetotérmico general (40 A):</strong> protege toda la vivienda y corta si se supera su intensidad o hay un cortocircuito.</li>
    <li><strong>Diferencial (30 mA):</strong> corta si detecta una fuga a tierra, por ejemplo si alguien toca algo que da corriente. Es la norma general (REBT); no sale en el vídeo de origen.</li>
    <li><strong>Magnetotérmico individual:</strong> protege el cable de su circuito y debe estar coordinado con su sección. Si una intensidad mayor que la del cable no corta, el cable se calienta, se deteriora el aislamiento y puede haber un incendio.</li>
  </ul>
  <p>Por eso no vale subir el automático porque «salta mucho». Si un magnetotérmico salta a menudo, hay que buscar la causa: demasiados aparatos en ese circuito, un aparato averiado o un fallo en la instalación.</p>

  <h2>Modelos Schneider Resi9</h2>
  <p>Para un cuadro genérico de 40 A hacen falta tres referencias Resi9, todas de la gama pensada para viviendas.</p>
  <div class="guia-doc-scroll">
    <table>
      <thead><tr><th>Elemento</th><th>Valor</th><th>Referencia Resi9</th></tr></thead>
      <tbody>
        <tr><td>Magnetotérmico general</td><td>40 A, 2 polos, curva C, 6000 A de poder de corte</td><td><a href="${GUIA_BIGMAT}5401500.FT%20DIFERENCIAL%20R9F12240.pdf" target="_blank" rel="noopener">R9F12240</a></td></tr>
        <tr><td>Diferencial (corta por fuga a tierra)</td><td>30 mA, 40 A, 2 polos, clase AC</td><td><a href="${GUIA_BIGMAT}5401501.%20FT%20DIFERENCIAL%20R9R51240.pdf" target="_blank" rel="noopener">R9R51240</a></td></tr>
        <tr><td>Magnetotérmico individual</td><td>16 A, 1P+N, curva C, 6000 A de poder de corte</td><td><a href="${GUIA_BIGMAT}5401490.%20FT%20DIFERENCIAL%20R9F12616.pdf" target="_blank" rel="noopener">R9F12616</a></td></tr>
      </tbody>
    </table>
  </div>
  <p>Un diferencial de clase A (R9R31240) también existe, pero cuesta bastante más que el de clase AC. Antes de comprar, confirma con un electricista o con el distribuidor que las referencias encajan con la instalación (potencia contratada, tipo de diferencial y marca ya instalada).</p>

  <h2>Fuentes</h2>
  <p>Secciones y protecciones de los circuitos: texto del reel de gerelectrics (Instagram) y su pie de publicación. Referencias Resi9: fichas de producto de BigMat.</p>
  <ul>
    <li><a href="${GUIA_BIGMAT}5401500.FT%20DIFERENCIAL%20R9F12240.pdf" target="_blank" rel="noopener">Ficha R9F12240</a></li>
    <li><a href="${GUIA_BIGMAT}5401501.%20FT%20DIFERENCIAL%20R9R51240.pdf" target="_blank" rel="noopener">Ficha R9R51240</a></li>
    <li><a href="${GUIA_BIGMAT}5401490.%20FT%20DIFERENCIAL%20R9F12616.pdf" target="_blank" rel="noopener">Ficha R9F12616</a></li>
  </ul>
`;

// Cartucho de silicona dibujado (ilustración, no foto) con la etiqueta del tipo.
// Los colores solo sirven para distinguir un tipo de otro: los botes reales
// varían según la marca.
function siliconaBoteSvg(nombre, color, tipo) {
  const borde = 'var(--text-dim)';
  return `<svg viewBox="0 0 60 150" role="img" aria-label="Cartucho de silicona ${tipo} (ilustración)">
    <path d="M26 4h8l2 18H24z" fill="#d6d3cc" stroke="${borde}" stroke-width="1.2" stroke-linejoin="round"/>
    <rect x="19" y="22" width="22" height="8" rx="2" fill="#bdb9af" stroke="${borde}" stroke-width="1.2"/>
    <rect x="12" y="30" width="36" height="98" rx="4" fill="#f1efe8" stroke="${borde}" stroke-width="1.2"/>
    <rect x="12" y="46" width="36" height="66" fill="${color}"/>
    <text transform="translate(34 79) rotate(-90)" text-anchor="middle" font-size="${nombre.length > 8 ? 8.5 : 10.5}" font-weight="700" fill="#fff" letter-spacing="0.4">${nombre}</text>
    <rect x="15" y="128" width="30" height="9" rx="3" fill="#bdb9af" stroke="${borde}" stroke-width="1.2"/>
  </svg>`;
}
const siliconaBote = (nombre, color, tipo) => `<div class="silicona-bote">${siliconaBoteSvg(nombre, color, tipo)}</div>`;

// Guía de tipos de silicona, basada en la transcripción de un vídeo de
// Instagram (Tu Vuelta de Tuerca).
const GUIA_SILICONAS_HTML = `
  <p>Qué tipo de silicona elegir según el material y el sitio donde se va a usar: acética, neutra, acrílica y las de usos especiales.</p>

  <div class="guia-doc-scroll">
    <table>
      <thead><tr><th>Tipo</th><th>Sirve para</th><th>Evitar en</th></tr></thead>
      <tbody>
        <tr><td><strong>Acética</strong></td><td>Baños y zonas húmedas; vidrio, cerámica, azulejo y aluminio</td><td>Espejos, metales ferrosos y materiales porosos (hormigón, mármol)</td></tr>
        <tr><td><strong>Neutra</strong></td><td>Materiales delicados y porosos; juntas de dilatación en fachadas y exteriores</td><td>—</td></tr>
        <tr><td><strong>Acrílica</strong></td><td>Interiores con poco movimiento; grietas, rodapiés, zócalos y marcos</td><td>Agua estancada y exteriores con humedad extrema</td></tr>
        <tr><td><strong>Alta temperatura</strong></td><td>Hornos, motores, tuberías, calefacción y chimeneas (hasta 300 °C)</td><td>—</td></tr>
        <tr><td><strong>Polímeros MS</strong></td><td>Pegar y sellar a la vez, incluso en mojado o bajo agua; estanqueidad en paredes, ventanas y tejados</td><td>—</td></tr>
      </tbody>
    </table>
  </div>

  <h2>1. Silicona acética</h2>
  ${siliconaBote('ACÉTICA', '#b45309', 'acética')}
  <p>El tipo más común y económico, muy usado en cuartos de baño o zonas húmedas. Desprende un fuerte olor a vinagre durante el secado, por la liberación de ácido acético. Ofrece una excelente elasticidad y resistencia mecánica.</p>
  <ul>
    <li><strong>Ideal para:</strong> materiales no porosos como el vidrio, la cerámica, el azulejo y el aluminio.</li>
    <li><strong>No usar en espejos,</strong> porque daña la laca posterior.</li>
    <li><strong>No usar en metales ferrosos,</strong> porque los corroe.</li>
    <li><strong>No usar en materiales de construcción porosos,</strong> como el hormigón o el mármol.</li>
  </ul>

  <h2>2. Silicona neutra</h2>
  ${siliconaBote('NEUTRA', '#1d4ed8', 'neutra')}
  <p>Carece de ácidos y no desprende olor fuerte. Destaca por su máxima elasticidad y su resistencia a los rayos ultravioleta y a la intemperie. Es la opción más segura y versátil del mercado.</p>
  <ul>
    <li><strong>Perfecta para:</strong> materiales delicados y porosos como el mármol, el hormigón, la madera, el PVC, los plásticos y el espejo.</li>
    <li><strong>La más recomendada</strong> para juntas de dilatación en fachadas y exteriores.</li>
  </ul>

  <h2>3. Silicona acrílica</h2>
  ${siliconaBote('ACRÍLICA', '#6b7280', 'acrílica')}
  <p>Su fórmula se basa en polímeros derivados del ácido acrílico. A diferencia de las siliconas puras, se puede pintar y barnizar una vez se ha secado por completo. Muy usada para juntas en interiores con poco movimiento.</p>
  <ul>
    <li><strong>Se usa para:</strong> tapar grietas en paredes de yeso, sellar rodapiés o zócalos, y marcos de puertas o ventanas.</li>
    <li><strong>Limitaciones:</strong> no resiste el agua estancada ni es apta para exteriores expuestos a la humedad extrema.</li>
  </ul>

  <h2>4. Siliconas con usos especiales</h2>
  <ul>
    <li>${siliconaBote('ALTA TEMP.', '#b91c1c', 'para altas temperaturas')}<strong>Silicona para altas temperaturas:</strong> formulación especial capaz de resistir hasta 300 grados sin perder sus propiedades. Se utiliza para el sellado de juntas en hornos, motores, tuberías, calefacción o chimeneas.</li>
    <li>${siliconaBote('MS', '#15803d', 'de polímero MS')}<strong>Polímeros MS:</strong> aunque técnicamente es una evolución química, se comercializan junto a la silicona. Tienen la ventaja de que pegan y sellan al mismo tiempo, incluso sobre superficies totalmente mojadas o bajo agua. Muy usados para mantener la estanqueidad en paredes, ventanas o tejados.</li>
  </ul>

  <h2>Fuente</h2>
  <p>Transcripción de un vídeo de Instagram de Tu Vuelta de Tuerca.</p>
`;

const GUIAS_LISTA = [
  {
    id: 'multimetro',
    icon: '🔌',
    titulo: 'Multímetro',
    imagenes: [
      { id: 'uso', titulo: 'Uso', imagen: 'guias/multimetro-uso.png' },
      { id: 'simbolos', titulo: 'Símbolos', imagen: 'guias/multimetro-simbolos.png' },
    ],
  },
  { id: 'cuadro-electrico', icon: '⚡', titulo: 'Cuadro eléctrico de vivienda', html: GUIA_CUADRO_ELECTRICO_HTML },
  { id: 'alicate', icon: '🛠️', titulo: 'Tipos de Alicate', imagen: 'guias/tipos-de-alicate.png' },
  { id: 'brocas', icon: '🛠️', titulo: 'Tipos de Brocas', imagen: 'guias/tipos-de-brocas.png' },
  { id: 'cabezas-tornillos', icon: '🔩', titulo: 'Tipos de Cabezas de Tornillos', imagen: 'guias/tipos-de-cabezas-de-tornillos.png' },
  { id: 'discos-amoladora', icon: '⚙️', titulo: 'Tipos de Disco para Amoladora', imagen: 'guias/tipos-de-disco-para-amoladora.png' },
  { id: 'lija', icon: '🧽', titulo: 'Tipos de Lija', imagen: 'guias/tipos-de-lija.png' },
  { id: 'tacos', icon: '🔧', titulo: 'Tipos de Tacos', imagen: 'guias/tipos-de-tacos.png' },
  { id: 'siliconas', icon: '🧴', titulo: 'Tipos de Silicona', html: GUIA_SILICONAS_HTML },
];
