const CACHE_NAME = "tic-tac-toe-cache-v1";
const urlsToCache = [
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./sounds/move.mp3",
  "./sounds/win.mp3",
  "./sounds/draw.mp3",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
