import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import api from "../api/api";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let messaging = null;

try {
  // Only initialize if we have the minimum required config fields
  if (firebaseConfig.apiKey && firebaseConfig.messagingSenderId && firebaseConfig.appId) {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    console.log("🔥 Firebase initialized successfully on client.");
  } else {
    console.warn("⚠️ Firebase configuration keys are missing. Push notifications will run in MOCK mode.");
  }
} catch (error) {
  console.error("❌ Failed to initialize Firebase on client:", error);
}

/**
 * Requests browser notification permission and retrieves FCM token.
 * Registers the token with the server if granted.
 */
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log(`[Notification Permission] State: ${permission}`);

    if (permission === "granted") {
      if (!messaging) {
        console.log("📢 [MOCK FCM] Notification permission granted. FCM is in mock mode.");
        return "mock_fcm_token_" + Date.now();
      }

      const swUrl = `/firebase-messaging-sw.js?apiKey=${import.meta.env.VITE_FIREBASE_API_KEY}&authDomain=${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}&projectId=${import.meta.env.VITE_FIREBASE_PROJECT_ID}&storageBucket=${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}&messagingSenderId=${import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}&appId=${import.meta.env.VITE_FIREBASE_APP_ID}`;
      const registration = await navigator.serviceWorker.register(swUrl);

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        // Send token to server
        await api.post("/citizen/fcm-token", { token, deviceType: "web" });
        console.log("🔥 FCM token registered on server:", token);
        return token;
      }
    }
  } catch (error) {
    console.error("❌ Error requesting permission / retrieving token:", error);
  }
  return null;
};

/**
 * Listens for incoming FCM messages when the app is in the foreground.
 * Call this inside components to handle live notifications.
 */
export const onMessageListener = (callback) => {
  if (!messaging) {
    return () => {};
  }
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};
