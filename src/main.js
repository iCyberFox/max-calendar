import { messaging } from "./firebase";

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

async function initNotifications() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await messaging.getToken({ vapidKey });
      console.log("FCM token:", token);
      // цей токен вставляєш у Firebase Console → Cloud Messaging → Send test message
    } else {
      console.warn("Дозвіл на нотифікації не надано");
    }
  } catch (err) {
    console.error("Помилка отримання токена:", err);
  }
}

initNotifications();
