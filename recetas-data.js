// Datos del módulo "Recetas": no lee ninguna hoja de cálculo — es contenido
// fijo, igual que Electricidad el Rellano y Fontanería (ver esos módulos
// para el mismo patrón `custom: '<nombre>'`). Se divide en cuatro apartados
// (RECETAS_SECCIONES, mismo patrón de submenú que FONTANERIA_SECCIONES):
// Salsas, Encurtidos, Postres, Comidas. Cada apartado tiene su propia lista
// de recetas en RECETAS_POR_SECCION[seccion.id] — de momento solo "Salsas"
// tiene contenido (las dos recetas de mojo); los otros tres apartados están
// vacíos hasta que se les añadan recetas (la app muestra un aviso "todavía
// no hay recetas" en vez de una lista vacía, no hace falta tocar nada aquí
// para eso). Cada receta es una "ficha" con `titulo`, `ingredientes` (lista
// de líneas de texto) y `pasos` (lista de líneas de texto, en el orden de
// preparación) — la app las renderiza como lista de ingredientes + pasos
// numerados, sin necesitar más estructura que esta.
const RECETAS_SECCIONES = [
  { id: 'salsas', icon: '🥫', titulo: 'Salsas', subtitulo: 'Mojos y salsas' },
  { id: 'encurtidos', icon: '🥒', titulo: 'Encurtidos', subtitulo: 'Conservas en vinagre' },
  { id: 'postres', icon: '🍰', titulo: 'Postres', subtitulo: 'Dulces y repostería' },
  { id: 'comidas', icon: '🍽️', titulo: 'Comidas', subtitulo: 'Platos principales' },
];

const RECETAS_SALSAS = [
  {
    id: 'mojoRojo',
    titulo: 'Mojo rojo',
    ingredientes: [
      'Medio pimiento rojo en trozos',
      '3 ó 4 dientes de ajo medianos',
      'Un pimiento choricero o ñora hidratado en agua caliente',
      "Aceite 0'4 (o mezcla de oliva virgen y girasol si es lo que tienes) — llenar unos tres dedos de la batidora",
      'Cominos en polvo',
      'Sal',
      'Pimentón picante o dulce',
      'Opcional: una cayena',
      'Un chorro de vinagre',
    ],
    pasos: [
      'En el vaso de la batidora, poner el pimiento rojo en trozos, los dientes de ajo, el pimiento choricero (o ñora) hidratado en agua caliente y el aceite.',
      'Echar los cominos en polvo, la sal, el pimentón picante o dulce y, opcional, una cayena.',
      'Batir todo y echar un chorro de vinagre.',
      'Si hace falta, corregir y añadir cominos.',
    ],
  },
  {
    id: 'mojoVerde',
    titulo: 'Mojo verde',
    ingredientes: [
      'Un manojo de cilantro',
      'Medio pimiento verde en trozos',
      '3 ó 4 dientes de ajo medianos',
      "Aceite 0'4 (o mezcla de oliva virgen y girasol si es lo que tienes) — llenar unos tres dedos de la batidora",
      'Cominos',
      'Sal',
      'Un chorro de vinagre',
    ],
    pasos: [
      'En el vaso de la batidora, poner el manojo de cilantro, el pimiento verde en trozos, los dientes de ajo y el aceite.',
      'Echar los cominos y la sal.',
      'Batir todo y echar un chorro de vinagre.',
      'Si hace falta, corregir y echar más cominos.',
    ],
  },
];

const RECETAS_ENCURTIDOS = [];
const RECETAS_POSTRES = [];
const RECETAS_COMIDAS = [];

const RECETAS_POR_SECCION = {
  salsas: RECETAS_SALSAS,
  encurtidos: RECETAS_ENCURTIDOS,
  postres: RECETAS_POSTRES,
  comidas: RECETAS_COMIDAS,
};
