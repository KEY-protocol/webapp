"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoFullIcon } from "@/app/components/icons";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("header.nav");

  return (
    <>
      <header
        id="main-header"
        className="fixed top-0 left-0 right-0 z-50 bg-[#007A1C] shadow-lg shadow-black/5"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              id="header-logo-link"
              className="flex items-center gap-2"
              aria-label="Key Protocol - Home"
            >
              <LogoFullIcon className="h-8 w-auto text-white" />
            </Link>

            {/* Right section: Language Switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to push content below fixed header */}
      <div className="h-16 sm:h-20" aria-hidden="true" />
    </>
  );
}
