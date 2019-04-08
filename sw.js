const cacheName = "cache v-2";
const assets = ["index.html", "/css/main.css", "/js/app.js"];

//CALL INSTALL EVENT
self.addEventListener("install", ev => {
  console.log("Service worker installed");
  ev.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("Service worker : Caching Files");
      cache.addAll(assets);
    })
  );
});

//ACTIVATE INSTALL  EVENT
self.addEventListener("activate", ev => {
  console.log("Servie worker activate");
  //remove unwanted action
  ev.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cacheName !== cache) {
            console.log("clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

//CALL FETCH EVENT

self.addEventListener("fetch", ev => {
  console.log("Servieworker : Fetching");
  ev.respondWith(
    caches.match(ev.request).then(cahedResponse => {
      return cahedResponse || fetch(ev.request);
    })
  );
});
