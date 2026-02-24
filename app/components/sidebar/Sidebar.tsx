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
  LogOut,
} from "lucide-react";
import { LogoFullIcon } from "@/app/components/icons/org/LogoFullIcon";
import { useSidebar } from "@/app/context/SidebarContext";

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
        w-full flex items-center gap-6 px-10 py-3.5 transition-all duration-300
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
  const { isOpen, setIsOpen } = useSidebar();
  const t = useTranslations("sidebar");

  const menuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: t("menu.dashboard.title"),
      href: "/dashboard",
    },
    {
      id: "projects",
      icon: FolderOpen,
      label: t("menu.projects.title"),
      href: "/projects",
    },
    {
      id: "technicians",
      icon: Users,
      label: t("menu.technicians.title"),
      href: "/technicians",
    },
    {
      id: "training",
      icon: Ticket,
      label: t("menu.training.title"),
      href: "/training",
    },
    {
      id: "aiAgents",
      icon: Search,
      label: t("menu.aiAgents.title"),
      href: "/ai-agents",
    },
  ];

  const footerItems = [
    { id: "logout", icon: LogOut, label: t("footer.logout"), href: "/" },
  ];

  return (
    <>
      <aside
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`
          fixed top-0 left-0 z-50 w-85 h-screen bg-primary 
          flex flex-col border-r border-white/20 shadow-[25px_0_60px_-15px_rgba(0,0,0,0.6)]
          transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Company Logo Section */}
        <div className="px-10 py-4 flex items-center justify-center">
          <div className="w-full max-w-50">
            <LogoFullIcon className="w-full h-auto text-white" />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/30" />

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col py-4 overflow-y-auto no-scrollbar">
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

        {/* Footer Navigation */}
        <div className="py-4 border-t border-white/20 flex flex-col">
          {footerItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={item.href}
            />
          ))}
        </div>

        {/* Extra space at bottom */}
        <div className="h-8 shrink-0" />
      </aside>

      {/* Overlay sutil para mejorar la profundidad */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 transition-opacity duration-700 pointer-events-none
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"}
        `}
      />
    </>
  );
};
