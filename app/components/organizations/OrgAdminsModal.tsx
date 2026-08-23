"use client";

import React, { useState } from "react";
import { X, UserPlus, Shield, User, Mail, Key, Loader2, CheckCircle2 } from "lucide-react";
import { OrganizationRecord, organizationsService } from "@/app/services/organizationsService";
import { toast } from "react-toastify";

interface OrgAdminsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationRecord;
  onSuccess: () => void;
}

export default function OrgAdminsModal({
  isOpen,
  onClose,
  organization,
  onSuccess,
}: OrgAdminsModalProps) {
  const [email, setEmail] = useState("");
  const [passwordRaw, setPasswordRaw] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !passwordRaw.trim()) {
      toast.error("Por favor completa el correo y la contraseña del nuevo administrador");
      return;
    }

    setIsLoading(true);
    try {
      await organizationsService.createOrgAdmin(organization.id, {
        email: email.trim(),
        passwordRaw: passwordRaw.trim(),
      });

      toast.success(`Administrador "${email}" creado exitosamente para ${organization.name}`);
      setEmail("");
      setPasswordRaw("");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al crear el usuario administrador");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#142612] border border-white/15 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-montserrat text-xl font-bold text-white">
                Administradores de la ONG
              </h2>
              <p className="text-xs text-white/50 font-poppins">
                Organización: <strong className="text-cyan-300">{organization.name}</strong>
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

        {/* Create new Admin user section */}
        <form onSubmit={handleCreateAdmin} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Crear Nuevo Usuario Administrador (Admin/Encargado)
          </h4>

          <div className="space-y-1">
            <label className="text-xs font-medium text-white/70">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@organizacion.org"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-white/70">Contraseña Contrato / Acceso</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                value={passwordRaw}
                onChange={(e) => setPasswordRaw(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Generar Usuario Administrador
          </button>
        </form>

        {/* Existing users list */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider">
            Usuarios Asignados a {organization.name}
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {(!organization.users || organization.users.length === 0) ? (
              <p className="text-xs text-white/40 italic p-3 bg-white/5 rounded-xl text-center">
                Aún no hay administradores creados para esta organización.
              </p>
            ) : (
              organization.users.map((usr) => (
                <div
                  key={usr.id}
                  className="bg-white/5 border border-white/5 rounded-xl p-3 flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-white font-semibold">{usr.email}</p>
                      <p className="text-[10px] text-white/40">Rol: {usr.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Activo
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/15 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
