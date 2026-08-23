"use client";

import React, { useState, useEffect } from "react";
import { X, Database, Server, Cpu, Link as LinkIcon, ShieldCheck, Loader2 } from "lucide-react";
import {
  OrganizationRecord,
  organizationsService,
  UpdateOrgCredentialsPayload,
} from "@/app/services/organizationsService";
import { toast } from "react-toastify";

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationRecord;
  onSuccess: () => void;
}

export default function CredentialsModal({
  isOpen,
  onClose,
  organization,
  onSuccess,
}: CredentialsModalProps) {
  const [dbConnectionString, setDbConnectionString] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [phalaTeeUrl, setPhalaTeeUrl] = useState("");
  const [blockchainRpcUrl, setBlockchainRpcUrl] = useState("");
  const [maxTechniciansLimit, setMaxTechniciansLimit] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (organization?.config) {
      setDbConnectionString(organization.config.dbConnectionString || "");
      setApiBaseUrl(organization.config.apiBaseUrl || "");
      setPhalaTeeUrl(organization.config.phalaTeeUrl || "");
      setBlockchainRpcUrl(organization.config.blockchainRpcUrl || "");
      setMaxTechniciansLimit(organization.config.maxTechniciansLimit || 100);
    } else {
      setDbConnectionString("");
      setApiBaseUrl("");
      setPhalaTeeUrl("");
      setBlockchainRpcUrl("");
      setMaxTechniciansLimit(100);
    }
  }, [organization]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: UpdateOrgCredentialsPayload = {
        dbConnectionString,
        apiBaseUrl,
        blockchainRpcUrl,
        maxTechniciansLimit: Number(maxTechniciansLimit),
      };

      await organizationsService.updateCredentials(organization.id, payload);
      toast.success(`Credenciales de la ONG "${organization.name}" guardadas exitosamente`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al actualizar las credenciales de la ONG");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#142612] border border-white/15 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#28a745]/20 border border-[#28a745]/30 flex items-center justify-center text-[#28a745]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-montserrat text-xl font-bold text-white">
                Credenciales e Infraestructura
              </h2>
              <p className="text-xs text-white/50 font-poppins">
                Organización: <strong className="text-emerald-400">{organization.name}</strong> ({organization.slug})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner Informativo Multi-Tenant */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-xs text-white/80 font-poppins leading-relaxed">
            Cada organización cuenta con su propia base de datos PostgreSQL independiente y servidor de backend dedicado. Configura la cadena de conexión y servicios asociados a continuación.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DB Connection String */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Cadena de Conexión a Base de Datos (DATABASE_URL PostgreSQL)
            </label>
            <input
              type="text"
              value={dbConnectionString}
              onChange={(e) => setDbConnectionString(e.target.value)}
              placeholder="postgresql://usuario:password@host-ong.com:5432/key_db_ong"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745] font-mono"
            />
          </div>

          {/* API Base URL */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80 flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              URL del Servidor Dedicado
            </label>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              placeholder="https://api.ong.org/api"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745] font-mono"
            />
          </div>

          {/* Blockchain RPC & Tech Limit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/80 flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                RPC Blockchain Node URL
              </label>
              <input
                type="text"
                value={blockchainRpcUrl}
                onChange={(e) => setBlockchainRpcUrl(e.target.value)}
                placeholder="https://rpc.shibuya.astar.network"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745] font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/80">
                Límite Máximo de Técnicos
              </label>
              <input
                type="number"
                value={maxTechniciansLimit}
                onChange={(e) => setMaxTechniciansLimit(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-green-950/30 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Guardar Credenciales
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
