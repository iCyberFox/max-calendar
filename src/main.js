import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Конфігурація Firebase з Netlify змінних
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Твій VAPID ключ
const vapidKey = "BL6mfLMzhi29SCQDyfVlNaMj9shVimBtiTBKTdfcN1duytG6XNyWHwhon6Nw3TJs-xpEGMk7NOFHIBFIDxznE5E";

// Функція для запиту дозволу і отримання токена
async function initNotifications() {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);

    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey });
      console.log("FCM token:", token);

      // цей токен вставляєш у Firebase Console → Cloud Messaging → Send test message
    } else {
      console.warn("Користувач не дав дозвіл на нотифікації");
    }
  } catch (err) {
    console.error("Помилка при отриманні токена:", err);
  }
}

// Викликаємо одразу при завантаженні сторінки
initNotifications();