"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Building2,
  Users,
  Activity,
  Calendar,
  FileText,
  Loader2,
  Lock,
  UserCheck,
} from "lucide-react";
import {
  AuditLogRecord,
  SuperadminStats,
  superadminAuditService,
} from "@/app/services/superadminAuditService";
import { organizationsService, OrganizationRecord } from "@/app/services/organizationsService";
import { toast } from "react-toastify";

export default function SuperadminAuditPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [stats, setStats] = useState<SuperadminStats>({
    totalOrgs: 0,
    activeOrgs: 0,
    totalAdmins: 0,
    totalTechnicians: 0,
    verifiedTechnicians: 0,
    totalAuditLogs: 0,
  });
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedOng, setSelectedOng] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [logsData, statsData, orgsData] = await Promise.all([
        superadminAuditService.getAuditLogs(),
        superadminAuditService.getSuperadminStats(),
        organizationsService.getOrganizations(),
      ]);

      setLogs(logsData);
      setStats(statsData);
      setOrganizations(orgsData);
    } catch {
      toast.error("Error al cargar los datos de auditoría global");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchActor = log.actor.toLowerCase().includes(q);
        const matchAction = log.action.toLowerCase().includes(q);
        if (!matchActor && !matchAction) return false;
      }
      if (selectedOng !== "all" && log.ongId !== selectedOng) {
        return false;
      }
      if (selectedAction !== "all" && !log.action.includes(selectedAction)) {
        return false;
      }
      return true;
    });
  }, [logs, search, selectedOng, selectedAction]);

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#28a745]" />
              <h1 className="text-3xl font-montserrat font-bold text-white">
                Auditoría Global de Actividades
              </h1>
            </div>
            <p className="text-white/50 font-poppins text-sm mt-1">
              Bitácora centralizada de eventos, accesos, cambios de credenciales de DB e infraestructura y operaciones de todas las organizaciones en la plataforma.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl font-semibold font-poppins transition-all text-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar Bitácora
            </button>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-2">
            <p className="text-white/40 text-xs font-poppins font-bold uppercase tracking-wider">
              Total Organizaciones
            </p>
            <p className="text-3xl font-montserrat font-bold text-white">
              {stats.totalOrgs}
            </p>
            <p className="text-emerald-400 text-xs font-poppins font-semibold">
              {stats.activeOrgs} activas con servicios dedicados
            </p>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-cyan-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Usuarios Administradores
            </p>
            <p className="text-3xl font-montserrat font-bold text-cyan-400">
              {stats.totalAdmins}
            </p>
            <p className="text-cyan-300/60 text-xs font-poppins">
              Admins de ONG operando
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-amber-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Técnicos Registrados
            </p>
            <p className="text-3xl font-montserrat font-bold text-amber-400">
              {stats.totalTechnicians}
            </p>
            <p className="text-amber-300/60 text-xs font-poppins">
              {stats.verifiedTechnicians} verificados con DID
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-emerald-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Eventos Auditados
            </p>
            <p className="text-3xl font-montserrat font-bold text-emerald-400">
              {stats.totalAuditLogs}
            </p>
            <p className="text-emerald-300/60 text-xs font-poppins">
              Registros inmutables en bitácora
            </p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por actor o acción auditada..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
            />
          </div>

          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <select
              value={selectedOng}
              onChange={(e) => setSelectedOng(e.target.value)}
              className="w-full bg-[#162713] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins cursor-pointer"
            >
              <option value="all">Todas las Organizaciones (Masivo)</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.slug}>
                  {org.name} ({org.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full bg-[#162713] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins cursor-pointer"
            >
              <option value="all">Todos los tipos de evento</option>
              <option value="SUPERADMIN">Acciones Superadmin</option>
              <option value="CREATE">Creación de Recursos</option>
              <option value="UPDATE">Modificaciones</option>
              <option value="SEED">Bootstrap / Seeds</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        {isLoading ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-[#28a745] animate-spin" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/15 rounded-2xl p-16 text-center">
            <p className="text-white/40 font-poppins text-base">
              No se registraron eventos de auditoría para los criterios seleccionados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#28a745]/15 border border-[#28a745]/30 flex items-center justify-center shrink-0 text-[#28a745]">
                      <Activity className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-white font-mono font-bold text-sm bg-white/5 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                        {log.ongId && (
                          <span className="text-emerald-400 font-semibold text-xs font-poppins flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" /> ONG: {log.ongId}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-white/50 font-poppins flex-wrap">
                        <span className="text-cyan-300">Ejecutado por: {log.actor}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {log.metadata && (
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-[11px] font-mono text-white/70 max-w-md overflow-x-auto shrink-0">
                      {JSON.stringify(log.metadata)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
