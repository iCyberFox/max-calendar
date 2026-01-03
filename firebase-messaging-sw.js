// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Ініціалізація Firebase (ті самі дані, що й у index.html)
firebase.initializeApp({
  apiKey: "AIzaSyDiCzUGFq9gwwg2BChbilWpNwxYlzENuWk",
  authDomain: "mix-calendar2026.firebaseapp.com",
  projectId: "mix-calendar2026",
  storageBucket: "mix-calendar2026.firebasestorage.app",
  messagingSenderId: "475991075762",
  appId: "1:475991075762:web:045823d44f006b6964d2ab"
});

const messaging = firebase.messaging();

// Обробка повідомлень у фоні
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Нагадування';
  const options = {
    body: payload.notification?.body || 'Перевірте заміс',
    icon: '/icon-192.png',
    image: payload.notification?.image,
  };
  self.registration.showNotification(title, options);
});