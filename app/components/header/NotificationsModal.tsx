"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  X,
  Bell,
  Package,
  BookOpen,
  Settings as SettingsIcon,
  CheckCircle2,
} from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationsModal = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}: NotificationsModalProps) => {
  const t = useTranslations("notifications");

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Package className="w-5 h-5 text-tertiary" />;
      case "training":
        return <BookOpen className="w-5 h-5 text-accent" />;
      default:
        return <SettingsIcon className="w-5 h-5 text-white/60" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-primary border border-white/10 rounded-4xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 max-h-[85vh]">
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-tertiary/10 rounded-xl">
              <Bell className="w-5 h-5 text-tertiary" />
            </div>
            <div>
              <h2 className="font-montserrat text-xl font-bold text-white leading-none">
                {t("title")}
              </h2>
              {unreadCount > 0 && (
                <p className="text-xs font-poppins text-tertiary mt-1">
                  {unreadCount} {t("unread").toLowerCase()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/40 font-poppins">{t("empty")}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative p-4 rounded-2xl border transition-all duration-200 ${
                  notification.isRead
                    ? "bg-transparent border-white/5"
                    : "bg-white/5 border-white/10 shadow-lg shadow-black/5"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`mt-1 p-2 rounded-lg shrink-0 ${
                      notification.isRead ? "bg-white/5" : "bg-white/10"
                    }`}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3
                        className={`font-montserrat font-bold text-sm truncate ${
                          notification.isRead ? "text-white/60" : "text-white"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-[10px] font-poppins text-white/40 whitespace-nowrap mt-0.5">
                        {t("time", { time: notification.time })}
                      </span>
                    </div>
                    <p
                      className={`text-xs font-poppins mt-1 leading-relaxed ${
                        notification.isRead ? "text-white/40" : "text-white/70"
                      }`}
                    >
                      {notification.message}
                    </p>

                    {!notification.isRead && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-tertiary hover:text-tertiary/80 transition-colors uppercase tracking-wider"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t("markAsRead")}
                      </button>
                    )}
                  </div>
                </div>

                {!notification.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-tertiary rounded-full animate-pulse" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 bg-white/5 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-montserrat font-bold text-sm transition-all"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
