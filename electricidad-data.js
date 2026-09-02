// Datos del módulo "Electricidad el Rellano", extraídos del PowerPoint
// "Electricidad el Rellano.pptx" (esquema del cuadro eléctrico + planos).
// No proviene de una hoja de cálculo: es contenido fijo de la app.

// Diapositiva 1: cuadro de automáticos. `breaker` es el identificador que se
// usa para comparar contra `breaker` de cada icono en ELECTRICIDAD_PLANOS.
// L1 apaga 1,2,3,4 y L2 apaga 5,6,7,8,9 (ver `covers`); 0 apaga todo.
const ELECTRICIDAD_CONTROLES = [
  { row: 1, items: [
    { id: '0', label: '0', kind: 'master' },
    { id: 'L1', label: 'L1', kind: 'sub', covers: ['1', '2', '3', '4'] },
    { id: '1', label: '1', kind: 'normal' },
    { id: '2', label: '2', kind: 'normal' },
    { id: '3', label: '3', kind: 'normal' },
    { id: '4', label: '4', kind: 'normal' },
  ]},
  { row: 2, items: [
    { id: 'L2', label: 'L2', kind: 'sub', covers: ['5', '6', '7', '8', '9'] },
    { id: '5', label: '5', kind: 'normal' },
    { id: '6', label: '6', kind: 'normal' },
    { id: '7', label: '7', kind: 'normal' },
    { id: '8', label: '8', kind: 'normal' },
    { id: '9', label: '9', kind: 'normal' },
  ]},
];

// Diapositiva 2: aparatos eléctricos conectados a los automáticos 5-8.
const ELECTRICIDAD_APARATOS = {
  img: 'img/electricidad/aparatos.jpg',
  items: [
    { breaker: '5', label: 'Vitrocerámica' },
    { breaker: '6', label: 'Lavadora' },
    { breaker: '7', label: 'Lavavajillas' },
    { breaker: '8', label: 'Bomba de agua' },
  ],
};

// Diapositivas 3 a 7: un plano por zona. Cada icono es un interruptor o un
// enchufe, con su posición en el plano en fracción (0..1) de ancho/alto de
// la imagen (para poder superponerlo como overlay responsive), y `breaker`
// = automático que lo activa, para poder "iluminarlo" al elegir un control.
// `label` es el texto tal cual aparece junto al icono en el plano original
// (ej. "3A" = automático 3, posición A; "1b L" = interruptor de luz en el
// automático 1b, que a su vez cuelga del automático 1).
const ELECTRICIDAD_PLANOS = [
  {
    id: 'gallinero',
    title: 'Gallinero',
    img: 'img/electricidad/gallinero.jpg',
    notes: ['Activados desde el automático de la leñera.'],
    icons: [
      { kind: 'switch', label: '1b L', breaker: '1', x: 0.8380, y: 0.2130, w: 0.0307, h: 0.0546 },
    ],
  },
  {
    id: 'trastero',
    title: 'Trastero',
    img: 'img/electricidad/trastero.jpg',
    notes: ['Enchufe activado con automático 9, usado para congelador y calentador de agua.'],
    icons: [
      { kind: 'outlet', label: '9', breaker: '9', x: 0.7506, y: 0.1810, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.1506, y: 0.6807, w: 0.0294, h: 0.0523 },
      { kind: 'switch', label: '3 L', breaker: '3', x: 0.1493, y: 0.6262, w: 0.0307, h: 0.0546 },
    ],
  },
  {
    id: 'exterior',
    title: 'Exterior',
    img: 'img/electricidad/exterior.jpg',
    notes: ['Interruptor A: efecto desconocido.', 'Automático 1b está activado por el automático 1.'],
    icons: [
      { kind: 'outlet', label: '8', breaker: '8', x: 0.4727, y: 0.2954, w: 0.0294, h: 0.0523 },
      { kind: 'switch', label: 'A', breaker: '3', x: 0.3016, y: 0.3493, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'B', breaker: '3', x: 0.3308, y: 0.3496, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'C', breaker: '3', x: 0.3607, y: 0.3491, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'D', breaker: '3', x: 0.3906, y: 0.3491, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'E', breaker: '1', x: 0.8645, y: 0.7105, w: 0.0307, h: 0.0546 },
    ],
  },
  {
    id: 'planta-baja',
    title: 'Planta Baja',
    img: 'img/electricidad/planta-baja.jpg',
    notes: ['Interruptor A: efecto desconocido.', 'El segundo enchufe de pared de cocina antes del baño se usa para el microondas.'],
    icons: [
      { kind: 'outlet', label: '4', breaker: '4', x: 0.7112, y: 0.1882, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '9', breaker: '9', x: 0.1369, y: 0.2388, w: 0.0294, h: 0.0523 },
      { kind: 'switch', label: '3H', breaker: '3', x: 0.1367, y: 0.2925, w: 0.0307, h: 0.0546 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.1379, y: 0.5630, w: 0.0294, h: 0.0523 },
      { kind: 'switch', label: '3G', breaker: '3', x: 0.1379, y: 0.5085, w: 0.0307, h: 0.0546 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.1686, y: 0.7640, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.2773, y: 0.7616, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.6838, y: 0.1882, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.6564, y: 0.1890, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.8326, y: 0.7117, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.8326, y: 0.7628, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.8326, y: 0.3832, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.3157, y: 0.1881, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.3438, y: 0.6054, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.3438, y: 0.6566, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.3709, y: 0.7117, w: 0.0294, h: 0.0523 },
      { kind: 'switch', label: '3I', breaker: '3', x: 0.3712, y: 0.6575, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'E', breaker: '3', x: 0.5713, y: 0.7273, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'F', breaker: '3', x: 0.5992, y: 0.7273, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'A', breaker: '3', x: 0.3452, y: 0.1890, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'B', breaker: '3', x: 0.3742, y: 0.1890, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'C', breaker: '3', x: 0.4049, y: 0.1895, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'D', breaker: '3', x: 0.4356, y: 0.1895, w: 0.0307, h: 0.0546 },
    ],
  },
  {
    id: 'primera-planta',
    title: '1ª Planta',
    img: 'img/electricidad/primera-planta.jpg',
    notes: [],
    icons: [
      { kind: 'outlet', label: '1', breaker: '1', x: 0.8916, y: 0.6782, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '2', breaker: '2', x: 0.4715, y: 0.1633, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '2', breaker: '2', x: 0.7461, y: 0.1633, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '2', breaker: '2', x: 0.1887, y: 0.1633, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.2288, y: 0.4276, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '1', breaker: '1', x: 0.0790, y: 0.5895, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.1675, y: 0.8245, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.2773, y: 0.6531, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.6098, y: 0.6048, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.5041, y: 0.4225, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.6165, y: 0.2596, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.7174, y: 0.4253, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.8910, y: 0.4241, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.4907, y: 0.7295, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '3', breaker: '3', x: 0.6475, y: 0.8326, w: 0.0294, h: 0.0440 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.8241, y: 0.8243, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.7792, y: 0.4758, w: 0.0294, h: 0.0523 },
      { kind: 'outlet', label: '4', breaker: '4', x: 0.2923, y: 0.6021, w: 0.0294, h: 0.0523 },
      { kind: 'switch', label: '3F', breaker: '3', x: 0.7941, y: 0.8243, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: '3E', breaker: '3', x: 0.8619, y: 0.4241, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: '3D', breaker: '3', x: 0.7464, y: 0.4235, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: '3C', breaker: '3', x: 0.6159, y: 0.2034, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: '3B', breaker: '3', x: 0.4422, y: 0.4219, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: '3A', breaker: '3', x: 0.2596, y: 0.4235, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: '3G', breaker: '3', x: 0.1404, y: 0.8243, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'L', breaker: '3', x: 0.5506, y: 0.6036, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'M', breaker: '3', x: 0.6493, y: 0.6010, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: '3H', breaker: '3', x: 0.2632, y: 0.5998, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'K', breaker: '3', x: 0.3795, y: 0.6012, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'J', breaker: '3', x: 0.3503, y: 0.6000, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'I', breaker: '3', x: 0.3231, y: 0.5990, w: 0.0307, h: 0.0546 },
      { kind: 'switch', label: 'N', breaker: '3', x: 0.6811, y: 0.6025, w: 0.0307, h: 0.0546 },
    ],
  },
];
