"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LoginFormActions } from "./LoginFormActions";
// TODO: Remove DevCredentialsPanel import before production deployment.
import { DevCredentialsPanel } from "./DevCredentialsPanel";

/**
 * Login form component containing email, password,
 * and the corresponding action buttons.
 */
export function LoginForm() {
  const t = useTranslations("auth.login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * TODO: Remove this handler before production deployment.
   * It enables auto-filling credentials from the DevCredentialsPanel.
   */
  const handleDevCredentialSelect = (devEmail: string, devPassword: string) => {
    setEmail(devEmail);
    setPassword(devPassword);
  };

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner"
          />
        </div>
      </div>

      <LoginFormActions />

      {/* TODO: Remove DevCredentialsPanel before production deployment. */}
      {process.env.NODE_ENV !== "production" && (
        <DevCredentialsPanel onSelectCredential={handleDevCredentialSelect} />
      )}
    </div>
  );
}
