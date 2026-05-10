"use client";

import { useTranslations } from "next-intl";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { Spinner } from "@/app/components/common/Spinner";

interface LoginFormActionsProps {
  /** Whether the form is currently submitting. */
  isLoading?: boolean;
}

/**
 * Action buttons for the login form.
 * Includes the main sign-in button (as submit), divider, Google sign-in, and registration link.
 */
export function LoginFormActions({ isLoading = false }: LoginFormActionsProps) {
  const t = useTranslations("auth.login");

  return (
    <div className="flex flex-col items-center gap-6 pt-2">
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#28a745] hover:bg-[#218838] text-white font-poppins font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-950/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isLoading ? (
          <>
            <Spinner />
            {t("sending")}
          </>
        ) : (
          t("send")
        )}
      </button>

      {/* Google Sign In */}
      <GoogleSignInButton />
    </div>
  );
}
