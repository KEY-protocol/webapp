"use client";

import React, { useState } from "react";
import {
  X,
  UserPlus,
  Shield,
  User,
  Mail,
  Key,
  Loader2,
  CheckCircle2,
  Trash2,
  Edit2,
  Save,
} from "lucide-react";
import {
  OrganizationAdmin,
  OrganizationRecord,
  organizationsService,
} from "@/app/services/organizationsService";
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
  const [role, setRole] = useState("ADMIN");
  const [isLoading, setIsLoading] = useState(false);

  // Modificación / Edición
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("ADMIN");
  const [editPassword, setEditPassword] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !passwordRaw.trim()) {
      toast.error("Por favor completa el correo y la contraseña del usuario");
      return;
    }

    setIsLoading(true);
    try {
      await organizationsService.createOrgAdmin(organization.id, {
        email: email.trim(),
        passwordRaw: passwordRaw.trim(),
        role,
      });

      toast.success(`Usuario "${email}" (${role}) creado exitosamente para ${organization.name}`);
      setEmail("");
      setPasswordRaw("");
      setRole("ADMIN");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al crear el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (usr: OrganizationAdmin) => {
    setEditingUserId(usr.id);
    setEditRole(usr.role || "ADMIN");
    setEditPassword("");
  };

  const handleSaveEdit = async (userId: string) => {
    setIsActionLoading(true);
    try {
      await organizationsService.updateOrgUser(organization.id, userId, {
        role: editRole,
        ...(editPassword.trim() && { passwordRaw: editPassword.trim() }),
      });
      toast.success("Usuario actualizado correctamente");
      setEditingUserId(null);
      setEditPassword("");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al actualizar el usuario");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteUser = async (usr: OrganizationAdmin) => {
    if (!confirm(`¿Estás seguro de eliminar el usuario "${usr.email}"?`)) {
      return;
    }

    setIsActionLoading(true);
    try {
      await organizationsService.deleteOrgUser(organization.id, usr.id);
      toast.success(`Usuario "${usr.email}" eliminado correctamente`);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al eliminar el usuario");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#142612] border border-white/15 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-montserrat text-xl font-bold text-white">
                Gestión de Usuarios (Admins & Encargados)
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

        {/* Create new Admin/Encargado user section */}
        <form onSubmit={handleCreateUser} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Crear Nuevo Usuario (Administrador / Encargado)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@organizacion.org"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-poppins"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70">Rol de Usuario</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#162713] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-poppins cursor-pointer"
              >
                <option value="ADMIN">ADMINISTRADOR (Acceso completo)</option>
                <option value="ENCARGADO">ENCARGADO (Operador de campo / Cursos)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-white/70">Contraseña de Acceso</label>
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
            Generar Usuario
          </button>
        </form>

        {/* Existing users list */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider">
            Usuarios Auditable de {organization.name} (Admins & Encargados)
          </h4>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {!organization.users || organization.users.length === 0 ? (
              <p className="text-xs text-white/40 italic p-3 bg-white/5 rounded-xl text-center">
                Aún no hay usuarios o encargados creados para esta organización.
              </p>
            ) : (
              organization.users.map((usr) => {
                const isEditing = editingUserId === usr.id;

                return (
                  <div
                    key={usr.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold truncate">{usr.email}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                              usr.role === "ADMIN" || usr.role === "SUPERADMIN"
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {usr.role}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Activo
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inline edit form or Action Buttons */}
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="bg-[#162713] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="ENCARGADO">ENCARGADO</option>
                        </select>
                        <input
                          type="password"
                          placeholder="Nueva clave (opcional)"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white w-full sm:w-36 placeholder:text-white/40"
                        />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSaveEdit(usr.id)}
                            disabled={isActionLoading}
                            className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold transition-all cursor-pointer"
                            title="Guardar cambios"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleStartEdit(usr)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10"
                          title="Modificar usuario"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(usr)}
                          disabled={isActionLoading}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer border border-rose-500/20"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
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
