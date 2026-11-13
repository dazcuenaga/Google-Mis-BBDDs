const CACHE = 'congelados-v94';
const SHELL = [
  './', './index.html', './style.css', './app.js',
  './electricidad-data.js', './fontaneria-data.js', './recetas-data.js', './guias-data.js', './cabana-data.js', './huerto-data.js', './config.js',
  './manifest.json', './icon.svg',
  './guias/multimetro-uso.png', './guias/multimetro-simbolos.png',
  './guias/tipos-de-alicate.png', './guias/tipos-de-brocas.png',
  './guias/tipos-de-cabezas-de-tornillos.png', './guias/tipos-de-disco-para-amoladora.png',
  './guias/tipos-de-lija.png', './guias/tipos-de-tacos.png',
];

self.addEventListener('install', (e) => {
  // cache: 'reload' salta la caché HTTP del navegador: sin esto, al actualizar la
  // versión podía guardarse un index.html viejo junto a un config.js nuevo (y la
  // app no arrancaba, p. ej. "MODULE_CATEGORIES is not defined").
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Solo cachea el "shell" de la app; las llamadas a la API de Sheets siempre van a red.
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('sheets.googleapis.com') || e.request.url.includes('accounts.google.com')) return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
