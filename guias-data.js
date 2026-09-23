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
  { id: 'alicate', icon: '🛠️', titulo: 'Tipos de Alicate', imagen: 'guias/tipos-de-alicate.png' },
  { id: 'brocas', icon: '🛠️', titulo: 'Tipos de Brocas', imagen: 'guias/tipos-de-brocas.png' },
  { id: 'cabezas-tornillos', icon: '🔩', titulo: 'Tipos de Cabezas de Tornillos', imagen: 'guias/tipos-de-cabezas-de-tornillos.png' },
  { id: 'discos-amoladora', icon: '⚙️', titulo: 'Tipos de Disco para Amoladora', imagen: 'guias/tipos-de-disco-para-amoladora.png' },
  { id: 'lija', icon: '🧽', titulo: 'Tipos de Lija', imagen: 'guias/tipos-de-lija.png' },
  { id: 'tacos', icon: '🔧', titulo: 'Tipos de Tacos', imagen: 'guias/tipos-de-tacos.png' },
];
