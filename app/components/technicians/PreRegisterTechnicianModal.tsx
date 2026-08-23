"use client";

import React, { useState } from "react";
import { UserPlus, X, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import apiClient from "@/app/lib/api-client";
import { PhoneInput } from "@/app/components/ui/PhoneInput";

import type { TechnicianSummary } from "@/app/types/technician";

interface PreRegisterTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PreRegisterTechnicianModal({
  isOpen,
  onClose,
  onSuccess,
}: PreRegisterTechnicianModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    documentNumber: "",
    documentType: "DNI",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhoneChange = (fullFormattedPhone: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: fullFormattedPhone,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validar si el DNI ya está registrado en la plataforma
      const existingTechs = await apiClient.get<TechnicianSummary[]>("/technicians");
      const docNumClean = formData.documentNumber.trim().toLowerCase();
      const duplicate = existingTechs.data?.find(
        (tech: TechnicianSummary) =>
          tech.documentNumber?.trim().toLowerCase() === docNumClean,
      );

      if (duplicate) {
        const errorMsg = `Ya existe un técnico pre-registrado o registrado con el DNI/Documento "${formData.documentNumber}".`;
        setError(errorMsg);
        toast.warning(errorMsg);
        setIsLoading(false);
        return;
      }

      await apiClient.post("/technicians/pre-register", {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        documentNumber: formData.documentNumber.trim(),
        documentType: formData.documentType,
        phone: formData.phone.trim() || undefined,
      });

      toast.success("Técnico pre-registrado con éxito");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      const errorMsg =
        axiosErr.response?.data?.error ||
        axiosErr.message ||
        "Error al pre-registrar técnico";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#142612] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 select-none animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-[#28a745]" />
            <h2 className="font-montserrat text-xl font-bold text-white">
              Pre-registrar Técnico
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-white/60 font-poppins text-xs">
          Carga los datos del técnico habilitado para que pueda iniciar su enrolamiento en la App Mobile. La IA comparará sus datos biométricos con estos registros.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex items-center gap-3 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-xs font-poppins font-medium mb-1.5">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Juan"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
              />
            </div>

            <div>
              <label className="block text-white/70 text-xs font-poppins font-medium mb-1.5">
                Apellido *
              </label>
              <input
                type="text"
                name="surname"
                required
                value={formData.surname}
                onChange={handleChange}
                placeholder="Ej. Pérez"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/70 text-xs font-poppins font-medium mb-1.5">
                Tipo Doc.
              </label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins cursor-pointer"
              >
                <option value="DNI" className="bg-[#142612]">
                  DNI
                </option>
                <option value="PASSPORT" className="bg-[#142612]">
                  Pasaporte
                </option>
                <option value="CI" className="bg-[#142612]">
                  Cédula
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-white/70 text-xs font-poppins font-medium mb-1.5">
                Número de Documento *
              </label>
              <input
                type="text"
                name="documentNumber"
                required
                value={formData.documentNumber}
                onChange={handleChange}
                placeholder="Ej. 12345678"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
              />
            </div>
          </div>

          {/* Teléfono estandarizado */}
          <div>
            <label className="block text-white/70 text-xs font-poppins font-medium mb-1.5">
              Teléfono (opcional)
            </label>
            <PhoneInput
              value={formData.phone}
              onChange={handlePhoneChange}
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-[#28a745] hover:bg-[#218838] text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-green-950/20"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              )}
              Habilitar Técnico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
