// Give the service worker access to Firebase Messaging.
// Note that you can only import scripts from CDN in service worker context.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in default / placeholder keys.
// These should match the application firebaseConfig.
firebase.initializeApp({
  apiKey: "PLACEHOLDER_KEY",
  authDomain: "PLACEHOLDER_DOMAIN",
  projectId: "PLACEHOLDER_PROJECT",
  storageBucket: "PLACEHOLDER_BUCKET",
  messagingSenderId: "PLACEHOLDER_SENDER_ID",
  appId: "PLACEHOLDER_APP_ID"
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
