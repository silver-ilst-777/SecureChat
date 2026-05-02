// Импортируем Firebase SDK для сервис-воркеров (совместимая версия)
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// ⚠️ Конфигурация должна совпадать с той, что используется в твоём HTML!
// Замени значения на свои, особенно apiKey, projectId и messagingSenderId.
// messagingSenderId можно найти в Firebase Console → Настройки проекта → Cloud Messaging → Идентификатор отправителя.
const firebaseConfig = {
  apiKey: "AIzaSyBtqjyZSYvNlZ114JfjCAYP7vftQb7xxHw",    // твой актуальный ключ
  authDomain: "mess-6e28d.firebaseapp.com",
  projectId: "mess-6e28d",
  messagingSenderId: "766056022102"                     // ← ОБЯЗАТЕЛЬНО замени на свой Sender ID!
};

// Инициализация Firebase в сервис-воркере
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Обработка фонового push-сообщения
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Получено фоновое сообщение:', payload);

  // Извлекаем данные (твой клиент шлёт их в data-поле)
  const title = payload.data?.title || payload.notification?.title || 'SecureChat Pro';
  const body = payload.data?.body || payload.notification?.body || '';
  const chatId = payload.data?.chatId;

  const notificationOptions = {
    body: body,
    // Иконка: можно оставить дефолтную или указать свою
    icon: '/icon-192x192.png',   // замени на реальный путь, если есть
    badge: '/badge-72x72.png',
    data: {                      // Сохраняем chatId, чтобы обработать клик
      chatId: chatId
    },
    vibrate: [200, 100, 200],
    tag: chatId || 'securechat'  // группирует уведомления по чату
  };

  return self.registration.showNotification(title, notificationOptions);
});

// Клик по уведомлению: открываем приложение и нужный чат
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const chatId = event.notification.data?.chatId;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Пытаемся найти уже открытую вкладку с нашим приложением
      for (const client of windowClients) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          // Отправляем сообщение с chatId, как ожидается в твоём HTML (событие message от SW)
          client.postMessage({ type: 'OPEN_CHAT', chatId: chatId });
          return client.focus();
        }
      }
      // Если вкладки нет — открываем новую
      if (clients.openWindow) {
        const url = chatId ? `/?chat=${chatId}` : '/';
        return clients.openWindow(url);
      }
    })
  );
});