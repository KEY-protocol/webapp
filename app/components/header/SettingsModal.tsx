"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  X,
  User,
  Shield,
  Link as LinkIcon,
  Mail,
  Building,
  Key,
  MailCheck,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    organization: string;
    authProvider: "google" | "manual";
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 flex items-center gap-2">
                  <Building size={14} /> {t("fields.organization")}
                </label>
                <input
                  type="text"
                  defaultValue={user.organization}
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
                    disabled={user.authProvider === "google"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white/50 disabled:cursor-not-allowed font-poppins"
                  />
                  {user.authProvider === "google" && (
                    <MailCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                  )}
                </div>
              </div>

              {user.authProvider === "manual" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/60 flex items-center gap-2">
                      <Key size={14} /> {t("fields.password")}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-poppins"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/60 flex items-center gap-2">
                      <Key size={14} /> {t("fields.confirm_password")}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-poppins"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Linked Accounts */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-white/40 uppercase text-xs font-bold tracking-widest mb-2">
              <LinkIcon className="w-3.5 h-3.5" />
              {t("sections.linked_accounts")}
            </div>
            <div
              className={`flex items-center justify-between p-4 rounded-2xl border ${
                user.authProvider === "google"
                  ? "bg-white/10 border-tertiary/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    user.authProvider === "google"
                      ? "bg-white text-[#4285F4]"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white">Google</h4>
                  <p className="text-xs text-white/60">
                    {t("linked.description", {
                      method:
                        user.authProvider === "google"
                          ? t("linked.google")
                          : t("linked.manual"),
                    })}
                  </p>
                </div>
              </div>
              <div
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  user.authProvider === "google"
                    ? "bg-tertiary/20 text-tertiary"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {user.authProvider === "google" ? "Active" : "Not Linked"}
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
