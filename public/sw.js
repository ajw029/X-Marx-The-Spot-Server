var filesToCache = [
  '/list.html',
  '/img/ic_add_white_48dp_2x.png',
  '/img/ic_home_white_48dp_2x.png',
  '/js/bundle.js'
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
