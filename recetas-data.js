// Datos del módulo "Recetas": no lee ninguna hoja de cálculo — es contenido
// fijo, igual que Electricidad el Rellano y Fontanería (ver esos módulos
// para el mismo patrón `custom: '<nombre>'`). Se divide en cuatro apartados
// (RECETAS_SECCIONES, mismo patrón de submenú que FONTANERIA_SECCIONES):
// Salsas, Encurtidos y Conservas, Postres, Comidas. Cada apartado tiene su
// propia lista de recetas en RECETAS_POR_SECCION[seccion.id] — de momento
// "Salsas" (las dos recetas de mojo) y "Encurtidos y Conservas" (las 5
// fichas del recetario de conservas/encurtidos, transcritas del PDF
// "fichasencurtidosconservas.pdf" que aportó el usuario el 2026-09-03)
// tienen contenido; Postres y Comidas siguen vacíos hasta que se les añadan
// recetas (la app muestra un aviso "todavía no hay recetas" en vez de una
// lista vacía, no hace falta tocar nada aquí para eso).
//
// Cada receta es una "ficha" con:
//   - `titulo` (string, obligatorio)
//   - `resumen` (string opcional) — línea corta bajo el título, p.ej.
//     "Conservación: 6 meses • Dificultad: Media • Método: Baño de aceite".
//   - `ingredientes` (lista, obligatoria) — cada elemento puede ser:
//       (a) un string simple (formato original, usado por las recetas de
//           mojo: "3 ó 4 dientes de ajo medianos"), o
//       (b) un objeto `{ nombre, cantidad }` (formato "tabla", usado por
//           las fichas de conservas: nombre del ingrediente + su cantidad/
//           proporción recomendada, como en el PDF origen). app.js
//           (renderRecetaFicha) distingue el tipo con `typeof` y renderiza
//           cada uno con su propio marcado — no hace falta normalizar todo
//           a un único formato.
//   - `pasos` (lista de strings, obligatoria, en el orden de preparación).
//     Para las fichas de conservas cada paso empieza por su nombre corto
//     tal cual aparece en el PDF ("Sudado (deshidratación): ..."), como un
//     único string — no hace falta estructura adicional para eso.
//   - `notaConservacion` (string opcional) — el párrafo de conservación del
//     final de cada ficha del PDF ("Se conserva de forma segura por..."),
//     se renderiza en una caja destacada al final de la ficha.
//
// Una sección de RECETAS_SECCIONES puede además llevar un campo `nota`
// (string opcional) — un aviso que se muestra encima de la lista de
// recetas de ese apartado (y también encima del aviso de "todavía no hay
// recetas" si aún no tiene ninguna). Se usa aquí para la "Regla de oro de
// seguridad alimentaria" del recetario de conservas (evitar el botulismo),
// que aplica a todo el apartado y no a una receta en concreto.
const RECETAS_SECCIONES = [
  { id: 'salsas', icon: '🥫', titulo: 'Salsas', subtitulo: 'Mojos y salsas' },
  {
    id: 'encurtidos',
    icon: '🥒',
    titulo: 'Encurtidos y Conservas',
    subtitulo: 'Conservas y encurtidos caseros',
    nota:
      'Regla de oro de seguridad alimentaria (evita el botulismo): desinfecta o esteriliza tarros y tapas en agua ' +
      'hirviendo durante mínimo 10 minutos. No acortes las proporciones de vinagre, pues su acidez (pH bajo) evita ' +
      'que proliferen microorganismos. Si al ir a consumir una conserva notas la tapa hinchada, una capa de moho, ' +
      'mal olor o un sabor extraño, DESÉCHALA de inmediato sin probarla.',
  },
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

const RECETAS_ENCURTIDOS = [
  {
    id: 'berenjenasConservaAsadas',
    titulo: 'Berenjenas en conserva asadas',
    resumen: 'Conservación: 6 meses • Dificultad: Media • Método: Baño de aceite',
    ingredientes: [
      { nombre: 'Berenjenas', cantidad: 'Frescas, sanas y tersas. En rodajas de 0.5 a 1 cm.' },
      { nombre: 'Sal fina o gruesa', cantidad: 'Abundante (usada para el proceso de deshidratación inicial).' },
      {
        nombre: 'Aceite de oliva virgen extra',
        cantidad: 'Para pincelar, asar a fuego medio-bajo y cubrir por completo el bote.',
      },
      {
        nombre: 'Aromatizantes de elección',
        cantidad: 'Pimienta negra en grano o molida. Opcional: romero o tomillo fresco.',
      },
    ],
    pasos: [
      'Preparación: lave y seque bien las berenjenas. Córtelas en rodajas de 0.5 cm a 1 cm de grosor.',
      'Sudado (deshidratación): colóquelas en capas dentro de un colador grande añadiendo sal sin miedo entre cada capa. Deje reposar 1 hora completa. Esto forzará la salida del agua de vegetación, quitando su amargor.',
      'Lavado: lávelas muy bien en un bol con agua limpia durante 2 o 3 minutos para retirar por completo el exceso de sal.',
      'Secado exhaustivo: extienda las rodajas sobre papel de cocina absorbente. Cúbralas con más papel y presione. Cambie las capas de papel hasta que salgan completamente secas. Retirar toda la humedad es un paso crítico.',
      'Pincelado: pincele ligeramente cada rodaja con aceite de oliva virgen por ambas caras para evitar que absorban grasa de más.',
      'Asado: cocínelas en una sartén o parrilla a fuego medio-bajo con un chorrito de aceite de oliva hasta que se doren un poco y se reblandezcan (sin quemarse).',
      'Envasado: en botes esterilizados previamente, vaya colocando capas de berenjena intercalando pimienta negra molida o en grano al gusto.',
      'Cobertura: llene el bote cubriendo totalmente los vegetales con aceite de oliva virgen extra. Elimine burbujas de aire, cierre herméticamente y reserve en un lugar oscuro.',
    ],
    notaConservacion:
      'Se conserva de forma segura por un periodo de hasta 6 meses en un lugar oscuro y bien cerrado. Una vez que ' +
      'abra el tarro para su consumo, guárdelo obligatoriamente dentro del refrigerador.',
  },
  {
    id: 'conservaPimientosAsados',
    titulo: 'Conserva de pimientos asados',
    resumen: 'Conservación: 1 año • Dificultad: Media-alta • Método: Baño María al vacío',
    ingredientes: [
      { nombre: 'Pimientos rojos carnosos', cantidad: 'Pimientos frescos y con buena carne.' },
      { nombre: 'Aceite de oliva', cantidad: 'Chorro generoso para facilitar el pelado y la capa de sellado.' },
      { nombre: 'Jugo de cocción', cantidad: 'Líquido natural liberado por el pimiento durante el asado y corte.' },
      { nombre: 'Agua', cantidad: 'Cantidad necesaria para hervir al baño maría.' },
    ],
    pasos: [
      'Preparación del horno: lave y seque los pimientos. Dispóngalos enteros en una bandeja de horno con papel sulfurizado.',
      'Horneado protegido: agregue un chorro de aceite de oliva sobre ellos. Cúbralos por encima con papel de aluminio para que no se tueste la piel superior. Hornee a 180 ºC durante 1 hora completa.',
      'Control de cocción: dé la vuelta a los pimientos cada 15 minutos para asarlos de forma uniforme. Los más chicos pueden estar listos en 45 minutos; los de mayor grosor requerirán la hora entera.',
      'Recuperación del jugo: coloque los pimientos calientes en una fuente. No tire el jugo acumulado en la bandeja. Abra los pimientos a la mitad para que escurran su delicioso caldo interno y agréguelo al jugo anterior.',
      'Limpieza: retire la piel con cuidado (saldrá sumamente fácil gracias al aceite) y quite todas las semillas y el tallo.',
      'Envasado: coloque los pimientos en botes esterilizados en trozos medianos, compactándolos un poco para que no queden bolsas de aire.',
      'Sellado: vierta el jugo natural recuperado hasta cubrir los pimientos. Finalice agregando un chorrito de aceite de oliva en la parte superior para hacer una capa aislante. Cierre los botes con fuerza.',
      'Hervido al baño María: coloque un trapo al fondo de una olla con agua. Introduzca los botes y asegúrese de que el agua los cubra por completo (incluida la tapa). Hierva a fuego medio-suave durante 15 minutos.',
    ],
    notaConservacion:
      'Al realizarse un sellado al vacío por baño maría, esta conserva dura hasta 1 año entero si se almacena en un ' +
      'sitio oscuro y fresco. Al abrir, conserve en el refrigerador.',
  },
  {
    id: 'alficozAgridulce',
    titulo: 'Alficoz (pepino) agridulce',
    resumen: 'Conservación: 3 a 6 meses • Dificultad: Media • Método: Acidificación agridulce',
    ingredientes: [
      { nombre: 'Alficoz o pepino común', cantidad: 'Fresco. En tiras o rodajas gruesas de 1 a 1.5 cm sin semillas.' },
      {
        nombre: 'Líquido de gobierno',
        cantidad: '750 ml de agua por 250 ml de vinagre de manzana (proporción clásica de 3 a 1).',
      },
      { nombre: 'Endulzante', cantidad: '150 g de azúcar moreno (también puede usar azúcar blanco, panela o miel).' },
      { nombre: 'Sal fina', cantidad: '2 cucharaditas pequeñas (potenciador e intensificador del sabor).' },
      {
        nombre: 'Aromatizantes de la abuela',
        cantidad:
          'Hojas de romero fresco, pocos clavos de olor, granos de pimienta negra entera, semillas de mostaza cruda y 2-3 vainas de cardamomo entero.',
      },
    ],
    pasos: [
      'Esterilización inicial: coloque los tarros de cristal y sus respectivas tapas a hervir en una olla con agua por un mínimo de 10 minutos. Use un trapo al fondo de la olla para amortiguar los golpes del hervor.',
      'Infusión del líquido: en una olla aparte, mezcle el agua, el vinagre de manzana, el azúcar moreno, la sal y las especias (romero deshojado, clavo, pimienta, mostaza, cardamomo). Lleve a hervor.',
      'Preparar el vegetal: lave bien el alficoz y retire las puntas. Córtelo longitudinalmente en bastones o en cuartos de rodaja de 1 a 1.5 cm de espesor. Con un cuchillo o cuchara, retire todas las semillas para un acabado limpio.',
      'Blanqueado desinfectante (secreto): sumerja el alficoz picado en la infusión de vinagre hirviendo durante exactamente 1 minuto. Esto los desinfecta por completo y acelera la absorción del sabor sin cocinarlos.',
      'Llenado: saque los botes calientes esterilizados con pinzas. Escúrralos e introduzca los bastones o rodajas calientes de alficoz compactándolos. Agregue algunos granos de especias de la infusión.',
      'Inmersión: vierta el vinagre dulce aromático hirviendo sobre los botes hasta sumergir las piezas completamente. Deje un espacio de cabeza mínimo y cierre de forma hermética.',
    ],
    notaConservacion:
      'Deje reposar la conserva durante 2 semanas antes de comerla para equilibrar los sabores agridulces. Su vida ' +
      'útil es de 3 a 6 meses en refrigerador o despensa fresca. Descarte de inmediato si sospecha mal estado.',
  },
  {
    id: 'cebollaAjiMarinadaNeutra',
    titulo: 'Cebolla y ají con marinada neutra',
    resumen: 'Conservación: 3 meses (nevera) • Dificultad: Fácil • Método: Inyección de calor directo',
    ingredientes: [
      {
        nombre: 'Vegetales elegidos',
        cantidad:
          '250 g de cebolla morada (sin el nudo central, en juliana) y 250 g de ají verde (en rodajas delgadas, sin semillas gruesas). En total 500 g.',
      },
      { nombre: 'Base líquida neutra', cantidad: '250 g de agua y 250 g de vinagre blanco (proporción 1 a 1).' },
      { nombre: 'Saborizantes base', cantidad: '40 g de azúcar blanco y 10 g de sal fina.' },
      {
        nombre: 'Especias neutras',
        cantidad: '5 g de semillas de mostaza, 2 g de semillas de cilantro y 2 g de pimienta negra molida.',
      },
      {
        nombre: 'Opcionales para experimentar',
        cantidad:
          'Hojas de laurel, rodajas de jengibre fresco o ajo (atención: el ajo fresco se puede tornar verde al reaccionar).',
      },
    ],
    pasos: [
      'Limpieza de frascos: desinfecte dos frascos de 250 g pulverizándolos con alcohol o hirviéndolos un par de minutos.',
      'Preparación de vegetales: pique la cebolla en juliana fina descartando el nudo. Limpie los ajíes, retire la parte central más gruesa de semillas (para moderar el picante) y corte en rodajas delgadas.',
      'Acomodo en frasco: disponga la cebolla en un frasco y el ají verde en el otro, empujándolos suavemente hacia el fondo para compactarlos bien casi hasta la parte superior del borde.',
      'Preparar la marinada: agregue en una olla pequeña el agua, el vinagre blanco, el azúcar, la sal y las especias. Encienda a fuego fuerte.',
      'Hervor controlado: revuelva hasta disolver la sal y el azúcar, retirando la olla del fuego apenas rompa a hervir para que no se evapore el vinagre (ya que perdería acidez, esencial para la conservación y el sabor).',
      'Envasar en caliente: vierta de inmediato la marinada hirviendo sobre los frascos con los vegetales hasta cubrirlos.',
      'Cierre y enfriamiento: tape herméticamente los tarros calientes. Déjelos enfriar a temperatura ambiente volteándolos boca abajo de manera ocasional. Una vez fríos, guárdelos en la nevera.',
    ],
    notaConservacion:
      'Repose un mínimo de 48 horas en el refrigerador antes de consumirlos. El líquido de la cebolla se tornará ' +
      'rosa morado intenso y el ají se volverá amarillo. Dura al menos 3 meses en refrigeración.',
  },
  {
    id: 'cebollaEncurtidaRapida',
    titulo: 'Cebolla encurtida rápida',
    resumen: 'Conservación: 1 mes (nevera) • Dificultad: Muy fácil • Método: Infusión directa en tarro',
    ingredientes: [
      {
        nombre: 'Cebolla (morada de preferencia)',
        cantidad: 'Cortada muy fina (idealmente con mandolina) para una absorción perfecta.',
      },
      {
        nombre: 'Solución líquida',
        cantidad: 'Partes iguales de agua hirviendo y vinagre de manzana (o vinagre de vino blanco/arroz).',
      },
      { nombre: 'Elementos de sazón', cantidad: 'Sal fina (para saborizar) y azúcar (opcional, para dar balance).' },
      {
        nombre: 'Acompañantes picantes',
        cantidad: 'Dientes de ajo enteros machacados y guindilla seca/fresca al gusto.',
      },
      {
        nombre: 'Especias aromatizantes',
        cantidad: 'Granos de pimienta entera, hojas de laurel, romero, tomillo, clavo de olor o cardamomo.',
      },
    ],
    pasos: [
      'Corte uniforme: rebane la cebolla en plumas extremadamente delgadas utilizando un cuchillo bien afilado o una mandolina.',
      'Separación de capas: deshaga las capas de la cebolla separándolas suavemente con las manos. Esto facilita una absorción homogénea de la solución de vinagre y realza el color fucsia brillante final.',
      'Acomodo: introduzca toda la cebolla cortada dentro de un frasco de cristal limpio y con tapa de cierre hermético.',
      'Hervir el agua: ponga a hervir agua limpia en una olla pequeña.',
      'Inyección directa: añada directamente al frasco de cebolla agua recién hervida y vinagre de manzana en partes iguales hasta cubrir la cebolla.',
      'Incorporación de condimentos: introduzca dentro del frasco caliente los aromatizantes elegidos (pimienta, laurel, romero, tomillo, clavo o cardamomo), los dientes de ajo machacados, la sal y la guindilla si desea un toque picante.',
      'Agitación vigorosa: cierre inmediatamente el tarro de cristal hermético y agítelo con fuerza durante unos segundos para integrar y disolver todos los ingredientes.',
      'Reposar: deje que el tarro baje a temperatura ambiente. Posteriormente, almacene de inmediato en la nevera.',
    ],
    notaConservacion:
      'Deje reposar la cebolla unas horas antes de servir para que absorba el color morado. Esta versión rápida de ' +
      'encurtido aromático se mantiene óptima en la nevera durante aproximadamente 1 mes.',
  },
];

const RECETAS_POSTRES = [];
const RECETAS_COMIDAS = [];

const RECETAS_POR_SECCION = {
  salsas: RECETAS_SALSAS,
  encurtidos: RECETAS_ENCURTIDOS,
  postres: RECETAS_POSTRES,
  comidas: RECETAS_COMIDAS,
};
