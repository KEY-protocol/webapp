"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Menu, Bell, Settings } from "lucide-react";
import { useSidebar } from "@/app/context/SidebarContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface PageHeaderProps {
  namespace: string;
}

export const PageHeader = ({ namespace }: PageHeaderProps) => {
  const t = useTranslations("sidebar");
  const userData = useTranslations("sidebar.user");
  const { toggle } = useSidebar();

  return (
    <header className="w-full bg-primary border-b border-white/10 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {/* Menu Icon */}
        <button
          onClick={toggle}
          className="text-white/80 hover:text-white transition-colors"
        >
          <Menu size={28} />
        </button>

        {/* Title and Subtitle */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-montserrat font-bold text-white leading-tight">
            {t(`menu.${namespace}.title`)}
          </h1>
          <p className="text-sm font-poppins text-white/60">
            {t(`menu.${namespace}.subtitle`)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button className="text-white/80 hover:text-white transition-colors p-2">
            <Bell size={22} />
          </button>
          <button className="text-white/80 hover:text-white transition-colors p-2">
            <Settings size={22} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-white/20" />

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E0E0E0] flex items-center justify-center text-[#1C1C1C] text-xl font-montserrat font-bold shrink-0">
            {userData("name").charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-white font-montserrat font-bold text-lg leading-tight">
              {userData("name")}
            </span>
            <span className="text-white/60 text-xs font-poppins">
              {userData("role")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
