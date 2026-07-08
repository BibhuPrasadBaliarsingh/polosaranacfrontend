import React from "react";
import { User, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState, useRef } from "react";

export default function StaffLoginForm({
  username,
  setUsername,
  password,
  setPassword,
  onLogin,
  role,
  onDownloadGuide,
}) {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  const handleUsernameKeyDown = (e) => {
    if (e.key === "Enter") {
      passwordRef.current?.focus();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      onLogin && onLogin(username?.trim().toLowerCase());
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("username")}
      </label>

      <div className="relative mb-4">
        <User
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleUsernameKeyDown}
          placeholder={t("username")}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
        />
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("password")}
      </label>

      <div className="relative">
        <Lock
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />

        <input
          ref={passwordRef}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handlePasswordKeyDown}
          placeholder={t("password")}
          className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={() => onLogin && onLogin(username?.trim().toLowerCase())}
        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
      >
        {t("login")}
      </button>

      {(role === "admin" || role === "supervisor") && (
        <button
          type="button"
          onClick={onDownloadGuide}
          className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Download SWM Guide
        </button>
      )}
    </div>
  );
}