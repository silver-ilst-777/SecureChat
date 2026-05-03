const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Триггер на создание документа в коллекции chat_msgs_{chatId}
exports.sendPushOnNewMessage = functions.firestore
  .document('artifacts/{appId}/public/data/chat_msgs_{chatId}/{msgId}')
  .onCreate(async (snap, context) => {
    try {
      const msg = snap.data();
      const chatId = context.params.chatId;
      const appId = context.params.appId;

      console.log(`[Push] Новое сообщение в чате ${chatId} от ${msg.senderId}`);

      // 1) Не отправлять уведомление самому себе
      if (!msg.senderId) {
        console.log('[Push] senderId отсутствует, пропускаем');
        return;
      }

      // 2) Получить чат, чтобы узнать участников
      const chatRef = admin.firestore()
        .doc(`artifacts/${appId}/public/data/chats/${chatId}`);
      const chatSnap = await chatRef.get();
      if (!chatSnap.exists) {
        console.log(`[Push] Чат ${chatId} не найден`);
        return;
      }
      const chat = chatSnap.data();
      const participants = chat.participants || [];
      console.log(`[Push] Участники чата: ${participants.join(', ')}`);

      // 3) Найти всех получателей (всех, кроме отправителя)
      const recipients = participants.filter(uid => uid !== msg.senderId);
      console.log(`[Push] Получатели (не отправитель): ${recipients.join(', ')}`);
      if (recipients.length === 0) {
        console.log('[Push] Получатели не найдены');
        return;
      }

      // 4) Получить FCM-токены получателей
      const tokens = [];
      for (const uid of recipients) {
        const userRef = admin.firestore()
          .doc(`artifacts/${appId}/public/data/users/${uid}`);
        const userSnap = await userRef.get();
        if (userSnap.exists) {
          const token = userSnap.data().fcmToken;
          if (token) {
            tokens.push(token);
            console.log(`[Push] FCM token найден для ${uid}`);
          } else {
            console.log(`[Push] FCM token отсутствует для ${uid}`);
          }
        } else {
          console.log(`[Push] Пользователь ${uid} не найден`);
        }
      }
      if (tokens.length === 0) {
        console.log('[Push] FCM токены не найдены ни у одного получателя');
        return;
      }
      console.log(`[Push] Найдено ${tokens.length} FCM токенов`);

      // 5) Подготовить текст уведомления
      const senderRef = admin.firestore()
        .doc(`artifacts/${appId}/public/data/users/${msg.senderId}`);
      const senderSnap = await senderRef.get();
      const senderName = senderSnap.exists ? senderSnap.data().displayName || 'Кто-то' : 'Кто-то';

      let body = '';
      if (msg.voiceMessage) body = '🎤 Голосовое сообщение';
      else if (msg.imageMessage) body = '📷 Изображение';
      else body = msg.text || 'Новое сообщение';

      const payload = {
        data: {
          title: `💬 ${senderName}`,
          body,
          chatId
        },
        tokens
      };

      // 6) Отправить
      console.log(`[Push] Отправляем уведомление ${tokens.length} получателям...`);
      const response = await admin.messaging().sendEachForMulticast(payload);
      console.log(`[Push] ✅ Успешно отправлено: ${response.successCount}, ошибок: ${response.failureCount}`);
      
      // Логируем ошибки, если они есть
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error(`[Push] ❌ Ошибка для токена ${idx}: ${resp.error.message}`);
          }
        });
      }
    } catch (err) {
      console.error('[Push] ❌ Критическая ошибка:', err.message, err);
    }
  });