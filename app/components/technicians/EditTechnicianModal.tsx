"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import type {
  TechnicianDetail,
  UpdateTechnicianPayload,
} from "@/app/types/technician";

interface EditTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: TechnicianDetail | null;
  onSave: (id: string, payload: UpdateTechnicianPayload) => Promise<boolean>;
  isSaving: boolean;
}

export default function EditTechnicianModal({
  isOpen,
  onClose,
  technician,
  onSave,
  isSaving,
}: EditTechnicianModalProps) {
  const t = useTranslations("technicians_page.edit_modal");

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");

  // Sync form state when technician changes
  const prevId = useState<string | null>(null);
  if (technician && technician.id !== prevId[0]) {
    prevId[1](technician.id);
    setName(technician.name || "");
    setSurname(technician.surname || "");
    setDocumentNumber(technician.documentNumber || "");
    setDocumentType(technician.documentType || "");
    setPhone(technician.phone || "");
    setSkills(technician.skills?.join(", ") || "");
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!technician) return;

      const payload: UpdateTechnicianPayload = {};
      if (name !== technician.name) payload.name = name;
      if (surname !== technician.surname) payload.surname = surname;
      if (documentNumber !== technician.documentNumber)
        payload.documentNumber = documentNumber;
      if (documentType !== technician.documentType)
        payload.documentType = documentType;
      if (phone !== (technician.phone || "")) payload.phone = phone;

      const parsedSkills = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const currentSkills = technician.skills || [];
      if (JSON.stringify(parsedSkills) !== JSON.stringify(currentSkills)) {
        payload.skills = parsedSkills;
      }

      // Only send if there are changes
      if (Object.keys(payload).length === 0) {
        onClose();
        return;
      }

      const success = await onSave(technician.id, payload);
      if (success) {
        toast.success("Información del técnico actualizada correctamente");
        onClose();
      } else {
        toast.error("Error al actualizar la información del técnico");
      }
    },
    [technician, name, surname, documentNumber, documentType, phone, skills, onSave, onClose],
  );

  if (!isOpen || !technician) return null;

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#1a2b15] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-montserrat text-2xl font-bold text-white">
              {t("title")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("name_label")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Surname */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("surname_label")}
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Document Number */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("document_number_label")}
                </label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Document Type */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("document_type_label")}
                </label>
                <input
                  type="text"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("phone_label")}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Skills (Full Width) */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">
                  {t("skills_label")}
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-8 py-3 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors font-poppins cursor-pointer disabled:opacity-50"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 rounded-2xl bg-[#28a745] text-white font-bold hover:bg-[#218838] transition-colors shadow-lg shadow-green-950/20 font-poppins cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {isSaving ? t("saving") : t("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
