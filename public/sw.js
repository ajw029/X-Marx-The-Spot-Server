var filesToCache = [
  '/'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('bookmarks').then(cache => {
      return cache.addAll(filesToCache)
      .then(() => self.skipWaiting());
    })
  )
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e) {
  //console.log('[ServiceWorker] Fetch', e.request.url);


  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );


});
