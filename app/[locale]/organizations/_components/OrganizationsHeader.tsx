"use client";

import React from "react";
import { Plus } from "lucide-react";

interface OrganizationsHeaderProps {
  onAddNewClick: () => void;
  t: (key: string) => string;
}

export const OrganizationsHeader = ({
  onAddNewClick,
  t,
}: OrganizationsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-montserrat font-bold text-white">
          {t("title")}
        </h1>
        <p className="text-white/60 font-poppins">{t("subtitle")}</p>
      </div>

      <button
        onClick={onAddNewClick}
        className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold font-poppins hover:bg-white/90 transition-all shadow-lg hover:scale-105 active:scale-95"
      >
        <Plus size={20} />
        {t("newOrgButton")}
      </button>
    </div>
  );
};
