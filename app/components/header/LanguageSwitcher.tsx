"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  es: "ES",
  pt: "PT",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableLocales = Object.keys(LOCALE_LABELS).filter(
    (l) => l !== locale,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        id="language-switcher-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-white text-white hover:bg-white/10 transition-all duration-300 cursor-pointer text-sm font-semibold tracking-wide"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="font-poppins">{LOCALE_LABELS[locale]}</span>
      </button>

      {/* Dropdown */}
      <div
        role="listbox"
        aria-label="Select language"
        className={`absolute right-0 top-full mt-2 min-w-[80px] rounded-lg border border-gray-200 bg-white shadow-xl overflow-hidden transition-all duration-300 origin-top-right ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {availableLocales.map((l) => (
          <button
            key={l}
            role="option"
            aria-selected={l === locale}
            type="button"
            onClick={() => switchLocale(l)}
            className="flex items-center justify-center w-full px-4 py-2 text-sm text-black hover:bg-gray-100 transition-all duration-200 cursor-pointer font-semibold font-poppins"
          >
            {LOCALE_LABELS[l]}
          </button>
        ))}
      </div>
    </div>
  );
}
