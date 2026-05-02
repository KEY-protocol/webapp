"use client";

import { useTranslations } from "next-intl";

/**
 * Header component for the authentication pages.
 * Displays a title and a subtitle.
 */
export function AuthHeader() {
  const t = useTranslations("auth.login");

  return (
    <div className="text-center mb-10 space-y-4">
      <h1 className="text-4xl font-montserrat font-bold text-white tracking-wide">
        {t("title")}
      </h1>
      <p className="text-lg font-poppins text-white/70">{t("subtitle")}</p>
    </div>
  );
}
