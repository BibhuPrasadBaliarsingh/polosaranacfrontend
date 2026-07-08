// Give the service worker access to Firebase Messaging.
// Note that you can only import scripts from CDN in service worker context.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const params = new URLSearchParams(location.search);

firebase.initializeApp({
  apiKey: params.get('apiKey') || "PLACEHOLDER",
  authDomain: params.get('authDomain') || "PLACEHOLDER",
  projectId: params.get('projectId') || "PLACEHOLDER",
  storageBucket: params.get('storageBucket') || "PLACEHOLDER",
  messagingSenderId: params.get('messagingSenderId') || "PLACEHOLDER",
  appId: params.get('appId') || "PLACEHOLDER"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification
  const notificationTitle = payload.notification?.title || 'Vehicle Entry Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'A waste collection vehicle entered your ward.',
    icon: '/image.jpg',
    badge: '/image.jpg',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
