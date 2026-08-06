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
    // TODO: [GOOGLE-AUTH] Descomentar la redirección cuando el proveedor OAuth de Google esté configurado en auth.ts.
    // signIn("google", { callbackUrl: "/home" });
    console.log("TODO: Google Sign-In is disabled for now.");
  };

  return (
    <button
      id="google-sign-in-button"
      type="button"
      disabled
      onClick={handleGoogleSignIn}
      className="w-full bg-white/50 text-gray-500 font-poppins font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition-all cursor-not-allowed opacity-60"
    >
      <GoogleIcon size={20} />
      {t("googleSignIn")} (Próximamente)
    </button>
  );
}
