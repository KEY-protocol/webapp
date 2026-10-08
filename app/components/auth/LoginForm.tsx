"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LoginFormActions } from "./LoginFormActions";
import {
  loginWithCredentials,
  AuthApiError,
  type FederatedLoginResponse,
} from "@/app/lib/auth-api";
import { useAuth } from "@/app/context/AuthContext";
import { PasswordInput } from "@/app/components/ui/PasswordInput";

/**
 * Login form component containing email and password fields.
 */
export function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Completes the login by storing auth data and redirecting.
   * Admin goes to /organizations (their only view).
   * Everyone else goes to /home.
   */
  const completeLogin = (response: FederatedLoginResponse) => {
    setAuth(response);
    const isAdmin = response.user.role.toUpperCase() === "ADMIN";
    const targetPath = isAdmin ? "/organizations" : "/home";
    if (typeof window !== "undefined") {
      window.location.href = targetPath;
    } else {
      router.push(targetPath);
    }
  };

  /**
   * Handles the login form submission.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError(t("errorMissingFields"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginWithCredentials({
        email: email.trim(),
        password,
      });

      completeLogin(response);
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.status === 401) {
          setError(t("errorInvalidCredentials"));
        } else if (err.status === 404) {
          setError(t("errorOngNotFound"));
        } else if (err.status === 502 || err.status === 504) {
          setError(t("errorServerUnavailable"));
        } else if (err.status === 429) {
          setError(t("errorTooManyAttempts"));
        } else {
          setError(err.message);
        }
      } else {
        setError(t("errorGeneric"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      <div className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="block text-sm font-poppins text-white ml-1"
          >
            {t("emailLabel")}
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            disabled={isLoading}
            className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="block text-sm font-poppins text-white ml-1"
          >
            {t("passwordLabel")}
          </label>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            disabled={isLoading}
            className="w-full bg-[#1a2b15] border border-white/10 rounded-xl py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-poppins rounded-xl px-4 py-3 animate-in fade-in duration-200"
          >
            {error}
          </div>
        )}
      </div>

      <LoginFormActions isLoading={isLoading} />
    </form>
  );
}
