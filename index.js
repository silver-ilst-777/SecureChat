const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Триггер на создание документа в коллекции chat_msgs_{chatId}
exports.sendPushOnNewMessage = functions.firestore
  .document('artifacts/{appId}/public/data/chat_msgs_{chatId}/{msgId}')
  .onCreate(async (snap, context) => {
    const msg = snap.data();
    const chatId = context.params.chatId;

    // 1) Не отправлять уведомление самому себе
    if (!msg.senderId) return;

    // 2) Получить чат, чтобы узнать участников
    const chatRef = admin.firestore()
      .doc(`artifacts/${context.params.appId}/public/data/chats/${chatId}`);
    const chatSnap = await chatRef.get();
    if (!chatSnap.exists) return;
    const chat = chatSnap.data();
    const participants = chat.participants || [];

    // 3) Найти всех получателей (всех, кроме отправителя)
    const recipients = participants.filter(uid => uid !== msg.senderId);
    if (recipients.length === 0) return;

    // 4) Получить FCM-токены получателей
    const tokens = [];
    for (const uid of recipients) {
      const userRef = admin.firestore()
        .doc(`artifacts/${context.params.appId}/public/data/users/${uid}`);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        const token = userSnap.data().fcmToken;
        if (token) tokens.push(token);
      }
    }
    if (tokens.length === 0) return;

    // 5) Подготовить текст уведомления
    const senderRef = admin.firestore()
      .doc(`artifacts/${context.params.appId}/public/data/users/${msg.senderId}`);
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
    try {
      const response = await admin.messaging().sendEachForMulticast(payload);
      console.log('Успешно отправлено:', response.successCount, 'ошибок:', response.failureCount);
    } catch (err) {
      console.error('Ошибка отправки push:', err);
    }
  });