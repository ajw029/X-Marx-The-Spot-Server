var filesToCache = [
  '/login',
  '/list.html',
  '/css/style.css',
  '/img/ic_add_white_48dp_2x.png',
  '/img/ic_home_white_48dp_2x.png',
  '/img/ic_bookmark_white_48dp_2x.png',
  '/img/ic_create_new_folder_white_48dp_2x.png',
  '/img/ic_settings_white_48dp_2x.png',
  '/img/ic_exit_to_app_white_48dp_2x.png',
  '/img/ic_star_white_48dp_2x.png',
  '/img/ic_close_black_48dp_2x.png',
  '/img/ic_arrow_back_black_48dp_2x.png',
  '/img/ic_more_horiz_black_48dp_2x.png',
  '/img/ic_keyboard_arrow_up_black_48dp_2x.png',
  '/js/bundle.js',
  '/js/jquery.js'
];
var cacheName = 'v13';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache)
      .then(() => self.skipWaiting());
    })
  )
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open(cacheName).then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }))
});
