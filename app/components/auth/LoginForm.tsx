"use client";

import { useTranslations } from "next-intl";
import { LoginFormActions } from "./LoginFormActions";

/**
 * Login form component containing email and password fields,
 * and the corresponding action buttons.
 */
export function LoginForm() {
  const t = useTranslations("auth.login");

  return (
    <div className="w-full space-y-8">
      <div className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-poppins text-white ml-1">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-poppins text-white ml-1">
            {t("passwordLabel")}
          </label>
          <input
            type="password"
            placeholder={t("passwordPlaceholder")}
            className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner"
          />
        </div>
      </div>

      <LoginFormActions />
    </div>
  );
}
