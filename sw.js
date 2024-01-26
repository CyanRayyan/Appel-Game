// Service Worker Script

// Define the cache name and the files to be cached
const CACHE_NAME = 'my-cache-v1';
const cacheUrls = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  // Add more files and resources to be cached as needed
];

// Install the service worker and cache the specified files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(cacheUrls);
      })
  );
});

// Intercept fetch requests and serve from cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If request is in cache, return it
        if (response) {
          return response;
        }

        // If request is not in cache, fetch and cache it
        return fetch(event.request).then((response) => {
          // Clone the response as it can be consumed only once
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        });
      })
      .catch(() => {
        // If an error occurs during fetch, return a simple offline page
        return caches.match('/offline.html');
      })
  );
});

// Remove outdated caches when the service worker is activated
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});
