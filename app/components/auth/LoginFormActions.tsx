"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GoogleSignInButton } from "./GoogleSignInButton";

/**
 * Action buttons for the login form.
 * Includes the main sign-in button, divider, Google sign-in, and registration link.
 */
export function LoginFormActions() {
  const t = useTranslations("auth.login");

  return (
    <div className="flex flex-col items-center gap-6 pt-2">
      <Link
        href="/home"
        className="w-full bg-[#28a745] hover:bg-[#218838] text-white font-poppins font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-950/20"
      >
        {t("send")}
      </Link>

      {/* Google Sign In */}
      <GoogleSignInButton />
    </div>
  );
}
