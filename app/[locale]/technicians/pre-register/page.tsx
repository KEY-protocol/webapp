"use client";

import React, { useState } from "react";
import { UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "react-toastify";
import apiClient from "@/app/lib/api-client";

import type { TechnicianSummary } from "@/app/types/technician";

export default function PreRegisterTechnicianPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    documentNumber: "",
    documentType: "DNI",
    phone: "",
    skills: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validar si el DNI ya está registrado en la plataforma
      const existingTechs = await apiClient.get<TechnicianSummary[]>("/technicians");
      const docNumClean = formData.documentNumber.trim().toLowerCase();
      const duplicate = existingTechs.data?.find(
        (tech: TechnicianSummary) => tech.documentNumber?.trim().toLowerCase() === docNumClean
      );

      if (duplicate) {
        const errorMsg = `Ya existe un técnico pre-registrado o registrado con el DNI/Documento "${formData.documentNumber}".`;
        setError(errorMsg);
        toast.warning(errorMsg);
        setIsLoading(false);
        return;
      }

      const skillsArray = formData.skills
        ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      await apiClient.post("/technicians/pre-register", {
        ...formData,
        skills: skillsArray,
      });

      setSuccess(true);
      toast.success("Técnico pre-registrado con éxito");
      setFormData({
        name: "",
        surname: "",
        documentNumber: "",
        documentType: "DNI",
        phone: "",
        skills: "",
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      const errorMsg = axiosErr.response?.data?.error || axiosErr.message || "Error al pre-registrar técnico";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Link */}
        <button
          onClick={() => router.push("/technicians")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-all text-sm font-poppins cursor-pointer mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Técnicos
        </button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-white flex items-center gap-3">
            <UserPlus className="w-8 h-8 text-[#28a745]" />
            Pre-registro de Técnico
          </h1>
          <p className="text-white/60 font-poppins text-sm mt-1">
            Carga los datos de los técnicos habilitados para que puedan iniciar su enrolamiento en la App Mobile. La IA comparará sus datos biométricos con estos registros.
          </p>
        </div>

        {/* Feedback Banners */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 text-green-300 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>Técnico pre-registrado con éxito. Ya se encuentra habilitado para enrolarse en la app móvil.</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
              >
                <option value="DNI" className="bg-[#1a2e1a]">DNI</option>
                <option value="PASSPORT" className="bg-[#1a2e1a]">Pasaporte</option>
                <option value="CI" className="bg-[#1a2e1a]">Cédula Identidad</option>
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

          <div>
            <label className="block text-white/70 text-xs font-poppins font-medium mb-1.5">
              Teléfono (opcional)
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej. +54 9 387 1234567"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
            />
          </div>

          <div>
            <label className="block text-white/70 text-xs font-poppins font-medium mb-1.5">
              Habilidades / Capacitaciones (separadas por coma)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Ej. Apicultura, Artesanía, Ganadería"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/technicians")}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-[#28a745] hover:bg-[#218838] text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              Habilitar Técnico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
