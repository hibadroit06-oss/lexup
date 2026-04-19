const CACHE = 'lexup-v2';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add('./index.html')));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const tag = e.notification.tag || 'notion';
  const target = tag === 'actu' ? './index.html?open=actus' : './index.html?open=flash';
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
      for(const client of list){
        if(client.url.includes('index.html') || client.url.endsWith('lexup') || client.url.endsWith('lexup/')){
          client.postMessage({type:'OPEN_TAB', tab: tag === 'actu' ? 'ta' : 'tf'});
          return client.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});

self.addEventListener('message', e => {
  if(e.data && e.data.type === 'NOTIF'){
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      tag: e.data.tag || 'notion',
      renotify: true
    });
  }
});
