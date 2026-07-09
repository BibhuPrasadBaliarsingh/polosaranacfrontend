import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import api from "../api/api";

// Check HTTPS requirements in production
if (typeof window !== "undefined") {
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!isLocalhost && window.location.protocol !== "https:") {
    console.error("❌ PWA Push Notifications CRITICAL WARNING: FCM and Service Workers require HTTPS in production! Push will fail on this domain.");
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://polosaranacbackend.onrender.com/api";
  if (!isLocalhost && !apiBaseUrl.startsWith("https://")) {
    console.warn(`⚠️ PWA Push Notifications WARNING: API base URL "${apiBaseUrl}" is not using HTTPS. Push subscriptions might fail.`);
  }
}

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
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification. (Check if you are on HTTPS)");
      return null;
    }

    if (!("serviceWorker" in navigator)) {
      console.error("Service Worker is not supported in this browser. (Check if you are on HTTPS)");
      return null;
    }

    const permission = await Notification.requestPermission();
    console.log(`[Notification Permission] State: ${permission}`);

    if (permission === "granted") {
      if (!messaging) {
        console.log("📢 [MOCK FCM] Notification permission granted. FCM is in mock mode.");
        return "mock_fcm_token_" + Date.now();
      }

      console.log("✔ [FCM Client] Notification permission granted. Registering service worker...");
      const swUrl = "/firebase-messaging-sw.js";
      const registration = await navigator.serviceWorker.register(swUrl, { scope: "/firebase-cloud-messaging-push-scope" });
      console.log("✔ [FCM Client] Service Worker registered at scope:", registration.scope);

      console.log("✔ [FCM Client] Retrieving FCM token...");
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      if (token) {
        console.log("✔ [FCM Client] Token generated:", token);
        // Send token to server
        await api.post("/citizen/fcm-token", { token, deviceType: "web" });
        console.log("✔ [FCM Client] Token registered on server.");
        return token;
      } else {
        console.warn("⚠️ [FCM Client] No token received from Firebase.");
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
