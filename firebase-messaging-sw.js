importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBtqjyZSYvNlZ114JfjCAYP7vftQb7xxHw",
  authDomain: "mess-6e28d.firebaseapp.com",
  projectId: "mess-6e28d",
  messagingSenderId: "766056022102" // ваш Sender ID
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// SVG иконка 192x192 (встроенная)
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="48" fill="#7c6eff"/>
  <path d="M152 96a56 56 0 0 1-56 56 55 55 0 0 1-25-6L40 156l12.5-37.5A56 56 0 1 1 152 96z" fill="white"/>
</svg>`;
const iconUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSvg);

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Фоновое сообщение:', payload);
  const title = payload.data?.title || payload.notification?.title || 'SecureChat Pro';
  const body = payload.data?.body || payload.notification?.body || '';
  const chatId = payload.data?.chatId;

  console.log(`[SW] Показываем уведомление: "${title}" - "${body}". ChatId: ${chatId}`);

  return self.registration.showNotification(title, {
    body,
    icon: iconUrl,
    badge: iconUrl,
    data: { chatId },
    vibrate: [200, 100, 200],
    tag: chatId || 'securechat',
    renotify: true,
    requireInteraction: false
  });
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Клик по уведомлению:', event.notification.data);
  event.notification.close();
  const chatId = event.notification.data?.chatId;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      console.log(`[SW] Найдено ${windowClients.length} окон клиента`);
      
      // Ищем окно нашего приложения
      for (const client of windowClients) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          console.log(`[SW] Отправляем сообщение в существующее окно, chatId=${chatId}`);
          client.postMessage({ type: 'OPEN_CHAT', chatId });
          return client.focus();
        }
      }
      
      // Если окна не найдены, открываем новое
      console.log(`[SW] Открываем новое окно, chatId=${chatId}`);
      if (clients.openWindow) {
        const url = chatId ? `/?chat=${chatId}` : '/';
        return clients.openWindow(url);
      }
    })
  );
});