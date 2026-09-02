// Datos del módulo "Fontanería": esquema de la instalación de agua (manantial
// subterráneo -> arqueta -> dos abrevaderos -> manguera -> depósito). Igual
// que Electricidad el Rellano, no lee ninguna hoja de cálculo — es contenido
// fijo. El propio dibujo (dos vistas SVG: lateral y en planta) vive en
// index.html; cada forma clicable lleva class="font-hotspot" y
// data-id="<id>" que coincide con una clave de FONTANERIA_ELEMENTOS, para que
// app.js pueda enlazar clic -> título/descripción sin duplicar coordenadas
// aquí. `numero` es el discreto badge numerado que se dibuja sobre el
// esquema (null si el elemento no lleva número, como el codo con tapa).
const FONTANERIA_ELEMENTOS = {
  manantial: {
    numero: 1,
    titulo: 'Manantial subterráneo',
    descripcion: 'Es el punto más elevado de toda la instalación. Al estar más alto que el resto, llena la arqueta por gravedad, sin necesidad de ninguna bomba.',
  },
  arqueta: {
    numero: 2,
    titulo: 'Arqueta',
    descripcion: 'Se llena por gravedad desde el manantial. Tiene dos salidas con llave: una alimenta directamente el primer abrevadero; la otra discurre por el lateral de los abrevaderos y se introduce al final en el segundo, para conectarse al codo con tapa.',
  },
  abrevadero1: {
    numero: 3,
    titulo: 'Primer abrevadero',
    descripcion: 'Se llena por filtración desde la arqueta. Está unido y al mismo nivel que la arqueta y el segundo abrevadero.',
  },
  abrevadero2: {
    numero: 4,
    titulo: 'Segundo abrevadero',
    descripcion: 'Se llena por filtración desde el primer abrevadero.',
  },
  codo: {
    numero: null,
    titulo: 'Codo con tapa',
    descripcion: 'Está en la pared final del segundo abrevadero. Permite conectar la manguera y tomar agua directamente del abrevadero en caso de necesidad.',
  },
  manguera: {
    numero: 5,
    titulo: 'Manguera',
    descripcion: 'Manguera flexible de unos 20 metros aproximados que conecta el codo con tapa del segundo abrevadero con el depósito.',
  },
  deposito: {
    numero: 6,
    titulo: 'Depósito',
    descripcion: 'Depósito de 2500 litros, situado al final de la manguera.',
  },
};
