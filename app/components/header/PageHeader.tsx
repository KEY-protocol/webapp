"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Bell, Settings } from "lucide-react";
import { useSidebar } from "@/app/context/SidebarContext";
import { useData } from "@/app/context/DataContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationsModal } from "./NotificationsModal";
import { SettingsModal } from "./SettingsModal";

interface PageHeaderProps {
  namespace: string;
}

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "project",
    title: "Nuevo proyecto asignado",
    message: "Se te ha asignado al proyecto 'Regeneración Chaco'.",
    time: "2h",
    isRead: false,
  },
  {
    id: "2",
    type: "training",
    title: "Capacitación completada",
    message: "Has finalizado el módulo de 'Producción Sostenible'.",
    time: "5h",
    isRead: false,
  },
  {
    id: "3",
    type: "system",
    title: "Actualización de sistema",
    message: "Se han implementado nuevas mejoras en el dashboard.",
    time: "1d",
    isRead: true,
  },
];

export const PageHeader = ({ namespace }: PageHeaderProps) => {
  const t = useTranslations("sidebar");
  const { toggle } = useSidebar();
  const { data } = useData();
  const currentUser = data.currentUser;

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "superadmin":
        return "Superadmin";
      case "encargado":
        return "Encargado de Org";
      case "admin":
        return "Administrador";
      default:
        return role;
    }
  };

  return (
    <header className="w-full bg-primary border-b border-white/10 px-8 py-4 flex items-center justify-between relative z-40">
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
            {namespace.includes(".")
              ? namespace.split(".").pop()?.toUpperCase()
              : t(`menu.${namespace}.title`)}
          </h1>
          <p className="text-sm font-poppins text-white/60">
            {namespace.includes(".") ? "" : t(`menu.${namespace}.subtitle`)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="text-white/80 hover:text-white transition-colors p-2 relative group"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-tertiary text-primary text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-primary group-hover:scale-110 transition-transform">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-white/80 hover:text-white transition-colors p-2"
          >
            <Settings size={22} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-white/20" />

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#E0E0E0] flex items-center justify-center text-[#1C1C1C] text-xl font-montserrat font-bold shrink-0">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-white font-montserrat font-bold text-lg leading-tight">
              {currentUser.name}
            </span>
            <span className="text-white/60 text-xs font-poppins">
              {getRoleLabel(currentUser.role)}
            </span>
          </div>
        </div>
      </div>

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={{
          name: currentUser.name,
          email: currentUser.email,
          role: getRoleLabel(currentUser.role),
          organization:
            data.organizations.find((o) => o.id === currentUser.organizationId)
              ?.name || "N/A",
          authProvider: "google",
        }}
      />
    </header>
  );
};
