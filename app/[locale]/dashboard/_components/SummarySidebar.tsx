"use client";

import { useTranslations } from "next-intl";

interface SidebarCardProps {
  label: string;
  value: string;
  className?: string;
}

const SidebarCard = ({ label, value, className = "" }: SidebarCardProps) => (
  <div className={`bg-[#2c313a] p-4 rounded-md shadow-lg ${className}`}>
    <p className="text-gray-400 text-xs font-poppins mb-1">{label}</p>
    <p className="text-white text-3xl font-montserrat font-medium">{value}</p>
  </div>
);

const MiniCard = ({ label, value }: SidebarCardProps) => (
  <div className="bg-[#2c313a] p-3 rounded-md shadow-lg flex-1">
    <p className="text-gray-400 text-[10px] font-poppins mb-1">{label}</p>
    <p className="text-white text-xl font-montserrat font-semibold">{value}</p>
  </div>
);

export const SummarySidebar = () => {
  const t = useTranslations("dashboard_page.geo_visualization.sidebar");

  return (
    <div className="flex flex-col gap-4 h-full">
      <SidebarCard label={t("provinces")} value="Formosa" />
      <SidebarCard label={t("type")} value="Modulo Chaguaral" />
      <SidebarCard label={t("zone")} value="Nueva Pompeya" />

      <div className="flex gap-4">
        <MiniCard label={t("pilot_sup")} value="10.518,46" />
        <MiniCard label={t("community_sup")} value="474.513,18" />
      </div>
    </div>
  );
};
