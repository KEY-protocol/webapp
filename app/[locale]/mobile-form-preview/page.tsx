"use client";

import React from "react";
import { Smartphone, ArrowLeft, ShieldCheck, FileCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import IdentityFormSimulator from "@/app/components/mobile/IdentityFormSimulator";

export default function MobileFormPreviewPage() {
  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation back header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/audit-identities"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Volver a Auditoría"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Smartphone className="w-8 h-8 text-[#28a745]" />
              <h1 className="text-3xl font-montserrat font-bold text-white">
                Formulario Mobile de Identidades y Evidencias
              </h1>
            </div>
            <p className="text-white/50 font-poppins text-sm pl-12">
              Inspecciona interactivamente el formulario de captación en territorio que llenan los técnicos en <strong>FieldApp-Mobile</strong>, incluyendo las preguntas de la Encuesta Inicial y los módulos de capturas biométricas.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/audit-identities"
              className="flex items-center gap-2 bg-[#28a745]/20 hover:bg-[#28a745]/30 text-[#28a745] border border-[#28a745]/40 px-4 py-2.5 rounded-xl font-semibold font-poppins text-sm transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Ver Identidades Auditadas
            </Link>
          </div>
        </div>

        {/* Informative banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-white font-bold text-xs font-montserrat">
                Encuesta Inicial v1.0.0
              </p>
              <p className="text-white/50 text-xs font-poppins">
                Contiene 17 campos estandarizados (datos personales, etnia, provincia, localidad y cadenas productivas).
              </p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-white font-bold text-xs font-montserrat">
                Validación en Phala TEE
              </p>
              <p className="text-white/50 text-xs font-poppins">
                Procesa en enclave seguro la selfie y el DNI frente/dorso para comprobación de autenticidad.
              </p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-white font-bold text-xs font-montserrat">
                Modo Offline Operativo
              </p>
              <p className="text-white/50 text-xs font-poppins">
                Los datos se capturan en territorio sin conexión y se sincronizan al detectar conectividad.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <IdentityFormSimulator />
      </div>
    </div>
  );
}
