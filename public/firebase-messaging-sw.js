// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Hardcode Firebase configuration to ensure reliable background initialization when tab is closed
const firebaseConfig = {
  apiKey: "AIzaSyATrbvCmffyPZuuSV4UcmnLL9LBNWtUL1I",
  authDomain: "waste-management-3063d.firebaseapp.com",
  projectId: "waste-management-3063d",
  storageBucket: "waste-management-3063d.firebasestorage.app",
  messagingSenderId: "246783683583",
  appId: "1:246783683583:web:6c65cd5961b4c72d3b55ca"
};

try {
  firebase.initializeApp(firebaseConfig);
  console.log("🔥 [Service Worker] Firebase initialized successfully inside sw.");
} catch (error) {
  console.error("❌ [Service Worker] Firebase initialization failed:", error);
}

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('📬 [Service Worker] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'Vehicle Entry Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'A waste collection vehicle entered your ward.',
    icon: '/image.jpg',
    badge: '/image.jpg',
    data: payload.data,
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification(notificationTitle, notificationOptions)
    .then(() => {
      console.log('✔ [Service Worker] Notification displayed successfully:', notificationTitle);
    })
    .catch((err) => {
      console.error('❌ [Service Worker] Failed to display notification:', err);
    });
});

// Handle notification click to focus or open PWA tab
self.addEventListener('notificationclick', (event) => {
  console.log('Original event target URL:', event.notification.data);
  console.log('✔ [Service Worker] Notification clicked:', event.notification);
  event.notification.close();

  const targetUrl = 'https://polosaranac.netlify.app';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.startsWith(targetUrl) && 'focus' in client) {
          console.log('✔ [Service Worker] Found existing PWA tab/window, focusing...');
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        console.log('✔ [Service Worker] No existing PWA tab found. Opening new window...');
        return clients.openWindow(targetUrl);
      }
    })
  );
});
