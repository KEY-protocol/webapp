"use client";

import { Smartphone, ShieldCheck, FileCheck, AlertCircle } from "lucide-react";
import IdentityFormSimulator from "@/app/components/mobile/IdentityFormSimulator";
import { useData } from "@/app/context/DataContext";
import { useAuth } from "@/app/context/AuthContext";

export default function MobileFormPreviewPage() {
  const { data } = useData();
  const { user } = useAuth();

  const userRole = (data?.currentUser?.role || user?.role || "").toLowerCase();
  const isEncargado = userRole === "encargado";

  if (isEncargado) {
    return (
      <div className="flex-1 p-8 bg-primary min-h-screen flex items-center justify-center">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white font-montserrat">
            Acceso Restringido
          </h2>
          <p className="text-white/60 text-sm font-poppins">
            Esta sección de vista previa del formulario móvil no está disponible para usuarios con rol Encargado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation back header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-[#28a745]" />
              <h1 className="text-3xl font-montserrat font-bold text-white">
                Formulario Mobile de Identidades y Evidencias
              </h1>
            </div>
            <p className="text-white/50 font-poppins text-sm pl-12">
              Inspecciona interactivamente el formulario de captación en territorio que llenan los técnicos en <strong>FieldApp-Mobile</strong>, incluyendo las preguntas de la Encuesta Inicial y los módulos de capturas biométricas.
            </p>
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
