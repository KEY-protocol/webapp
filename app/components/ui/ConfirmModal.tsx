"use client";

import React from "react";
import { AlertTriangle, CheckCircle, HelpCircle, X } from "lucide-react";

export type ConfirmVariant = "danger" | "success" | "warning" | "info";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
}

const variantStyles: Record<
  ConfirmVariant,
  {
    icon: React.ReactNode;
    bgIcon: string;
    confirmBtn: string;
  }
> = {
  danger: {
    icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
    bgIcon: "bg-red-500/10 border-red-500/20",
    confirmBtn:
      "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/30",
  },
  success: {
    icon: <CheckCircle className="w-6 h-6 text-emerald-400" />,
    bgIcon: "bg-emerald-500/10 border-emerald-500/20",
    confirmBtn:
      "bg-[#28a745] hover:bg-[#218838] text-white shadow-lg shadow-green-950/30",
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
    bgIcon: "bg-amber-500/10 border-amber-500/20",
    confirmBtn:
      "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950/30",
  },
  info: {
    icon: <HelpCircle className="w-6 h-6 text-cyan-400" />,
    bgIcon: "bg-cyan-500/10 border-cyan-500/20",
    confirmBtn:
      "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/30",
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const currentVariant = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#132210] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 select-none">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          {/* Icon Badge */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${currentVariant.bgIcon}`}
          >
            {currentVariant.icon}
          </div>

          <div className="space-y-2">
            <h3 className="font-montserrat font-bold text-xl text-white">
              {title}
            </h3>
            {description && (
              <p className="font-poppins text-sm text-white/60 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white/80 hover:text-white hover:bg-white/5 text-sm font-semibold font-poppins transition-all cursor-pointer disabled:opacity-50 text-center"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold font-poppins transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${currentVariant.confirmBtn}`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
