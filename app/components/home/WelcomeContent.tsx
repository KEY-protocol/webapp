"use client";

import { useTranslations } from "next-intl";
import { HiHandIcon } from "@/app/components/icons";

export function WelcomeContent() {
  const t = useTranslations("home");

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 min-h-[calc(100vh-160px)]">
      <div className="flex flex-col items-center max-w-2xl space-y-8 fade-in">
        <div className="w-52 h-52">
          <HiHandIcon fill="white" />
        </div>

        <div className="space-y-6">
          <h1 className="text-6xl font-montserrat font-bold text-white tracking-tight">
            {t("welcome")}
          </h1>
          <p className="text-xl font-poppins text-white/80 leading-relaxed font-normal">
            {t("description")}
          </p>
        </div>
      </div>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 1.2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
