"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Ticket,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`
        w-full flex items-center gap-6 px-10 py-4 transition-all duration-300
        hover:bg-white/5 group relative cursor-pointer
        ${active ? "bg-white/10" : ""}
      `}
    >
      <Icon
        className={`w-7 h-7 transition-all duration-300 ${active ? "text-white" : "text-white/80 group-hover:text-white"}`}
        strokeWidth={2}
      />
      <span
        className={`
        text-xl font-poppins transition-all duration-300
        ${active ? "text-white font-bold" : "text-white/80 group-hover:text-white"}
      `}
      >
        {label}
      </span>
    </Link>
  );
};

export const Sidebar = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const t = useTranslations("sidebar");

  const menuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: t("menu.dashboard"),
      href: "/dashboard",
    },
    {
      id: "projects",
      icon: FolderOpen,
      label: t("menu.projects"),
      href: "/projects",
    },
    {
      id: "technicians",
      icon: Users,
      label: t("menu.technicians"),
      href: "/technicians",
    },
    {
      id: "training",
      icon: Ticket,
      label: t("menu.training"),
      href: "/training",
    },
    {
      id: "aiAgents",
      icon: Search,
      label: t("menu.aiAgents"),
      href: "/ai-agents",
    },
  ];

  const footerItems = [
    { id: "profile", icon: User, label: t("footer.profile"), href: "/profile" },
    {
      id: "settings",
      icon: Settings,
      label: t("footer.settings"),
      href: "/settings",
    },
    { id: "logout", icon: LogOut, label: t("footer.logout"), href: "/" },
  ];

  return (
    <>
      {/* Zona de activación invisible en el borde izquierdo */}
      <div
        onMouseEnter={() => setIsVisible(true)}
        className="fixed top-0 left-0 w-6 h-screen z-40 transition-opacity"
      />

      <aside
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`
          fixed top-0 left-0 z-50 w-[340px] h-screen bg-primary 
          flex flex-col border-r border-white/20 shadow-[25px_0_60px_-15px_rgba(0,0,0,0.6)]
          transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]
          ${isVisible ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* User Account Section */}
        <div className="p-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#E0E0E0] flex items-center justify-center text-[#1C1C1C] text-3xl font-montserrat font-bold shrink-0">
            M
          </div>
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-white font-montserrat font-bold text-2xl leading-tight truncate">
              {t("user.name")}
            </h2>
            <span className="text-white/80 text-sm font-poppins font-normal truncate">
              Fundacion Impacto Social
            </span>
            <span className="text-white font-poppins font-bold text-base mt-0.5">
              {t("user.role")}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/30" />

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col py-6 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={item.href}
            />
          ))}
        </nav>

        {/* Divider */}
        <div className="w-full h-px bg-white/30" />

        {/* Bottom Actions */}
        <div className="py-8 flex flex-col">
          {footerItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={item.href}
            />
          ))}
        </div>

        {/* Extra space at bottom to match Figma empty area */}
        <div className="h-40 shrink-0" />
      </aside>

      {/* Overlay sutil para mejorar la profundidad */}
      <div
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 transition-opacity duration-700 pointer-events-none
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />
    </>
  );
};
