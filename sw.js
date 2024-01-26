// Filename: service-worker.js

// Define the cache name and the files to cache
const cacheName = 'my-cache-v1';
const cacheFiles = [
  'index.html', // Add other files you want to cache here
];

// Install the service worker and cache the necessary files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheFiles);
    })
  );
});

// Intercept network requests and serve from cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If the file is in the cache, return it
      if (response) {
        return response;
      }

      // If the file is not in the cache, fetch it from the network
      return fetch(event.request).then((response) => {
        // Cache the fetched response
        event.waitUntil(
          caches.open(cacheName).then((cache) => {
            return cache.put(event.request, response.clone());
          })
        );

        return response;
      });
    })
  );
});

// Update the cache in the background
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});
