const CACHE = 'projets-culture-v14';
const ASSETS = [
  '/projets-et-culture/',
  '/projets-et-culture/index.html',
  '/projets-et-culture/style.css?v=14',
  '/projets-et-culture/app.js?v=14',
  '/projets-et-culture/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Firebase et CDN : toujours réseau
  if (e.request.url.includes('firebase') || e.request.url.includes('gstatic')) {
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
