# 📱 Настройка Push-Уведомлений для Android и iOS

## ✅ Что уже сделано в коде:
1. ✅ Service Worker зарегистрирован (`firebase-messaging-sw.js`)
2. ✅ FCM Token запрашивается и сохраняется в Firestore
3. ✅ Cloud Function готова отправлять уведомления
4. ✅ Баннер для разрешения уведомлений добавлен

## 🔑 ВАЖНО: Что нужно сделать в Firebase Console:

### 1. Получить VAPID ключ (Web Push Certificate)
```
Firebase Console → Your Project → Project Settings (⚙️)
  ↓
Cloud Messaging (перейти на вкладку)
  ↓
Web Push Certificates
  ↓
Нажать "Generate Key Pair"
  ↓
Скопировать публичный ключ (выглядит как: BK_xXjnvKgE...)
```

### 2. Обновить VAPID ключ в index.html
Найти в `index.html` строку:
```javascript
const VAPID_KEY = 'BK_xXjnvKgEwaUFI7M4Rtza6Y9TvrQyqBLiMIAejOzD1idj5YXk_ihoytFx0HFR-9zU3ji8PIxkbxXmGv3_tOnM'; // ← заменить на реальный ключ
```

Заменить ключ на полученный из Firebase Console.

### 3. Развернуть Cloud Functions
```bash
cd functions
firebase deploy --only functions
```

Это разверет функцию `sendPushOnNewMessage`, которая отправляет уведомления.

### 4. Проверить Firestore
Убедиться, что структура БД совпадает:
```
artifacts/
  ├─ {appId}/
  │  └─ public/data/
  │     ├─ users/
  │     │  ├─ {userId}
  │     │  │  ├─ fcmToken: "..." (добавляется автоматически после разрешения уведомлений)
  │     │  │  ├─ displayName: "..."
  │     │  │  └─ ...
  │     │  
  │     ├─ chats/
  │     │  └─ {chatId}
  │     │     ├─ participants: ["uid1", "uid2", ...]
  │     │     └─ ...
  │     │
  │     └─ chat_msgs_{chatId}/
  │        ├─ msgId1
  │        ├─ msgId2
  │        └─ ...
```

### 5. Android PWA Setup
На Android, чтобы включить push-уведомления:
1. Открыть приложение в Mobile Chrome
2. Нажать ⋮ (меню) → "Установить приложение"
3. Когда приложение установлено, разрешить уведомления
4. Готово! Уведомления будут приходить даже с закрытым браузером

### 6. iOS Setup (PWA на iOS)
На iOS пока нет полной поддержки push-уведомлений на PWA (как на Android), но можно:
1. Установить PWA (добавить на Home Screen)
2. Уведомления будут работать, когда браузер открыт (on-foreground)
3. Для фоновых уведомлений нужно нативное приложение

## 🧪 Тестирование:

### Локально:
```bash
firebase emulators:start
```

### В production:
1. Открыть приложение на телефоне
2. Разрешить уведомления (нажать на баннер "Разрешить")
3. Отправить сообщение из другого аккаунта
4. Уведомление должно прийти через 1-2 секунды

## 📊 Отладка:

### Консоль браузера:
```
[FCM]   - Сообщения FCM
[Notif] - Сообщения уведомлений
```

### Firebase Console → Logs:
Посмотреть логи Cloud Functions и ошибки.

## 🔔 Как работает:

1. Пользователь открывает приложение
2. Показывается баннер "Разрешить уведомления"
3. После разрешения, браузер запрашивает FCM Token
4. Token сохраняется в `users/{uid}/fcmToken`
5. Когда приходит новое сообщение в чат:
   - Триггер `sendPushOnNewMessage` срабатывает
   - Функция получает список получателей чата
   - Для каждого получателя берет его FCM Token
   - Отправляет push-уведомление через Firebase Cloud Messaging
6. Service Worker получает уведомление и показывает его
7. При клике на уведомление открывается чат

## ⚠️ Проблемы и решения:

### "VAPID ключ неправильный"
→ Получить и обновить ключ в Firebase Console

### "Токен не сохраняется"
→ Проверить консоль браузера на ошибки (F12 → Console → Filter "FCM")

### "Уведомление не приходит"
→ Проверить:
  1. FCM Token сохранился в users/{uid}
  2. Cloud Functions развернуты
  3. Чат имеет поле participants
  4. Оба пользователя в participants

### "Уведомления не приходят на iOS"
→ iOS PWA имеют ограничения. Нужно нативное приложение для фоновых уведомлений.
