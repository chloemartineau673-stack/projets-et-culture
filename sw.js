const CACHE = 'projets-culture-v22';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css?v=22',
  '/app.js?v=22',
  '/manifest.json',
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
  // Ressources externes : toujours réseau
  const url = e.request.url;
  if (url.includes('firebase') || url.includes('gstatic') ||
      url.includes('openstreetmap') || url.includes('unpkg') ||
      url.includes('leaflet')) {
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
