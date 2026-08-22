"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  UserCheck,
  ShieldCheck,
  Clock,
  Eye,
  CheckCircle,
  FileText,
  Search,
  ExternalLink,
  Shield,
  X,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import {
  fetchTechnicians,
  approveTechnician,
  TechnicianDto,
} from "@/app/services/techniciansService";
import {
  getTechnicianIdentityOnChain,
  BlockchainIdentity,
} from "@/app/services/blockchainService";

export default function TecnicosPage() {
  const { token, ongUrl } = useAuth();
  const [technicians, setTechnicians] = useState<TechnicianDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTech, setSelectedTech] = useState<TechnicianDto | null>(null);
  const [onChainData, setOnChainData] = useState<BlockchainIdentity | null>(null);
  const [loadingChain, setLoadingChain] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    if (!token || !ongUrl) return;
    setLoading(true);
    const data = await fetchTechnicians(ongUrl, token);
    setTechnicians(data);
    setLoading(false);
  }, [token, ongUrl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectTech = async (tech: TechnicianDto) => {
    setSelectedTech(tech);
    setOnChainData(null);

    if (tech.certId) {
      setLoadingChain(true);
      const chainInfo = await getTechnicianIdentityOnChain(tech.certId);
      setOnChainData(chainInfo);
      setLoadingChain(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!token || !ongUrl) return;
    if (!confirm("¿Desea aprobar y verificar este técnico en la blockchain?")) return;

    try {
      await approveTechnician(ongUrl, token, id);
      loadData();
      if (selectedTech?.id === id) {
        setSelectedTech(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al aprobar técnico");
    }
  };

  const filtered = technicians.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.documentNumber.includes(searchQuery);
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-accent" /> Auditoría de Técnicos
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Audita las solicitudes, revisa la identidad biométrica e integraciones blockchain.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por DNI o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
          >
            <option value="ALL" className="bg-primary text-white">Todos los estados</option>
            <option value="PENDING_APPROVAL" className="bg-primary text-white">Pendientes</option>
            <option value="APPROVED" className="bg-primary text-white">Aprobados</option>
            <option value="VERIFIED" className="bg-primary text-white">Verificados</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-primary/50 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-white/50 text-xs font-bold uppercase tracking-wider">
              <th className="p-4 pl-6">Técnico</th>
              <th className="p-4">Documento</th>
              <th className="p-4">ONG Emisora</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right pr-6">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 pl-6 font-medium">
                  {t.name} {t.surname}
                </td>
                <td className="p-4 text-white/60">
                  {t.documentType} {t.documentNumber}
                </td>
                <td className="p-4 text-white/60">{t.issuerOng}</td>
                <td className="p-4">
                  {t.status === "PENDING_APPROVAL" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      <Clock size={12} /> Pendiente
                    </span>
                  )}
                  {t.status === "APPROVED" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <CheckCircle size={12} /> Aprobado
                    </span>
                  )}
                  {t.status === "VERIFIED" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
                      <ShieldCheck size={12} /> Verificado On-Chain
                    </span>
                  )}
                </td>
                <td className="p-4 text-right pr-6 space-x-2">
                  <button
                    onClick={() => handleSelectTech(t)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Auditar / Ver Detalle"
                  >
                    <Eye size={16} />
                  </button>
                  {t.status === "PENDING_APPROVAL" && (
                    <button
                      onClick={() => handleApprove(t.id)}
                      className="px-3 py-1.5 rounded-xl bg-accent text-primary text-xs font-bold hover:bg-accent/90 transition-all"
                    >
                      Aprobar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Auditoría / Detalle */}
      {selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-primary border border-white/10 rounded-3xl p-8 max-w-2xl w-full space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FileText className="text-accent" /> Ficha del Técnico
              </h3>
              <button
                onClick={() => setSelectedTech(null)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-white/40">Datos Personales</p>
                <p className="text-sm"><strong>Nombre:</strong> {selectedTech.name} {selectedTech.surname}</p>
                <p className="text-sm"><strong>Documento:</strong> {selectedTech.documentType} {selectedTech.documentNumber}</p>
                <p className="text-sm"><strong>Teléfono:</strong> {selectedTech.phone || "N/A"}</p>
                <p className="text-sm"><strong>ONG Emisora:</strong> {selectedTech.issuerOng}</p>
                <p className="text-sm"><strong>DID:</strong> <code className="text-xs bg-white/10 px-2 py-0.5 rounded">{selectedTech.did || "Pendiente"}</code></p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-white/40">Verificación Blockchain</p>
                {loadingChain ? (
                  <p className="text-xs text-white/60">Consultando blockchain...</p>
                ) : onChainData ? (
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-xs">
                    <p className="flex items-center gap-1.5 text-accent font-bold">
                      <ShieldCheck size={14} /> Registro On-Chain Confirmado
                    </p>
                    <p><strong>CID IPFS:</strong> {onChainData.cid}</p>
                    <p><strong>Commitment:</strong> {onChainData.identityCommitment?.slice(0, 16)}...</p>
                    <p><strong>Fecha Emisión:</strong> {onChainData.issuedAt ? new Date(onChainData.issuedAt * 1000).toLocaleString() : "N/A"}</p>
                  </div>
                ) : (
                  <p className="text-xs text-white/40 italic">No hay registro verificado en blockchain aún.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedTech(null)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5"
              >
                Cerrar
              </button>
              {selectedTech.status === "PENDING_APPROVAL" && (
                <button
                  onClick={() => handleApprove(selectedTech.id)}
                  className="px-5 py-2.5 rounded-xl bg-accent text-primary text-sm font-bold hover:bg-accent/90"
                >
                  Aprobar Técnico
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
