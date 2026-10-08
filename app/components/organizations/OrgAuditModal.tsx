"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  History,
  Search,
  RefreshCw,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { OrganizationRecord } from "@/app/services/organizationsService";
import {
  AuditLogRecord,
  adminAuditService,
} from "@/app/services/adminAuditService";
import { Spinner } from "@/app/components/common/Spinner";
import { toast } from "react-toastify";

interface OrgAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationRecord;
}

export default function OrgAuditModal({
  isOpen,
  onClose,
  organization,
}: OrgAuditModalProps) {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionCategory, setActionCategory] = useState("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!organization) return;
    setIsLoading(true);
    try {
      const data = await adminAuditService.getOrganizationAudit(
        organization.slug || organization.id,
      );
      setLogs(data);
    } catch {
      toast.error("Error al cargar la auditoría de la organización");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen, organization?.id, organization?.slug]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchActor = log.actor?.toLowerCase().includes(q);
        const matchAction = log.action?.toLowerCase().includes(q);
        const matchNote =
          typeof log.metadata?.note === "string" &&
          log.metadata.note.toLowerCase().includes(q);
        if (!matchActor && !matchAction && !matchNote) return false;
      }

      if (actionCategory !== "all") {
        const act = (log.action || "").toUpperCase();
        if (actionCategory === "CREATE") {
          if (
            !act.includes("CREATE") &&
            !act.includes("BOOTSTRAP") &&
            !act.includes("SEED") &&
            !act.includes("REGISTER")
          ) {
            return false;
          }
        } else if (actionCategory === "UPDATE") {
          if (!act.includes("UPDATE") && !act.includes("STATUS")) {
            return false;
          }
        } else if (actionCategory === "DELETE") {
          if (!act.includes("DELETE") && !act.includes("REVOKE")) {
            return false;
          }
        } else if (actionCategory === "CONFIG") {
          if (
            !act.includes("CREDENTIAL") &&
            !act.includes("CONFIG") &&
            !act.includes("INFRA")
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [logs, search, actionCategory]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getActionBadgeColor = (action: string) => {
    const act = action.toUpperCase();
    if (
      act.includes("CREATE") ||
      act.includes("BOOTSTRAP") ||
      act.includes("SEED") ||
      act.includes("PUBLISH")
    ) {
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
    if (act.includes("UPDATE") || act.includes("STATUS") || act.includes("EDIT")) {
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    }
    if (act.includes("DELETE") || act.includes("REVOKE") || act.includes("SUSPEND")) {
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    }
    if (act.includes("CREDENTIAL") || act.includes("CONFIG") || act.includes("TEE")) {
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
    }
    return "bg-white/10 text-white/80 border-white/10";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-4xl bg-[#0c160a] border border-white/15 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#28a745]/15 border border-[#28a745]/30 flex items-center justify-center shrink-0 text-[#28a745]">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-montserrat font-bold text-white">
                  Auditoría de Organización
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  {organization.slug}
                </span>
                <span className="text-xs font-poppins text-white/40">
                  ({organization.name})
                </span>
              </div>
              <p className="text-xs font-poppins text-white/50 mt-1">
                Registro cronológico de movimientos, eventos de configuración y operaciones territoriales.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10 cursor-pointer disabled:opacity-50"
              title="Refrescar auditoría"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10 cursor-pointer"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar: Filters & Stats */}
        <div className="p-4 bg-white/[0.01] border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por acción, actor o nota..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-white text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
              />
            </div>

            <div className="relative">
              <select
                value={actionCategory}
                onChange={(e) => setActionCategory(e.target.value)}
                className="bg-[#142612] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-poppins focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all cursor-pointer"
              >
                <option value="all">Todas las categorías</option>
                <option value="CREATE">Creación y Altas</option>
                <option value="UPDATE">Actualizaciones y Estado</option>
                <option value="DELETE">Eliminaciones</option>
                <option value="CONFIG">Configuración y Credenciales</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs font-poppins text-white/50">
            <span>Eventos:</span>
            <span className="font-mono font-bold text-emerald-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {filteredLogs.length} de {logs.length}
            </span>
          </div>
        </div>

        {/* Body / Logs List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Spinner size="lg" />
              <p className="text-xs font-poppins text-white/50 animate-pulse">
                Cargando historial de auditoría de la organización...
              </p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-8">
              <AlertCircle className="w-10 h-10 text-white/20 mx-auto" />
              <p className="text-sm font-poppins text-white/50">
                No se registraron movimientos para los filtros seleccionados.
              </p>
              {logs.length === 0 && (
                <p className="text-xs font-poppins text-white/30 max-w-sm mx-auto">
                  Aún no hay operaciones registradas para esta organización en el sistema.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                const dateObj = new Date(log.timestamp);
                const formattedDate = dateObj.toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const formattedTime = dateObj.toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });

                return (
                  <div
                    key={log.id}
                    className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${getActionBadgeColor(
                            log.action,
                          )}`}
                        >
                          {log.action}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-white/60 font-mono">
                          <User className="w-3.5 h-3.5 text-white/40" />
                          <span>{log.actor || "Sistema"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-white/40 font-poppins shrink-0">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formattedDate}</span>
                          <span className="text-white/20">•</span>
                          <span>{formattedTime}</span>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedLogId(isExpanded ? null : log.id)
                          }
                          className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer bg-white/5 px-2 py-0.5 rounded border border-white/5"
                        >
                          <span>{isExpanded ? "Ocultar" : "Detalles"}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Quick note if available */}
                    {log.metadata?.note && (
                      <p className="text-xs font-poppins text-white/70 pl-1">
                        {String(log.metadata.note)}
                      </p>
                    )}

                    {/* Expanded JSON details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-2 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-white/40 font-montserrat">
                            Payload Metadata / Contexto
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(
                                JSON.stringify(log.metadata, null, 2),
                                log.id,
                              )
                            }
                            className="flex items-center gap-1 text-[10px] text-white/50 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedId === log.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar JSON</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="bg-black/60 p-3 rounded-xl text-[11px] font-mono text-emerald-300/90 overflow-x-auto border border-white/5 max-h-48">
                          {JSON.stringify(
                            log.metadata || { info: "Sin metadata adicional" },
                            null,
                            2,
                          )}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-poppins">
          <span>KEY Protocol Security & Audit Layer</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all cursor-pointer border border-white/10"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
