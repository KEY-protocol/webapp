"use client";

import { useTranslations } from "next-intl";
import { getCurrentYear } from "@/app/utils";

export function Footer() {
  const t = useTranslations("footer");
  const year = getCurrentYear();

  return (
    <footer className="bg-primary py-10 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-2">
        <p className="text-white/70 text-sm sm:text-base font-poppins tracking-wide">
          © {year} KEY protocol. {t("rights")}
        </p>
        <p className="text-white/40 text-xs sm:text-sm font-poppins">
          {t("slogan")}
        </p>
      </div>
    </footer>
  );
}
