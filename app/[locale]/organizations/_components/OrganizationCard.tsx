"use client";

import React from "react";
import { Building2, ShieldCheck, UserPlus, HardHat, Users, UserCheck } from "lucide-react";
import { Organization } from "@/app/types/api";

interface OrganizationCardProps {
  org: Organization;
  onAddAdmin: (orgId: string) => void;
  onAddEncargado: (orgId: string) => void;
  onAddTecnico: (orgId: string) => void;
  onViewRole: (org: Organization, role: string) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export const OrganizationCard = ({
  org,
  onAddAdmin,
  onAddEncargado,
  onAddTecnico,
  onViewRole,
  t,
}: OrganizationCardProps) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
          <Building2 size={24} />
        </div>
        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
          ID: {org.id.split("_")[1]}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 font-montserrat">
        {org.name}
      </h3>

      <div className="space-y-4 flex-1">
        {/* Role Management Buttons */}
        <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-3">
          <p className="text-[10px] text-white/40 uppercase font-bold mb-1">
            {t("roleManagement")}
          </p>
          
          {/* Admins */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddAdmin(org.id)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-poppins font-medium group/btn"
              title={t("addAdmin")}
            >
              <ShieldCheck size={16} className="group-hover/btn:scale-110 transition-transform" />
              {t("addAdmin").split(" ").pop()}
            </button>
            <button
              onClick={() => onViewRole(org, "admin")}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-poppins font-medium"
            >
              <Users size={16} />
              {t("viewAdmins")}
            </button>
          </div>

          {/* Encargados */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddEncargado(org.id)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-poppins font-medium group/btn"
              title={t("addEncargado")}
            >
              <UserPlus size={16} className="group-hover/btn:scale-110 transition-transform" />
              {t("addEncargado").split(" ").pop()}
            </button>
            <button
              onClick={() => onViewRole(org, "encargado")}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-poppins font-medium"
            >
              <UserCheck size={16} />
              {t("viewEncargados")}
            </button>
          </div>

          {/* Technicians */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddTecnico(org.id)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all text-xs font-poppins font-medium group/btn"
              title={t("addTecnico")}
            >
              <HardHat size={16} className="group-hover/btn:scale-110 transition-transform" />
              {t("addTecnico").split(" ").pop()}
            </button>
            <button
              onClick={() => onViewRole(org, "tecnico")}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-poppins font-medium"
            >
              <Users size={16} />
              {t("viewTecnicos")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
