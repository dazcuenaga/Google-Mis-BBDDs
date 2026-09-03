const CACHE = 'congelados-v55';
const SHELL = ['./', './index.html', './style.css', './app.js', './electricidad-data.js', './fontaneria-data.js', './recetas-data.js', './config.js', './manifest.json', './icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
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
