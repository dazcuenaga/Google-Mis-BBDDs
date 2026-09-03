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

// Segundo tramo, "Depósito a Casa": la bomba dentro del depósito, el cuadro
// de presión (caja de activación + presurómetro), la caja de registro con su
// cruz de conexiones, y los tres ramales que salen de la cruz (cabaña, boca
// de agua derecha, boca de agua izquierda -> gallinero). Mismo patrón que
// FONTANERIA_ELEMENTOS: SOLO los badges numerados son clicables, `numero`
// sigue el orden físico del recorrido del agua (bomba -> cuadro -> caja de
// registro -> ramales). El dibujo es UNA sola vista (no hay lateral/planta
// aquí: a diferencia del primer tramo no depende de la altura -el agua va a
// presión, no por gravedad- así que una sola vista de planta/esquema basta),
// vive en index.html dentro de #fontDepositoCasaScreen.
const FONTANERIA_DEPOSITO_CASA_ELEMENTOS = {
  deposito: {
    numero: 1,
    titulo: 'Depósito',
    descripcion: 'El mismo depósito de 2500 litros del tramo anterior. Dentro lleva instalada la bomba que impulsa el agua hacia la casa.',
  },
  bomba: {
    numero: 2,
    titulo: 'Bomba Wilo TWI5-306',
    descripcion: 'Bomba sumergible tipo lápiz, modelo Wilo TWI5-306, instalada dentro del depósito. Impulsa el agua a presión hacia la casa.',
  },
  tuboBombaCuadro: {
    numero: 3,
    titulo: 'Tubo a cuadro de presión',
    descripcion: 'Tubo de PVC semirrígido que lleva el agua a presión desde la bomba hasta el cuadro.',
  },
  cajaActivacion: {
    numero: 4,
    titulo: 'Caja de activación de la bomba',
    descripcion: 'Caja eléctrica de mando y protección de la bomba Wilo TWI5-306.',
  },
  presurometro: {
    numero: 5,
    titulo: 'Presurómetro',
    descripcion: 'Controla la presión de la instalación: arranca la bomba cuando se abre un grifo y la para al alcanzar la presión de corte. De aquí sale la tubería hacia la caja de registro.',
  },
  tuboPresurometroRegistro: {
    numero: 6,
    titulo: 'Tubo a caja de registro',
    descripcion: 'Tubo de PVC semirrígido que lleva el agua desde el presurómetro hasta la caja de registro de fontanería.',
  },
  cajaRegistro: {
    numero: 7,
    titulo: 'Caja de registro de fontanería',
    descripcion: 'Arqueta de registro donde el agua se reparte hacia la cabaña, el gallinero y las bocas de agua mediante una cruz de conexiones.',
  },
  cruz: {
    numero: 8,
    titulo: 'Cruz de conexiones',
    descripcion: 'Pieza en cruz que reparte el agua que llega del presurómetro en tres direcciones: hacia la cabaña, hacia una boca de agua a la derecha y hacia otra boca de agua a la izquierda que continúa hasta el gallinero.',
  },
  tuberiaCabana: {
    numero: 9,
    titulo: 'Tubería a la cabaña',
    descripcion: 'Rama de la cruz de conexiones que lleva el agua hasta la cabaña.',
  },
  grifoDerecha: {
    numero: 10,
    titulo: 'Boca de agua (derecha porche)',
    descripcion: 'Grifo del porche derecho, alimentado directamente desde la cruz de conexiones.',
  },
  grifoIzquierda: {
    numero: 11,
    titulo: 'Boca de agua (izquierda porche)',
    descripcion: 'Grifo del porche izquierdo, alimentado desde la cruz de conexiones; la tubería continúa desde aquí hasta el gallinero.',
  },
  gallinero: {
    numero: 12,
    titulo: 'Boca de agua del gallinero',
    descripcion: 'Final del ramal izquierdo: la tubería continúa desde la primera boca de agua hasta el gallinero, donde conecta con otro grifo.',
  },
  cuadro: {
    numero: 13,
    titulo: 'Cuadro presurómetro y activador bomba',
    descripcion: 'Localizado en Pozo Negro. Dentro lleva la caja de activación de la bomba y el presurómetro, que se ven cada uno por separado en su propio número.',
  },
};

// Tercer tramo, "Interior Casa": la instalación DENTRO de la vivienda, que se
// dibuja como dos rectángulos apilados (uno por planta, lado ancho abajo y
// corto a los lados) — Planta Baja (abajo) y Planta Primera (arriba). El
// reparto de habitaciones de ambas plantas reproduce fielmente el plano de
// referencia (plantas.pptx) que el usuario adjuntó tras corregir el primer
// intento. El tubo de entrada representa la continuación del tramo anterior
// (llega desde la cruz de conexiones de "Depósito a Casa") y entra en la
// Planta Baja desde la parte de ABAJO del dibujo (no desde arriba), hasta un
// baño situado en la zona central de la planta. Dentro del baño está la
// llave principal, de la que salen: WC, lavabo, el trastero (arriba a la
// derecha, con el calentador de agua dentro) y el fregadero de la cocina.
// La lavadora y el lavavajillas NO salen directamente de la llave principal,
// sino que se derivan del propio tubo del fregadero. De la llave principal
// sube además una tubería (el "riser") que atraviesa el hueco entre plantas
// y lleva agua al baño de la Planta Primera, donde hay WC, lavabo y ducha
// propios. La Planta Primera tiene también cinco habitaciones (dormitorios,
// sin instalación propia). TODOS los tubos de este tramo son de agua fría
// (se pintan en azul, a diferencia de los otros dos tramos, que mantienen el
// gris estándar). Mismo patrón que los dos tramos anteriores: SOLO los
// badges numerados son clicables, `numero` sigue el orden físico del
// recorrido del agua.
const FONTANERIA_INTERIOR_CASA_ELEMENTOS = {
  tuboEntrada: {
    numero: 1,
    titulo: 'Tubo de entrada',
    descripcion: 'Viene de la cruz de conexiones del tramo anterior (Depósito a Casa) y entra en la planta baja por la parte de abajo del dibujo, hasta la llave principal del baño. (agua fría)',
  },
  bano: {
    numero: 2,
    titulo: 'Cuarto de baño',
    descripcion: 'Cuarto de baño de la planta baja, en la zona central del dibujo. Dentro está la llave principal y las salidas al WC y al lavabo.',
  },
  llavePrincipal: {
    numero: 3,
    titulo: 'Llave principal',
    descripcion: 'Punto donde llega el tubo de entrada, dentro del baño. De aquí salen las tuberías que reparten el agua por la planta baja (WC, lavabo, trastero y fregadero) y la que sube a la Planta Primera. (agua fría)',
  },
  wc: {
    numero: 4,
    titulo: 'WC',
    descripcion: 'Tubería de la llave principal a la cisterna del WC del baño. (agua fría)',
  },
  lavabo: {
    numero: 5,
    titulo: 'Lavabo',
    descripcion: 'Tubería de la llave principal al lavabo del baño. (agua fría)',
  },
  trastero: {
    numero: 6,
    titulo: 'Trastero',
    descripcion: 'Cuarto situado arriba a la derecha de la planta baja, con el calentador de agua dentro.',
  },
  fregaderoCocina: {
    numero: 7,
    titulo: 'Fregadero de la cocina',
    descripcion: 'Tubería de la llave principal al fregadero de la cocina, en la pared derecha de la planta baja. La lavadora y el lavavajillas se derivan de este mismo tubo. (agua fría)',
  },
  lavadora: {
    numero: 8,
    titulo: 'Lavadora',
    descripcion: 'Tubería que se deriva del tubo del fregadero de la cocina (no de la llave principal directamente) hasta la lavadora, en la pared derecha de la planta baja, encima del fregadero. (agua fría)',
  },
  lavavajillas: {
    numero: 9,
    titulo: 'Lavavajillas',
    descripcion: 'Tubería que se deriva del tubo del fregadero de la cocina (no de la llave principal directamente) hasta el lavavajillas, en la pared derecha de la planta baja, debajo del fregadero. (agua fría)',
  },
  habitaciones: {
    numero: 10,
    titulo: 'Habitaciones',
    descripcion: 'Los cinco dormitorios de la Planta Primera. No tienen instalación de fontanería propia.',
  },
  banoPlantaPrimera: {
    numero: 11,
    titulo: 'Baño de la Planta Primera',
    descripcion: 'Recibe agua mediante una tubería que sube desde la llave principal de la planta baja, atravesando el hueco entre plantas. Dentro tiene WC, lavabo y ducha, cada uno con su propia derivación. (agua fría)',
  },
  wcPlantaPrimera: {
    numero: 12,
    titulo: 'WC (Planta Primera)',
    descripcion: 'Tubería que sube desde la llave principal de la planta baja hasta la cisterna del WC del baño de la Planta Primera. (agua fría)',
  },
  lavaboPlantaPrimera: {
    numero: 13,
    titulo: 'Lavabo (Planta Primera)',
    descripcion: 'Tubería que sube desde la llave principal de la planta baja hasta el lavabo del baño de la Planta Primera. (agua fría)',
  },
  duchaPlantaPrimera: {
    numero: 14,
    titulo: 'Ducha (Planta Primera)',
    descripcion: 'Tubería que sube desde la llave principal de la planta baja hasta la ducha del baño de la Planta Primera. (agua fría)',
  },
};

// Submenú que se muestra al entrar en "Fontanería": los tres tramos en los
// que se divide la instalación de agua completa. `kind: 'diagram'` tiene
// esquema propio (id 'manantial-deposito' abre #fontaneriaScreen con
// FONTANERIA_ELEMENTOS; id 'deposito-casa' abre #fontDepositoCasaScreen con
// FONTANERIA_DEPOSITO_CASA_ELEMENTOS; id 'interior-casa' abre
// #fontInteriorCasaScreen con FONTANERIA_INTERIOR_CASA_ELEMENTOS — el
// dispatch por id vive en renderFontMenu(), en app.js). `kind: 'proximamente'`
// abre una pantalla sencilla con `mensaje` como único contenido, hasta que se
// dibuje su esquema (mismo patrón: cuando llegue el momento, se le añade su
// propia pantalla + función open... y se cambia su kind a 'diagram' aquí) —
// de momento las tres secciones ya tienen esquema propio, pero el mecanismo
// se deja tal cual por si hiciera falta para una futura sección nueva.
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
    kind: 'diagram',
    icon: '🚿',
    titulo: 'Depósito a Casa',
    subtitulo: 'Bomba, cuadro de presión, caja de registro y bocas de agua',
  },
  {
    id: 'interior-casa',
    kind: 'diagram',
    icon: '🏠',
    titulo: 'Interior Casa',
    subtitulo: 'Planta baja: baño, calentador y fregadero',
  },
];
