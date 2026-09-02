// Datos del módulo "Fontanería": instalación de agua completa, dividida en
// tres tramos (ver FONTANERIA_SECCIONES más abajo) — de momento solo el
// primero ("Manantial a Depósito", manantial subterráneo -> arqueta -> dos
// abrevaderos -> manguera -> depósito) tiene contenido dibujado; los otros
// dos son placeholders "próximamente" hasta que se les añada su propio
// esquema. Igual que Electricidad el Rellano, no lee ninguna hoja de
// cálculo — es contenido fijo. El dibujo del primer tramo (dos vistas SVG:
// lateral y en planta) vive en index.html. SOLO los badges numerados son
// clicables (class="font-hotspot" data-id="<id>") — las formas del dibujo
// (arqueta, abrevaderos, etc.) llevan el mismo data-id pero sin
// class="font-hotspot", para que se resalten al seleccionar su número sin
// ser ellas mismas clicables (evita además problemas de solapamiento entre
// formas muy juntas). `numero` es el badge que se dibuja sobre el esquema;
// todos los elementos tienen uno (incluido el codo con tapa, número 7,
// añadido aparte porque en el esquema original no llevaba número).
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
    numero: 7,
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
  salidaFonsoJoseLuis: {
    numero: 8,
    titulo: 'Sobrante a depósito Fonso y José Luis',
    descripcion: 'Tubo de salida situado en la parte alta del depósito. Cuando el depósito se llena, el agua sobrante sale por aquí hacia el depósito de Fonso y José Luis.',
  },
  salidaChuchoCarmen: {
    numero: 9,
    titulo: 'Tubo a bomba depósito Chucho y Carmen',
    descripcion: 'Tubo de salida situado en la parte baja del depósito. Alimenta la bomba que lleva el agua hasta el depósito de Chucho y Carmen.',
  },
};

// Submenú que se muestra al entrar en "Fontanería": los tres tramos en los
// que se divide la instalación de agua completa. `kind: 'diagram'` es el
// único con esquema propio hoy (abre la pantalla de siempre, con las dos
// vistas SVG y FONTANERIA_ELEMENTOS); `kind: 'proximamente'` abre una
// pantalla sencilla con `mensaje` como único contenido, hasta que se dibuje
// su esquema (mismo patrón: cuando llegue el momento, se le añade su propio
// `kind: 'diagram'`, su SVG en index.html y sus datos, sin tocar el submenú).
const FONTANERIA_SECCIONES = [
  {
    id: 'manantial-deposito',
    kind: 'diagram',
    icon: '🚰',
    titulo: 'Manantial a Depósito',
    subtitulo: 'Manantial, arqueta, abrevaderos y depósito',
  },
  {
    id: 'deposito-casa',
    kind: 'proximamente',
    icon: '🚿',
    titulo: 'Depósito a Casa',
    subtitulo: 'Próximamente',
    mensaje: 'Esta sección todavía no tiene contenido. Aquí se explicará el tramo de tubería desde el depósito hasta la entrada de la casa.',
  },
  {
    id: 'interior-casa',
    kind: 'proximamente',
    icon: '🏠',
    titulo: 'Interior Casa',
    subtitulo: 'Próximamente',
    mensaje: 'Esta sección todavía no tiene contenido. Aquí se explicará la instalación de fontanería dentro de la casa.',
  },
];
