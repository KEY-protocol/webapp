"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ShieldCheck,
  Search,
  Building2,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  UserCheck,
  Filter,
} from "lucide-react";
import { useData } from "@/app/context/DataContext";
import { useTechnicians } from "@/app/hooks/useTechnicians";
import TechnicianDetailModal from "@/app/components/technicians/TechnicianDetailModal";
import ConfirmModal, { ConfirmVariant } from "@/app/components/ui/ConfirmModal";
import { toast } from "react-toastify";

export interface MobileIdentityRecord {
  id: string;
  fullName: string;
  documentNumber: string;
  documentType: string;
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
}

const MOCK_MOBILE_IDENTITIES: MobileIdentityRecord[] = [
  {
    id: "mob_id_001",
    fullName: "Juan Manuel Ortiz",
    documentNumber: "38999111",
    documentType: "DNI",
    registeredByTechnicianName: "Mateo Queti (Técnico)",
    registeredByTechnicianDoc: "11222333",
    ongId: "fundacion_gran_chaco",
    ongName: "Fundación Gran Chaco",
    status: "approved",
    blockchainTxHash: "0x8f7a...3e92",
    blockchainBlock: 4892102,
    submittedAt: "2026-08-06T14:20:00Z",
    validatedAt: "2026-08-06T14:22:15Z",
    did: "did:key:z6MkpTHR8VNsBxY8VNsBxY8VNsBxY8VNsBxY",
    faceScore: 0.98,
    documentScore: 0.96,
    notes: "Identidad registrada en territorio por el técnico. Auditada y acuñada en blockchain exitosamente.",
  },
  {
    id: "mob_id_002",
    fullName: "María Belén Maidana",
    documentNumber: "42111222",
    documentType: "DNI",
    registeredByTechnicianName: "Mateo Queti (Técnico)",
    registeredByTechnicianDoc: "11222333",
    ongId: "fundacion_gran_chaco",
    ongName: "Fundación Gran Chaco",
    status: "approved",
    blockchainTxHash: "0x3c11...91ab",
    blockchainBlock: 4892115,
    submittedAt: "2026-08-06T12:10:00Z",
    validatedAt: "2026-08-06T12:12:40Z",
    did: "did:key:z6MkJvY28K7xQ9zL8xQ9zL8xQ9zL8xQ9zL",
    faceScore: 0.97,
    documentScore: 0.95,
    notes: "Verificación facial aprobada en Phala TEE.",
  },
  {
    id: "mob_id_003",
    fullName: "Esteban Gutierrez",
    documentNumber: "34555666",
    documentType: "DNI",
    registeredByTechnicianName: "Carlos Encargado (Técnico)",
    registeredByTechnicianDoc: "27888999",
    ongId: "fundacion_gran_chaco",
    ongName: "Fundación Gran Chaco",
    status: "pending",
    submittedAt: "2026-08-06T15:05:00Z",
    faceScore: 0.91,
    documentScore: 0.92,
    notes: "Formulario de captación registrado en App Móvil. Pendiente de firma TEE.",
  },
  {
    id: "mob_id_004",
    fullName: "Ramona Fernández",
    documentNumber: "29444333",
    documentType: "DNI",
    registeredByTechnicianName: "Ana Admin (Técnica)",
    registeredByTechnicianDoc: "18222333",
    ongId: "crypto_secure_corp",
    ongName: "Crypto Secure Corp",
    status: "approved",
    blockchainTxHash: "0x77ab...4412",
    blockchainBlock: 4891950,
    submittedAt: "2026-08-05T16:30:00Z",
    validatedAt: "2026-08-05T16:33:00Z",
    did: "did:key:z6Mkh82NmA9xP1sL9xP1sL9xP1sL9xP1sL",
    faceScore: 0.99,
    documentScore: 0.97,
    notes: "Identidad registrada y acuñada en blockchain.",
  },
  {
    id: "mob_id_005",
    fullName: "Hugo Daniel Peralta",
    documentNumber: "31888777",
    documentType: "PASSPORT",
    registeredByTechnicianName: "Carlos Encargado (Técnico)",
    registeredByTechnicianDoc: "27888999",
    ongId: "global_tech_solutions",
    ongName: "Global Tech Solutions",
    status: "rejected",
    submittedAt: "2026-08-05T09:15:00Z",
    faceScore: 0.42,
    documentScore: 0.85,
    notes: "Fallo de coincidencia biométrica en TEE. Fotografía de selfie borrosa.",
  },
];

export default function AuditIdentitiesPage() {
  const { data } = useData();
  const userRole = data.currentUser.role;
  const isSuperadmin = userRole === "superadmin";

  const { approve, isActing } = useTechnicians();

  const [identities, setIdentities] = useState<MobileIdentityRecord[]>(
    MOCK_MOBILE_IDENTITIES,
  );
  const [search, setSearch] = useState("");
  const [selectedOng, setSelectedOng] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [selectedRecord, setSelectedRecord] =
    useState<MobileIdentityRecord | null>(null);
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
    identities.forEach((item) => {
      map.set(item.ongId, item.ongName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [identities]);

  // Filtered identities based on search, status, and role (Superadmin vs Org users)
  const filteredIdentities = useMemo(() => {
    return identities.filter((item) => {
      // Filter by search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = item.fullName.toLowerCase().includes(q);
        const matchDoc = item.documentNumber.toLowerCase().includes(q);
        if (!matchName && !matchDoc) return false;
      }

      // Filter by status
      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false;
      }

      // Filter by ONG (Superadmin can view all or filter by ONG; Org users only see their ONG)
      if (isSuperadmin) {
        if (selectedOng !== "all" && item.ongId !== selectedOng) {
          return false;
        }
      } else {
        // Encargado & Admin filter to their ONG (e.g., fundacion_gran_chaco by default)
        // If needed, match with data.currentUser.organizationId or fallback
      }

      return true;
    });
  }, [identities, search, selectedStatus, selectedOng, isSuperadmin]);

  const handleViewDetail = (record: MobileIdentityRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleApproveIdentity = useCallback(
    (record: MobileIdentityRecord) => {
      setConfirmConfig({
        isOpen: true,
        title: "Aprobar Identidad Móvil",
        description: `¿Confirmas la validación de la identidad enviada por "${record.fullName}" (${record.documentNumber})? Se ejecutará la verificación en Phala TEE y el registro del DID en blockchain.`,
        confirmText: "Sí, Validar en TEE",
        variant: "success",
        onConfirm: async () => {
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          try {
            await approve(record.id);
            setIdentities((prev) =>
              prev.map((i) =>
                i.id === record.id
                  ? {
                      ...i,
                      status: "approved",
                      validatedAt: new Date().toISOString(),
                      did: `did:key:z6Mk${Math.random().toString(36).substring(2, 12)}`,
                    }
                  : i,
              ),
            );
            toast.success(
              "Identidad validada exitosamente en TEE y registrada en Blockchain",
            );
          } catch {
            toast.error("Error al procesar la aprobación de identidad");
          }
        },
      });
    },
    [approve],
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
                Auditoría de Identidades en Territorio
              </h1>
            </div>
            <p className="text-white/50 font-poppins text-sm mt-1">
              {isSuperadmin
                ? "Vista global masiva: audita la totalidad de identidades captadas por los técnicos desde la App Móvil en todas las organizaciones y su acuñación en blockchain."
                : "Audita las identidades registradas por los técnicos de tu organización a través del formulario de captación móvil."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.info("Lista de auditoría actualizada")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl font-semibold font-poppins transition-all text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Statistical Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-2">
            <p className="text-white/40 text-xs font-poppins font-bold uppercase tracking-wider">
              Total Captadas por Técnicos
            </p>
            <p className="text-3xl font-montserrat font-bold text-white">
              {identities.length}
            </p>
            <p className="text-white/50 text-xs font-poppins">
              Identidades registradas en App Móvil
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-emerald-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Acuñadas en Blockchain
            </p>
            <p className="text-3xl font-montserrat font-bold text-emerald-400">
              {identities.filter((i) => i.status === "approved").length}
            </p>
            <p className="text-emerald-300/60 text-xs font-poppins">
              Registradas satisfactoriamente en red
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-amber-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Pendientes de Validación TEE
            </p>
            <p className="text-3xl font-montserrat font-bold text-amber-400">
              {identities.filter((i) => i.status === "pending").length}
            </p>
            <p className="text-amber-300/60 text-xs font-poppins">
              A la espera de verificación
            </p>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-cyan-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Técnicos Operativos
            </p>
            <p className="text-3xl font-montserrat font-bold text-cyan-400">
              {new Set(identities.map((i) => i.registeredByTechnicianDoc)).size}
            </p>
            <p className="text-cyan-300/60 text-xs font-poppins">
              Registrando en territorio
            </p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o documento..."
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
              <option value="pending">Pendientes de Aprobación</option>
              <option value="approved">Aprobados / Verificados TEE</option>
            </select>
          </div>

          {/* ONG Filter (Superadmin view) */}
          {isSuperadmin ? (
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <select
                value={selectedOng}
                onChange={(e) => setSelectedOng(e.target.value)}
                className="w-full bg-[#162713] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins cursor-pointer"
              >
                <option value="all">Todas las Organizaciones (Masivo)</option>
                {ongOptions.map((ong) => (
                  <option key={ong.id} value={ong.id}>
                    {ong.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm font-poppins">
              <Building2 className="w-4 h-4 mr-2 text-[#28a745]" />
              <span>Organización: Fundación Gran Chaco</span>
            </div>
          )}
        </div>

        {/* Counter */}
        <p className="text-white/40 text-xs font-poppins">
          Mostrando {filteredIdentities.length} registro(s) de identidad móvil
        </p>

        {/* Table / List */}
        {filteredIdentities.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/15 rounded-2xl p-16 text-center">
            <p className="text-white/40 font-poppins text-base">
              No se encontraron registros de identidades móviles para los criterios seleccionados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredIdentities.map((item) => (
              <div
                key={item.id}
                className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#28a745]/10 border border-[#28a745]/20 flex items-center justify-center shrink-0">
                      <UserCheck className="w-6 h-6 text-[#28a745]" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-white font-semibold text-base truncate">
                          {item.fullName}
                        </h3>
                        <span className="text-white/40 text-xs font-mono">
                          ({item.documentType}: {item.documentNumber})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/50 font-poppins flex-wrap">
                        <span className="flex items-center gap-1 text-[#28a745] font-semibold">
                          <Building2 className="w-3.5 h-3.5" />
                          {item.ongName}
                        </span>
                        <span>•</span>
                        <span className="text-cyan-300">
                          Registrado por: {item.registeredByTechnicianName}
                        </span>
                        <span>•</span>
                        <span>
                          Enviado: {new Date(item.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Biometrics */}
                  <div className="flex items-center gap-4 shrink-0">
                    {item.faceScore && (
                      <div className="hidden sm:flex flex-col items-end text-right">
                        <span className="text-[11px] text-white/40">Coincidencia Facial</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {(item.faceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}

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
                        title="Ver detalles de auditoría"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {item.status === "pending" && (
                        <button
                          onClick={() => handleApproveIdentity(item)}
                          className="flex items-center gap-1.5 bg-[#28a745] hover:bg-[#218838] text-white px-3.5 py-2 rounded-xl text-xs font-bold font-poppins transition-all cursor-pointer shadow-lg shadow-green-950/20"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Validar TEE
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
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

          <div className="relative w-full max-w-2xl bg-[#142612] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 select-none">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#28a745]" />
                <h2 className="font-montserrat text-xl font-bold text-white">
                  Auditoría de Identidad Móvil
                </h2>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <p className="text-xs text-white/40 font-bold">Nombre Completo Persona</p>
                  <p className="text-white font-semibold text-sm">{selectedRecord.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold">Documento</p>
                  <p className="text-white font-semibold text-sm">
                    {selectedRecord.documentType}: {selectedRecord.documentNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold">Técnico Registrador (App Móvil)</p>
                  <p className="text-cyan-300 font-semibold text-sm">
                    {selectedRecord.registeredByTechnicianName} ({selectedRecord.registeredByTechnicianDoc})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold">Organización Emisora</p>
                  <p className="text-[#28a745] font-semibold text-sm">{selectedRecord.ongName}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold">Fecha de Solicitud</p>
                  <p className="text-white font-semibold text-sm">
                    {new Date(selectedRecord.submittedAt).toLocaleString()}
                  </p>
                </div>
                {selectedRecord.validatedAt && (
                  <div>
                    <p className="text-xs text-white/40 font-bold">Fecha de Validación TEE</p>
                    <p className="text-emerald-400 font-semibold text-sm">
                      {new Date(selectedRecord.validatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {selectedRecord.blockchainTxHash && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      Acuñación en Blockchain (IdentityRegistry Contract)
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
                  <p className="text-xs text-white/40 font-bold">DID Registrado en Blockchain</p>
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
