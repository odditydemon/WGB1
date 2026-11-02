const CACHE = "worlds-gate-v1";
const FILES = ["index.html","manifest.json","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))));
self.addEventListener("fetch", e => e.respondWith(
  fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(ch => ch.put(e.request, c)); return r; })
  .catch(() => caches.match(e.request))));
