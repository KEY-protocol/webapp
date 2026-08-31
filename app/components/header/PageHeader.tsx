"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Bell, Settings, LogOut } from "lucide-react";
import { useSidebar } from "@/app/context/SidebarContext";
import { useData } from "@/app/context/DataContext";
import { useAuth } from "@/app/context/AuthContext";
import { Link, useRouter } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationsModal } from "./NotificationsModal";
import { SettingsModal } from "./SettingsModal";

interface PageHeaderProps {
  namespace: string;
}

const MOCK_NOTIFICATIONS: any[] = [];

export const PageHeader = ({ namespace }: PageHeaderProps) => {
  const t = useTranslations("sidebar");
  const r = useTranslations("roles");
  const { toggle } = useSidebar();
  const { data } = useData();
  const { clearAuth } = useAuth();
  const router = useRouter();
  const currentUser = data.currentUser;
  const isSuperadmin = currentUser.role === "superadmin";

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "superadmin":
        return r("superadmin");
      case "admin":
        return r("admin");
      default:
        return role;
    }
  };

  return (
    <header className="w-full bg-primary border-b border-white/10 px-8 py-4 flex items-center justify-between relative z-40">
      <div className="flex items-center gap-6">
        {/* Menu Icon — hidden for superadmin (no sidebar) */}
        {!isSuperadmin && (
          <button
            onClick={toggle}
            className="text-white/80 hover:text-white transition-colors"
          >
            <Menu size={28} />
          </button>
        )}

        {/* Title and Subtitle */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-montserrat font-bold text-white leading-tight">
            {t(`menu.${namespace.includes(".") ? namespace.split(".").pop() : namespace}.title`)}
          </h1>
          <p className="text-sm font-poppins text-white/60">
            {t(`menu.${namespace.includes(".") ? namespace.split(".").pop() : namespace}.subtitle`)}
          </p>
        </div>

        {/* Superadmin Top Nav Links */}
        {isSuperadmin && (
          <div className="hidden md:flex items-center gap-2 ml-6">
            <Link
              href="/organizations"
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-poppins font-semibold text-xs transition-all border border-white/10"
            >
              Organizaciones
            </Link>
            <Link
              href="/superadmin-forms"
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-poppins font-semibold text-xs transition-all border border-white/10"
            >
              Formularios Mobile
            </Link>
            <Link
              href="/superadmin-audit"
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-poppins font-semibold text-xs transition-all border border-white/10"
            >
              Auditoría Global
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          {/* Settings — only for encargado/admin */}
          {!isSuperadmin && (
            <>
              {/* TODO: [FUTURE-FEATURE] Descomentar la campanita de notificaciones cuando se conecte con el servicio en tiempo real / websockets */}
              {/*
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
              */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-white/80 hover:text-white transition-colors p-2"
              >
                <Settings size={22} />
              </button>
            </>
          )}

          {/* Logout button — only for superadmin (sidebar handles logout for others) */}
          {isSuperadmin && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              title={t("footer.logout")}
            >
              <LogOut size={20} />
              <span className="text-sm font-poppins hidden sm:inline">
                {t("footer.logout")}
              </span>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-white/20" />

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#E0E0E0] flex items-center justify-center text-[#1C1C1C] text-xl font-montserrat font-bold shrink-0">
            {currentUser.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
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

      {/* Modals — only rendered for non-superadmin roles */}
      {!isSuperadmin && (
        <>
          {/* TODO: [FUTURE-FEATURE] Habilitar NotificationsModal una vez implementado el backend de notificaciones en tiempo real */}
          {/*
          <NotificationsModal
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
          />
          */}

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            user={{
              name: currentUser.name,
              email: currentUser.email,
              role: getRoleLabel(currentUser.role),
              authProvider: "manual",
            }}
          />
        </>
      )}
    </header>
  );
};
