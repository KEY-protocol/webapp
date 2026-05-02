"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { GoogleIcon } from "../icons";

/**
 * Google Sign-In Button component.
 *
 * Uses NextAuth's client-side signIn function to redirect the user
 * to Google's OAuth consent screen. After successful auth, the user
 * is redirected to /home.
 *
 * TODO: When the backend login endpoint is ready, update the callbackUrl
 * or add post-login logic to sync the Google session with the backend.
 */
export function GoogleSignInButton() {
  const t = useTranslations("auth.login");

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/home" });
  };

  return (
    <button
      id="google-sign-in-button"
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full bg-white hover:bg-gray-100 text-gray-800 font-poppins font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg cursor-pointer"
    >
      <GoogleIcon size={20} />
      {t("googleSignIn")}
    </button>
  );
}
