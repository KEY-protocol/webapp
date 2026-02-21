"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";

interface EditTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: {
    name: string;
    role: string;
    id: string;
    birthDate: string;
    project: string;
    expertise: string;
    zone: string;
    wallet: string;
    did: string;
  };
}

export default function EditTechnicianModal({
  isOpen,
  onClose,
  technician,
}: EditTechnicianModalProps) {
  const t = useTranslations("technicians_page");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#1a2b15] border border-white/10 rounded-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-montserrat text-3xl font-bold text-white">
              {t("edit_modal.title")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name (Full Width) */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("edit_modal.name_label")}
                </label>
                <input
                  type="text"
                  defaultValue={technician.name}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("role")}
                </label>
                <input
                  type="text"
                  defaultValue={technician.role}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins"
                />
              </div>

              {/* ID */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("id")}
                </label>
                <input
                  type="text"
                  defaultValue={technician.id}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins"
                />
              </div>

              {/* Birthdate */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("birthdate")}
                </label>
                <input
                  type="text"
                  defaultValue={technician.birthDate}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins"
                />
              </div>

              {/* Project */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("project")}
                </label>
                <input
                  type="text"
                  defaultValue={technician.project}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins"
                />
              </div>

              {/* Expertise (Full Width) */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("expertise")}
                </label>
                <textarea
                  defaultValue={technician.expertise}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins resize-none"
                ></textarea>
              </div>

              {/* Zone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("zone")}
                </label>
                <input
                  type="text"
                  defaultValue={technician.zone}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins"
                />
              </div>

              {/* Wallet */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("wallet")}
                </label>
                <input
                  type="text"
                  defaultValue={technician.wallet}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins"
                />
              </div>

              {/* DID (Full Width) */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("did")}
                </label>
                <input
                  type="text"
                  defaultValue={technician.did}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors font-poppins"
              >
                {t("edit_modal.cancel")}
              </button>
              <button
                type="button"
                className="px-8 py-3 rounded-2xl bg-[#28a745] text-white font-bold hover:bg-[#218838] transition-colors shadow-lg shadow-green-950/20 font-poppins"
              >
                {t("edit_modal.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
