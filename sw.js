self.addEventListener('fetch', e => {});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
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
