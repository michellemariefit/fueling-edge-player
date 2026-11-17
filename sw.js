// Offline cache for the Fueling Edge player. Bump VERSION when files change so phones refresh.
const VERSION = 'fuel-v2';
const CORE = ['./', './start.html', './fuel.html', './gameday.html', './practice.html', './tournament.html', './recovery.html', './hydration.html', './enough.html', './picky.html', './recipes.html', './week.html', './install.html', './fuel.css', './fuel.js', './data/fuel.json', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/logo.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => Promise.all(CORE.map(u => fetch(u, { cache: 'no-cache' }).then(r => c.put(u, r)).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (u.pathname.endsWith('.json') || u.pathname.endsWith('.html') || u.pathname.endsWith('/') || u.pathname.endsWith('.css') || u.pathname.endsWith('.js')) {
    e.respondWith(fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })));
  }
});
