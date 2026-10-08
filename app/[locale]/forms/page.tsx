"use client";

import React from "react";
import {
  Smartphone,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import IdentityFormSimulator from "@/app/components/mobile/IdentityFormSimulator";
import { useAuth } from "@/app/context/AuthContext";

export default function FormsPage() {
  const { user } = useAuth();
  const currentOrg = user?.ongId || "Tu Organización";

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#28a745]/20 border border-[#28a745]/30 flex items-center justify-center text-[#28a745] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-montserrat font-bold text-white tracking-tight">
                Gestión de Formularios de la Organización
              </h1>
            </div>
            <p className="text-white/60 font-poppins text-sm pl-13 max-w-3xl">
              Diseña, versiona y publica los campos de captura en territorio que utilizan los técnicos en{" "}
              <strong className="text-white">FieldApp-Mobile</strong>. Las versiones activadas se sincronizan
              automáticamente con tu organización.
            </p>
          </div>

          {/* Org Pill Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-montserrat font-bold">
                Organización Activa
              </p>
              <p className="text-xs text-white font-mono font-bold text-emerald-400">
                {currentOrg}
              </p>
            </div>
          </div>
        </div>

        {/* Feature & Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-start gap-3.5 hover:border-emerald-500/30 transition-all">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-bold text-sm font-montserrat">
                Control y Versionado Propio
              </p>
              <p className="text-white/50 text-xs font-poppins mt-1">
                Publica nuevas versiones con SemVer, añade campos personalizados y selecciona cuál versión está activa en BD.
              </p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-start gap-3.5 hover:border-cyan-500/30 transition-all">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-bold text-sm font-montserrat">
                Aislamiento Multi-Tenant
              </p>
              <p className="text-white/50 text-xs font-poppins mt-1">
                Las modificaciones solo afectan a tu organización ({currentOrg}) y están protegidas contra accesos externos.
              </p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-start gap-3.5 hover:border-amber-500/30 transition-all">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-bold text-sm font-montserrat">
                Despliegue Móvil Inmediato
              </p>
              <p className="text-white/50 text-xs font-poppins mt-1">
                La app móvil descarga la versión activa de tu organización al iniciar sesión y almacena en caché para territorio offline.
              </p>
            </div>
          </div>
        </div>

        {/* Simulator & Management Component */}
        <IdentityFormSimulator />
      </div>
    </div>
  );
}
