const CACHE = 'lexup-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.add('./index.html'))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match('./index.html'))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
      if(list.length > 0) return list[0].focus();
      return clients.openWindow('./index.html');
    })
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'NOTIF') {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      tag: e.data.tag || 'lexup',
      renotify: true
    });
  }
});
