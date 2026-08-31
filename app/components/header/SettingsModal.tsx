"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  X,
  User,
  Shield,
  Mail,
  Key,
} from "lucide-react";
import { PasswordInput } from "@/app/components/ui/PasswordInput";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    role: string;
    authProvider?: "manual";
  };
}

export const SettingsModal = ({
  isOpen,
  onClose,
  user,
}: SettingsModalProps) => {
  const t = useTranslations("settings");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-primary border border-white/10 rounded-4xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl">
              <User className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-montserrat text-2xl font-bold text-white leading-none">
              {t("title")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8 text-white">
          {/* Personal Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-white/40 uppercase text-xs font-bold tracking-widest mb-2">
              <User className="w-3.5 h-3.5" />
              {t("sections.personal")}
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 flex items-center gap-2">
                  <User size={14} /> {t("fields.name")}
                </label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-poppins"
                />
              </div>
            </div>
          </section>

          {/* Email & Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-white/40 uppercase text-xs font-bold tracking-widest mb-2">
              <Shield className="w-3.5 h-3.5" />
              {t("sections.security")}
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 flex items-center gap-2">
                  <Mail size={14} /> {t("fields.email")}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white font-poppins"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 flex items-center gap-2">
                    <Key size={14} /> {t("fields.password")}
                  </label>
                  <PasswordInput
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-poppins"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 flex items-center gap-2">
                    <Key size={14} /> {t("fields.confirm_password")}
                  </label>
                  <PasswordInput
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-poppins"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white/5 border-t border-white/10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors font-poppins"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className="px-8 py-3 rounded-2xl bg-accent text-primary font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 font-poppins"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};
