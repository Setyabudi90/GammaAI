const STATIC_CACHE_NAME = "gammaAI-static-cache-v1";
const DYNAMIC_CACHE_NAME = "gammaAI-dynamic-cache-v1";

const STATIC_ASSETS = [
  "/",
  "/favicon-32x32.png",
  "/site.webmanifest",
  "/android-chrome-192x192.png",
  "/_next/static/chunks/",
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (![STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME].includes(cache)) {
            console.log(`[Service Worker] Deleting old cache: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then((networkResponse) => {
            if (
              request.url.includes("/_next/static/") ||
              STATIC_ASSETS.includes(new URL(request.url).pathname)
            ) {
              return caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          })
        );
      })
    );
  } else {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(request))
    );
  }
});
