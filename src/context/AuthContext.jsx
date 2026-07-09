// @ts-nocheck
import { createContext, useContext, useEffect, useState } from "react";
import { requestNotificationPermission } from "../utils/fcm.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.role === "citizen") {
      // 1. Initial permission request & registration on login/restore
      requestNotificationPermission();

      // 2. Schedule checking for token rotation every 1 hour
      const intervalId = setInterval(() => {
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          requestNotificationPermission();
        }
      }, 3600000); // 1 hour

      // 3. Foreground activation check (refreshes if user focuses tab)
      const handleFocus = () => {
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          requestNotificationPermission();
        }
      };
      window.addEventListener("focus", handleFocus);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [user]);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null); // 🔑 REQUIRED for re-login to work
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
