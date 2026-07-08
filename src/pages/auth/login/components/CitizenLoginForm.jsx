// @ts-nocheck
import { Phone } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function CitizenLoginForm({
  showOtpInput,
  phone,
  setPhone,
  otp,
  setOtp,
  generatedOtp,
  onGetOtp,
  onVerifyOtp,
  onChangePhone,
}) {
  const { t } = useTranslation();
  const otpInputsRef = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = otp.split("");
    newOtp[index] = value.slice(-1);
    setOtp(newOtp.join(""));

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }

    // 🔥 Enter key verifies OTP
    if (e.key === "Enter") {
      onVerifyOtp();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      setOtp(pastedData.padEnd(6, ""));
      const lastIndex = Math.min(pastedData.length, 5);
      otpInputsRef.current[lastIndex]?.focus();
    }
  };

  return (
    <>
      {!showOtpInput ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("phone")}
          </label>

          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                /^\d*$/.test(e.target.value) &&
                e.target.value.length <= 10 &&
                setPhone(e.target.value)
              }

              // 🔥 ENTER KEY SUPPORT
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onGetOtp();
                }
              }}

              placeholder={t("phone")}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={onGetOtp}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {t("getOtp")}
          </button>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("enterOtp")}
          </label>

          <div className="flex gap-2 justify-center mb-4" onPaste={handleOtpPaste}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (otpInputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index] || ""}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            ))}
          </div>

          <p className="text-xs text-center text-gray-500 mt-2">
            OTP:{" "}
            <span className="font-bold text-emerald-600">{generatedOtp}</span>
          </p>

          <button
            type="button"
            onClick={onVerifyOtp}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {t("verifyOtp")}
          </button>

          <button
            type="button"
            onClick={onChangePhone}
            className="w-full mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            ← {t("changePhone")}
          </button>
        </div>
      )}
    </>
  );
}