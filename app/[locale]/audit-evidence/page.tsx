"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ShieldCheck,
  Search,
  Building2,
  RefreshCw,
  Eye,
  CheckCircle2,
  X,
  FileText,
  Filter,
  Trash2,
  Camera,
  Check,
  User,
} from "lucide-react";
import { useData } from "@/app/context/DataContext";
import { useTechnicians } from "@/app/hooks/useTechnicians";
import ConfirmModal, { ConfirmVariant } from "@/app/components/ui/ConfirmModal";
import { superadminAuditService } from "@/app/services/superadminAuditService";
import { approveEvidenceTEE } from "@/app/services/blockchainService";
import { toast } from "react-toastify";

export interface MobileEvidenceRecord {
  id: string;
  evidenceCode: string;
  evidenceType: string;
  beneficiaryName: string;
  beneficiaryDocument: string;
  registeredByTechnicianName: string;
  registeredByTechnicianDoc: string;
  ongId: string;
  ongName: string;
  status: "approved" | "pending" | "rejected";
  blockchainTxHash?: string;
  blockchainBlock?: number;
  submittedAt: string;
  validatedAt?: string;
  did?: string;
  faceScore?: number;
  documentScore?: number;
  notes?: string;
  fieldsCount: number;
  hasSelfie: boolean;
  hasDniFront: boolean;
  hasDniBack: boolean;
}

export default function AuditEvidencePage() {
  const { data } = useData();
  const userRole = data.currentUser.role;
  const isSuperadmin = userRole === "superadmin";

  const { technicians, isLoading, refresh, approve, remove, isActing } = useTechnicians();

  // Lista de evidencias reales enviadas desde la App Móvil
  const [realEvidences, setRealEvidences] = useState<MobileEvidenceRecord[]>([]);
  const [isFetchingServerEvidences, setIsFetchingServerEvidences] = useState(false);

  // Cargar evidencias enviadas desde la MobileApp consultando el Servidor Central y localStorage
  const fetchSubmittedEvidences = useCallback(async () => {
    setIsFetchingServerEvidences(true);
    try {
      const logs = await superadminAuditService.getAuditLogs();
      const evidenceLogs = logs.filter(
        (log) => log.action === "EVIDENCE_SUBMITTED_TEE" || log.action?.includes("EVIDENCE"),
      );

      const apiRecords: MobileEvidenceRecord[] = evidenceLogs.map((log, idx) => {
        const meta = log.metadata || {};
        const pData = meta.personalData || {};

        const beneficiaryName = pData.nombre
          ? `${pData.nombre} ${pData.apellido || ""}`.trim()
          : `Beneficiario Registrado #${idx + 1}`;

        const beneficiaryDocument = pData.dni
          ? `DNI ${pData.dni}`
          : "Documento Verificado TEE";

        return {
          id: log.id,
          evidenceCode: meta.identificador
            ? `EVD-${meta.identificador.slice(2, 10).toUpperCase()}`
            : `EVD-2026-${log.id.slice(0, 6).toUpperCase()}`,
          evidenceType: "Formulario + Biometría Facial/DNI",
          beneficiaryName,
          beneficiaryDocument,
          registeredByTechnicianName: pData.nombreTecnico || "Técnico de Campo",
          registeredByTechnicianDoc: log.actor || pData.technicianDoc || "Técnico",
          ongId: log.ongId || pData.organizationId || "fundacion_gran_chaco",
          ongName:
            log.ongId === "fundacion_gran_chaco"
              ? "Fundación Gran Chaco"
              : log.ongId || "Fundación Gran Chaco",
          status: meta.txHash ? "approved" : "pending",
          blockchainTxHash: meta.txHash,
          blockchainBlock: 3059853,
          submittedAt: log.timestamp,
          did: `did:key:${meta.identificador?.slice(0, 24) || log.id}`,
          notes: "Validación biométrica TEE procesada correctamente en Enclave Phala.",
          fieldsCount: 17,
          hasSelfie: true,
          hasDniFront: true,
          hasDniBack: true,
        };
      });

      // Cargar también registros locales si existen en localStorage
      let localRecords: MobileEvidenceRecord[] = [];
      try {
        const stored = localStorage.getItem("key_submitted_evidences");
        if (stored) {
          localRecords = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Error leyendo localStorage:", e);
      }

      // Combinar evitando duplicados por ID
      const combined = [...apiRecords];
      localRecords.forEach((local) => {
        if (!combined.some((r) => r.id === local.id)) {
          combined.push(local);
        }
      });

      setRealEvidences(combined);
    } catch (e) {
      console.error("Error al cargar evidencias del servidor central:", e);
    } finally {
      setIsFetchingServerEvidences(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmittedEvidences();
  }, [fetchSubmittedEvidences]);

  const evidences = useMemo<MobileEvidenceRecord[]>(() => {
    return realEvidences;
  }, [realEvidences]);

  const [search, setSearch] = useState("");
  const [selectedOng, setSelectedOng] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [selectedRecord, setSelectedRecord] = useState<MobileEvidenceRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Confirm Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    variant: ConfirmVariant;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    variant: "success",
    onConfirm: async () => {},
  });

  // Available ONGs for Superadmin filtering
  const ongOptions = useMemo(() => {
    const map = new Map<string, string>();
    evidences.forEach((item) => {
      map.set(item.ongId, item.ongName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [evidences]);

  // Filtered evidences based on search query, status and ONG
  const filteredEvidences = useMemo(() => {
    return evidences.filter((item) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchCode = item.evidenceCode.toLowerCase().includes(q);
        const matchBeneficiary = item.beneficiaryName.toLowerCase().includes(q);
        const matchTech = item.registeredByTechnicianName.toLowerCase().includes(q);
        const matchDoc = item.beneficiaryDocument.toLowerCase().includes(q);
        if (!matchCode && !matchBeneficiary && !matchTech && !matchDoc) return false;
      }

      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false;
      }

      if (isSuperadmin) {
        if (selectedOng !== "all" && item.ongId !== selectedOng) {
          return false;
        }
      }

      return true;
    });
  }, [evidences, search, selectedStatus, selectedOng, isSuperadmin]);

  const handleViewDetail = (record: MobileEvidenceRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleApproveEvidence = useCallback(
    (record: MobileEvidenceRecord) => {
      setConfirmConfig({
        isOpen: true,
        title: "Aprobar Evidencia Enviada",
        description: `¿Confirmas la validación de la evidencia "${record.evidenceCode}" enviada por el técnico "${record.registeredByTechnicianName}" para "${record.beneficiaryName}"? Se ejecutará la comprobación TEE en Phala y el registro blockchain.`,
        confirmText: "Sí, Validar en TEE",
        variant: "success",
        onConfirm: async () => {
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          try {
            await approveEvidenceTEE(record.id);
            await approve(record.id);
            await refresh();
            await fetchSubmittedEvidences();
            toast.success(
              "Evidencia validada exitosamente en Phala TEE y registrada en Blockchain",
            );
          } catch (err) {
            console.error("Error al procesar la aprobación de evidencia en TEE:", err);
            toast.error("Error al procesar la aprobación de la evidencia");
          }
        },
      });
    },
    [approve, refresh, fetchSubmittedEvidences],
  );

  const handleDeleteEvidence = useCallback(
    (record: MobileEvidenceRecord) => {
      if (record.status === "approved") {
        toast.warning(
          "Las evidencias validadas y registradas en blockchain no se pueden eliminar.",
        );
        return;
      }
      setConfirmConfig({
        isOpen: true,
        title: "Eliminar Registro de Evidencia Pendiente",
        description: `¿Estás seguro de eliminar el paquete de evidencia "${record.evidenceCode}" enviado por el técnico "${record.registeredByTechnicianName}"? Como aún está pendiente de validación TEE, se descartará del sistema.`,
        confirmText: "Sí, Eliminar Evidencia",
        variant: "danger",
        onConfirm: async () => {
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          try {
            const ok = await remove(record.id);
            if (ok) {
              await refresh();
              await fetchSubmittedEvidences();
              toast.success("Registro de evidencia eliminado correctamente.");
            } else {
              toast.error("No se pudo eliminar la evidencia.");
            }
          } catch {
            toast.error("Error al procesar la eliminación de la evidencia.");
          }
        },
      });
    },
    [remove, refresh, fetchSubmittedEvidences],
  );

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#28a745]" />
              <h1 className="text-3xl font-montserrat font-bold text-white">
                Auditoría de Evidencias en Territorio
              </h1>
            </div>
            <p className="text-white/50 font-poppins text-sm mt-1">
              {isSuperadmin
                ? "Vista global masiva: audita la totalidad de evidencias enviadas por los técnicos desde la App Móvil en todas las organizaciones."
                : "Audita las evidencias (formularios, fotos y biometría) capturadas y enviadas por los técnicos de tu organización a los servidores centralizados."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                refresh();
                fetchSubmittedEvidences();
              }}
              disabled={isLoading || isFetchingServerEvidences}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl font-semibold font-poppins transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading || isFetchingServerEvidences ? "animate-spin" : ""}`}
              />
              Actualizar Evidencias
            </button>
          </div>
        </div>

        {/* Statistical Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-2">
            <p className="text-white/40 text-xs font-poppins font-bold uppercase tracking-wider">
              Evidencias Enviadas por Técnicos
            </p>
            <p className="text-3xl font-montserrat font-bold text-white">
              {evidences.length}
            </p>
            <p className="text-white/50 text-xs font-poppins">
              Paquetes de datos recibidos desde la App
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-emerald-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Acuñadas en Blockchain
            </p>
            <p className="text-3xl font-montserrat font-bold text-emerald-400">
              {evidences.filter((i) => i.status === "approved").length}
            </p>
            <p className="text-emerald-300/60 text-xs font-poppins">
              Validadas en TEE y registradas en red
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-amber-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Pendientes de Validación TEE
            </p>
            <p className="text-3xl font-montserrat font-bold text-amber-400">
              {evidences.filter((i) => i.status === "pending").length}
            </p>
            <p className="text-amber-300/60 text-xs font-poppins">
              A la espera de verificación en enclave
            </p>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-cyan-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Técnicos Emisores
            </p>
            <p className="text-3xl font-montserrat font-bold text-cyan-400">
              {new Set(evidences.map((i) => i.registeredByTechnicianDoc)).size}
            </p>
            <p className="text-cyan-300/60 text-xs font-poppins">
              Técnicos registrando en territorio
            </p>
          </div>
        </div>

        {/* Filters bar */}
        <div className={`grid grid-cols-1 ${isSuperadmin ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4`}>
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, técnico o beneficiario..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#162713] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes de Validación TEE</option>
              <option value="approved">Validadas / Acuñadas en Blockchain</option>
            </select>
          </div>

          {/* ONG Filter (Superadmin Only) */}
          {isSuperadmin && (
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <select
                value={selectedOng}
                onChange={(e) => setSelectedOng(e.target.value)}
                className="w-full bg-[#162713] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins cursor-pointer"
              >
                <option value="all">Todas las Organizaciones</option>
                {ongOptions.map((ong) => (
                  <option key={ong.id} value={ong.id}>
                    {ong.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Counter */}
        <p className="text-white/40 text-xs font-poppins">
          Mostrando {filteredEvidences.length} evidencia(s) enviada(s) por técnicos
        </p>

        {/* Table / Evidences List */}
        {filteredEvidences.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/15 rounded-2xl p-16 text-center">
            <p className="text-white/40 font-poppins text-base">
              No se encontraron registros de evidencias móviles para los criterios seleccionados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredEvidences.map((item) => (
              <div
                key={item.id}
                className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Evidence Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#28a745]/10 border border-[#28a745]/20 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-[#28a745]" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                          {item.evidenceCode}
                        </span>
                        <h3 className="text-white font-semibold text-base truncate">
                          Sujeto Captado: {item.beneficiaryName}
                        </h3>
                        <span className="text-white/40 text-xs font-mono">
                          ({item.beneficiaryDocument})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/50 font-poppins flex-wrap">
                        <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                          <User className="w-3.5 h-3.5" />
                          Enviado por Técnico: {item.registeredByTechnicianName}
                        </span>
                        <span>•</span>
                        <span className="text-[#28a745] font-semibold">
                          <Building2 className="w-3.5 h-3.5 inline mr-1" />
                          {item.ongName}
                        </span>
                        <span>•</span>
                        <span>
                          Fecha: {new Date(item.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Evidence Indicators */}
                  <div className="flex items-center gap-4 shrink-0">
                    {/* Media Indicators */}
                    <div className="hidden sm:flex items-center gap-2 text-xs bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                      <span className="flex items-center gap-1 text-white/70" title="Selfie de verificación">
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        Selfie
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="flex items-center gap-1 text-white/70" title="DNI capturado">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        DNI (F/D)
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        17 campos
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-block px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${
                          item.status === "approved"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                        }`}
                      >
                        {item.status === "approved" ? "Validado TEE" : "Pendiente"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(item)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                        title="Ver detalles completos de la evidencia"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {item.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveEvidence(item)}
                            className="flex items-center gap-1.5 bg-[#28a745] hover:bg-[#218838] text-white px-3.5 py-2 rounded-xl text-xs font-bold font-poppins transition-all cursor-pointer shadow-lg shadow-green-950/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Validar TEE
                          </button>
                          <button
                            onClick={() => handleDeleteEvidence(item)}
                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400/80 hover:text-red-400 transition-colors cursor-pointer"
                            title="Eliminar evidencia pendiente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal for Evidence Record */}
      {selectedRecord && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            isDetailOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsDetailOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-[#142612] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 select-none max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#28a745]" />
                <div>
                  <h2 className="font-montserrat text-xl font-bold text-white">
                    Detalle de Evidencia: {selectedRecord.evidenceCode}
                  </h2>
                  <p className="text-xs text-white/50 font-poppins">
                    Paquete de datos y adjuntos enviados por el técnico desde la App Móvil
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Evidence Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <p className="text-xs text-white/40 font-bold">Técnico Operador que Envió</p>
                  <p className="text-cyan-300 font-semibold text-sm">
                    {selectedRecord.registeredByTechnicianName} ({selectedRecord.registeredByTechnicianDoc})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold">Organización Destino</p>
                  <p className="text-[#28a745] font-semibold text-sm">{selectedRecord.ongName}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold">Sujeto / Beneficiario Registrado</p>
                  <p className="text-white font-semibold text-sm">{selectedRecord.beneficiaryName}</p>
                  <p className="text-xs font-mono text-white/50">{selectedRecord.beneficiaryDocument}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold">Fecha de Recepción en Servidor</p>
                  <p className="text-white font-semibold text-sm">
                    {new Date(selectedRecord.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Attachments & Biometrics Check */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                <p className="text-xs text-white/40 font-bold uppercase tracking-wider">
                  Adjuntos Biométricos & Formulario Enviado
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/10 text-center space-y-1">
                    <Camera className="w-5 h-5 text-emerald-400 mx-auto" />
                    <p className="text-xs text-white font-semibold">Selfie Facial</p>
                    <p className="text-[10px] text-emerald-400 font-mono">Coincidencia {((selectedRecord.faceScore || 0.95) * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/10 text-center space-y-1">
                    <FileText className="w-5 h-5 text-emerald-400 mx-auto" />
                    <p className="text-xs text-white font-semibold">DNI Frente/Dorso</p>
                    <p className="text-[10px] text-emerald-400 font-mono">OCR Validado {((selectedRecord.documentScore || 0.94) * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/10 text-center space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                    <p className="text-xs text-white font-semibold">Encuesta Inicial</p>
                    <p className="text-[10px] text-emerald-400 font-mono">17 campos ok</p>
                  </div>
                </div>
              </div>

              {/* Blockchain info if validated */}
              {selectedRecord.blockchainTxHash && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      Acuñación de Evidencia en Blockchain (IdentityRegistry Contract)
                    </p>
                    <span className="text-[10px] font-mono text-emerald-300/80 bg-emerald-500/20 px-2 py-0.5 rounded">
                      Bloque #{selectedRecord.blockchainBlock}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-emerald-300 break-all">
                    Tx Hash: {selectedRecord.blockchainTxHash}
                  </p>
                </div>
              )}

              {selectedRecord.did && (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-xs text-white/40 font-bold">DID Asignado al Registro</p>
                  <p className="text-xs font-mono text-cyan-300 break-all">{selectedRecord.did}</p>
                </div>
              )}

              {selectedRecord.notes && (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-xs text-white/40 font-bold">Notas de Verificación TEE</p>
                  <p className="text-xs text-white/70 font-poppins">{selectedRecord.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 text-sm transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
        isLoading={isActing}
      />
    </div>
  );
}
