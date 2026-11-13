// Datos del módulo "Calendario del huerto" (categoría Agricultura y Ganadería):
// no lee ninguna hoja — son 12 fichas fijas, una por mes, con el contenido del
// PDF "Calendario Huerto" de Ediciones Mimura (edicionesmimura.es): qué sembrar
// (directa y en semillero), trasplantar y recolectar, un consejo y una frase.
// Es un módulo aparte de Plantas, que sí lee su hoja de cálculo. Usa la misma
// pantalla de fichas de texto que el módulo Guías (`custom: 'guias'`, entradas
// con `html`; ver guias-data.js y openGuiaImagen en app.js).
//
// Los textos son los del PDF, con una única corrección: "metereológico" →
// "meteorológico" (abril). El clima de referencia del calendario es el
// mediterráneo, y así lo dicen sus textos.

// [mes, icono de estación, intro, siembra directa, semillero, trasplantar, recolectar, título del consejo, texto del consejo, frase]
const HUERTO_MESES = [
  ['Enero', '❄️',
    'En el Mediterráneo costero se puede sembrar verdura de hoja y algunas raíces, mientras que en zonas del interior conviene primar variedades rústicas y proteger el semillero.',
    'Haba, guisante, espinaca, rabanito, zanahoria en clima suave, acelga, lechuga, perejil, ajo tardío, cebolla temprana.',
    'Lechuga, cebolla, puerro, tomate, pimiento y berenjena solo en semillero protegido y mejor en zonas cálidas.',
    'Lechuga, cebolla, puerro, apio, escarola, brócoli, coliflor, col/repollo, fresa.',
    'Acelga, espinaca, lechuga, escarola, apio, brócoli, coliflor, col, puerro, zanahoria, rabanito, alcachofa.',
    'Protege el semillero, no el huerto entero.',
    'Un túnel pequeño o una ventana soleada suele ser más útil que cubrir todo el bancal.',
    'Bajo la tierra aparentemente dormida ya se prepara la primavera'],
  ['Febrero', '❄️',
    'Es el mes de transición entre el huerto frío y el de primavera. Sigue siendo excelente para hoja y raíz, pero ya empieza el trabajo más importante del año: los semilleros de tomate, pimiento y berenjena.',
    'Remolacha, zanahoria, rabanito, espinaca, acelga, lechuga, haba, guisante, patata temprana en zonas suaves.',
    'Tomate, pimiento, berenjena, lechuga, cebolla, puerro, albahaca en interior protegido a final de mes.',
    'Lechuga, cebolla, puerro, apio, fresa, coles brassicas de invierno tardío.',
    'Lechuga, acelga, espinaca, apio, coles, brócoli, coliflor, zanahoria, rábano, guisantes y habas tempranas, alcachofa.',
    'Alterna lechugas y rabanitos.',
    'Pequeñas siembras cada 2–3 semanas suelen funcionar mejor que una sola tanda.',
    'Toda cosecha comienza con una semilla invisible'],
  ['Marzo', '🌸',
    'El huerto gana ritmo: siguen las cosechas de invierno, mientras avanzan los semilleros y las siembras de la temporada cálida. En la costa arrancan los trasplantes de verano.',
    'Zanahoria, remolacha, rabanito, lechuga, acelga, patata, judía verde temprana en zonas de clima suave, maíz dulce, guisante tardío, haba tardía.',
    'Tomate, pimiento, berenjena, pepino, calabacín, melón, sandía, albahaca.',
    'Lechuga, cebolla, puerro, apio, fresa; primeros tomates y calabacines solo en zonas cálidas o con protección.',
    'Lechuga, espinaca, acelga, guisante, haba, brócoli, coliflor, zanahoria, rabanito, primeras fresas en zonas de clima suave.',
    'Endurece los plantones.',
    'Sácalos al exterior unas horas al día antes del trasplante para evitar el choque causado por el sol y el viento.',
    'La primavera no llega de golpe; se construye hoja a hoja'],
  ['Abril', '🌸',
    'Marca el salto a los cultivos de verano. Llegar con buenos plantones da ventaja, aunque en zonas de interior conviene vigilar el pronóstico meteorológico antes de plantar definitivamente tomate o pimiento.',
    'Judía verde, zanahoria, remolacha, rabanito, lechuga, acelga, pepino, calabacín, maíz dulce, albahaca; melón y sandía en zonas más cálidas.',
    'Tomate, pimiento y berenjena si vas tarde; lechuga de reposición.',
    'Tomate, pimiento, berenjena, pepino, calabacín, melón, sandía, albahaca, lechuga.',
    'Lechuga, acelga, espinaca, habas, guisantes, fresas, cebolla tierna, últimas coles brassicas.',
    'Pon el tutor al trasplantar, no después.',
    'Evitas dañar raíces cuando la planta ya ha empezado a agarrar.',
    'Cada planta busca el sol. Nosotros también'],
  ['Mayo', '🌸',
    'Combina abundantes cosechas de primavera con cultivos de verano que crecen rápido. Es el momento ideal para preparar el huerto antes de la llegada del calor.',
    'Judía verde, zanahoria, remolacha, rabanito, lechuga de verano, pepino, calabacín, melón, sandía, maíz, albahaca.',
    'Siembra puerros y lechugas en varias tandas para cosecharlos de forma escalonada durante el verano y el otoño.',
    'Tomate, pimiento, berenjena, pepino, calabacín, melón, sandía, albahaca.',
    'Lechuga, acelga, remolacha, fresa, últimas habas y guisantes, patata temprana, primeras cebollas tiernas, primeros calabacines y pepinos.',
    'Acolcha ya.',
    'En Mediterráneo, el acolchado hecho en mayo ahorra agua en junio y julio.',
    'El huerto enseña que crecer requiere tiempo y confianza'],
  ['Junio', '☀️',
    'Empiezan las cosechas de hortalizas de fruto, como tomates y calabacines, y toca preparar las próximas siembras para seguir cosechando en verano y otoño. Las macetas necesitan riegos más frecuentes.',
    'Judía verde, zanahoria, remolacha, rabanito, lechuga, calabacín, pepino, albahaca.',
    'Puerro, primeras coles brassicas a final de mes, lechuga de verano.',
    'Puerro, lechuga, albahaca, pepino y calabacín tardíos, alguna judía en plantón.',
    'Tomate temprano, pepino, calabacín, judía verde, ajo, cebolla, patata, fresa tardía, pimiento y berenjena tempranos.',
    'Riega profundo y al amanecer.',
    'Con calor mediterráneo, son mejores pocos riegos profundos que muchos superficiales.',
    'La tierra devuelve multiplicado lo que cuidamos'],
  ['Julio', '☀️',
    'Recompensa con abundantes cosechas, pero exige atención al riego. En clima mediterráneo concentra buena parte de la cosecha de tomate, calabacín, pepino, judía, pimiento, berenjena, melón y sandía.',
    'Judía verde, zanahoria, remolacha, rabanito, acelga, lechuga de verano.',
    'Brócoli, coliflor, col/repollo, lombarda, lechuga, escarola, puerro, cebolla de invierno.',
    'Puerro, lechuga, albahaca, primeras coles brassicas si el lugar no es excesivamente cálido.',
    'Tomate, pimiento, berenjena, calabacín, pepino, judía verde, melón, sandía, cebolla, ajo, patata.',
    'Sombrea el semillero, no el bancal productivo.',
    'Un 30–40% de sombreo salva lechugas y coles brassicas jóvenes sin frenar tanto los tomates.',
    'Las mañanas de verano saben a tomate recién cortado'],
  ['Agosto', '☀️',
    'No es solo mes de cosecha: en su segunda mitad comienza el huerto de otoño. En el Mediterráneo, esperar demasiado puede hacer que las coles brassicas lleguen tarde.',
    'Zanahoria, rabanito, remolacha, nabo, acelga, espinaca a final de mes, lechuga, escarola, última judía verde.',
    'Brócoli, coliflor, col/repollo, lechuga, escarola, cebolla, puerro.',
    'Primeras coles brassicas, lechuga, escarola, puerro, cebolla de invierno.',
    'Tomate, pimiento, berenjena, calabacín, pepino, melón, sandía, judía verde, albahaca.',
    'Aprovecha que las noches refrescan.',
    'Muchas siembras de otoño funcionan mejor desde la segunda quincena que desde principios de agosto.',
    'La abundancia invita a compartir'],
  ['Septiembre', '🍂',
    'Marca el cambio de estación en el huerto mediterráneo: aún se recoge mucho de verano, pero ya entran las verduras de otoño. Las primeras lluvias traen oportunidades y problemas a la vez.',
    'Espinaca, acelga, zanahoria, rabanito, nabo, remolacha, lechuga, escarola, cebolla, perejil, cilantro, primeros guisantes en zonas suaves.',
    'Brócoli, coliflor, col, lechuga, cebolla.',
    'Lechuga, escarola, coles brassicas, puerro, cebolla, fresa.',
    'Tomate, pimiento, berenjena, calabacín, pepino, judía verde, últimos melones y sandías.',
    'Ventila y sanea.',
    'Tras las primeras lluvias, quitar hojas enfermas y mejorar aireación evita muchos hongos.',
    'Cada final es también una siembra'],
  ['Octubre', '🍂',
    'Es uno de los mejores meses para el huerto: ajo, habas y guisantes arrancan con fuerza, mientras lechugas, escarolas y coles brassicas toman el relevo del verano.',
    'Ajo, haba, guisante, espinaca, rabanito, zanahoria, nabo, acelga, lechuga, cebolla, perejil, cilantro.',
    'Lechuga y cebolla en zonas de clima suave; alguna brassica tardía.',
    'Lechuga, escarola, cebolla, puerro, brócoli, coliflor, col/repollo, fresa.',
    'Lechuga, acelga, rabanito, remolacha, zanahoria, pimientos y tomates tardíos, primeras alcachofas, primeros brócolis.',
    'Rota por familias y añade compost maduro.',
    'Evita repetir cultivos en el mismo lugar y enriquece la tierra con compost maduro. Prescinde de materia orgánica fresca.',
    'La tierra enseña el arte de soltar'],
  ['Noviembre', '🍂',
    'Consolida el huerto de otoño-invierno. El suelo aún templado favorece las siembras y las cosechas de hoja y coles brassicas. En zonas de clima suave, sigue siendo un mes muy aprovechable.',
    'Ajo, haba, guisante, espinaca, rabanito, nabo, zanahoria en zonas suaves, cebolla, lechuga, acelga.',
    'Lechuga, cebolla, coles brassicas tardías.',
    'Lechuga, cebolla, puerro, escarola, brócoli, coliflor, col/repollo, fresa.',
    'Lechuga, acelga, espinaca, apio, brócoli, coliflor, col, puerro, zanahoria, rabanito, escarola, alcachofa.',
    'En maceta, drenar es tan importante como regar.',
    'Separa los recipientes del plato y evita encharcamientos tras lluvias.',
    'Lo esencial suele crecer bajo la superficie'],
  ['Diciembre', '❄️',
    'Este no es un mes vacío, sino un mes más lento. En la costa mediterránea todavía se puede sembrar bastante, y en interior sigue habiendo un huerto de invierno muy digno si se aprovecha bien la luz.',
    'Ajo, haba, guisante, espinaca, rabanito, cebolla, zanahoria y lechuga en rincones cálidos, perejil.',
    'Lechuga, cebolla; tomate, pimiento o berenjena solo en semillero muy protegido.',
    'Lechuga, cebolla, puerro, coles brassicas, fresa en zonas de clima suave.',
    'Acelga, espinaca, lechuga, col, brócoli, coliflor, puerro, zanahoria, rabanito, escarola, alcachofa.',
    'Busca sol de invierno.',
    'En balcones, mover las macetas a la franja más soleada vale más que regar o abonar de más.',
    'El huerto nunca termina; siempre vuelve a empezar'],
];

function huertoFicha([, , intro, directa, semillero, trasplantar, recolectar, consejoTitulo, consejoTexto, frase]) {
  return `
  <p>${intro}</p>

  <h2>Sembrar</h2>
  <p><strong>Directa:</strong> ${directa}</p>
  <p><strong>Semillero:</strong> ${semillero}</p>

  <h2>Trasplantar</h2>
  <p>${trasplantar}</p>

  <h2>Recolectar</h2>
  <p>${recolectar}</p>

  <div class="huerto-consejo">
    <p><strong>Consejo · ${consejoTitulo}</strong></p>
    <p>${consejoTexto}</p>
  </div>

  <p class="huerto-frase">«${frase}»</p>
  <p class="guia-doc-ayuda">Fuente: Calendario del huerto, Ediciones Mimura (edicionesmimura.es).</p>`;
}

const HUERTO_LISTA = HUERTO_MESES.map((mes) => ({
  id: mes[0].toLowerCase(),
  icon: mes[1],
  titulo: mes[0],
  html: huertoFicha(mes),
}));
