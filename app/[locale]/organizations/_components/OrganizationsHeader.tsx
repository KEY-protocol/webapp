"use client";

import React from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

interface OrganizationsHeaderProps {
  onAddNewClick: () => void;
  t: (key: string) => string;
}

export const OrganizationsHeader = ({
  onAddNewClick,
  t,
}: OrganizationsHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-montserrat font-bold text-white">
          {t("title")}
        </h1>
        <p className="text-white/60 font-poppins">{t("subtitle")}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/audit-evidence")}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-bold font-poppins transition-all cursor-pointer"
        >
          <ShieldCheck size={20} className="text-[#28a745]" />
          Auditoría de Evidencias
        </button>

        <button
          onClick={onAddNewClick}
          className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold font-poppins hover:bg-white/90 transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus size={20} />
          {t("newOrgButton")}
        </button>
      </div>
    </div>
  );
};
