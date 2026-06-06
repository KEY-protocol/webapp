"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Globe, Shield, Plus, ToggleLeft, ToggleRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { fetchSharePermissions, updateSharePermission } from "@/app/lib/technicians-api";
import type { TechnicianDetail, TechnicianSharePermission } from "@/app/types/technician";

interface SharePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: TechnicianDetail | null;
}

export default function SharePermissionsModal({
  isOpen,
  onClose,
  technician,
}: SharePermissionsModalProps) {
  const t = useTranslations("technicians_page.share_permissions_modal");

  const [permissions, setPermissions] = useState<TechnicianSharePermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOng, setNewOng] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isOpen && technician?.id) {
      setIsLoading(true);
      setMessage(null);
      fetchSharePermissions(technician.id)
        .then((data) => {
          setPermissions(data || []);
        })
        .catch((err) => {
          console.error("Error fetching share permissions:", err);
          setMessage({
            type: "error",
            text: err instanceof Error ? err.message : "Error al cargar permisos",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setPermissions([]);
      setNewOng("");
      setMessage(null);
    }
  }, [isOpen, technician?.id]);

  if (!isOpen || !technician) return null;

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOng.trim()) {
      setMessage({ type: "error", text: t("empty_ong_error") });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      const updated = await updateSharePermission(technician.id, newOng.trim(), true);
      setPermissions((prev) => {
        const filtered = prev.filter((p) => p.targetOng !== updated.targetOng);
        return [updated, ...filtered];
      });
      setNewOng("");
      setMessage({ type: "success", text: t("grant_success") });
    } catch (err) {
      console.error("Error granting access:", err);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error al otorgar acceso",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAccess = async (targetOng: string, currentAccess: boolean) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const updated = await updateSharePermission(technician.id, targetOng, !currentAccess);
      setPermissions((prev) =>
        prev.map((p) => (p.targetOng === targetOng ? updated : p))
      );
      setMessage({
        type: "success",
        text: !currentAccess ? t("grant_success") : t("revoke_success"),
      });
    } catch (err) {
      console.error("Error toggling access:", err);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error al modificar acceso",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#13220f]/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Shield className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="font-montserrat text-xl font-bold text-white">
                  {t("title")}
                </h2>
                <p className="text-xs text-white/50 font-poppins">
                  {technician.name} {technician.surname} • DID: {technician.did?.substring(0, 15)}...
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

          <p className="text-sm text-white/70 font-poppins leading-relaxed">
            {t("subtitle")}
          </p>

          {/* Form to Grant Access */}
          <form onSubmit={handleGrantAccess} className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wider">
                {t("add_ong_label")}
              </label>
              <input
                type="text"
                value={newOng}
                onChange={(e) => setNewOng(e.target.value)}
                placeholder={t("add_ong_placeholder")}
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !newOng.trim()}
              className="bg-[#28a745] hover:bg-[#218838] disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all font-poppins flex items-center gap-2 cursor-pointer h-[42px]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {t("grant")}
            </button>
          </form>

          {/* Status Alert Banner */}
          {message && (
            <div
              className={`p-3 rounded-xl border text-sm flex items-start gap-2 animate-fadeIn ${
                message.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                  : "bg-red-500/10 border-red-500/25 text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <p className="flex-1 leading-normal">{message.text}</p>
            </div>
          )}

          {/* Permissions List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">
              ONGs con Acceso Personalizado
            </h3>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
              </div>
            ) : permissions.length > 0 ? (
              <div className="overflow-hidden border border-white/10 rounded-2xl bg-white/5 divide-y divide-white/5 max-h-60 overflow-y-auto">
                {permissions.map((perm) => (
                  <div key={perm.id} className="flex justify-between items-center p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-white/40" />
                      <div>
                        <p className="text-sm font-semibold text-white">{perm.targetOng}</p>
                        <p className="text-[10px] text-white/40">
                          Actualizado: {new Date(perm.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          perm.canAccess
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/10 text-white/40 border border-white/10"
                        }`}
                      >
                        {perm.canAccess ? "ACTIVO" : "REVOCADO"}
                      </span>
                      <button
                        onClick={() => handleToggleAccess(perm.targetOng, perm.canAccess)}
                        disabled={isSubmitting}
                        className="text-white/60 hover:text-white transition-colors cursor-pointer"
                        title={perm.canAccess ? t("revoke") : t("grant_back")}
                      >
                        {perm.canAccess ? (
                          <ToggleRight className="w-8 h-8 text-[#28a745]" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-white/20" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                <p className="text-white/40 text-sm leading-relaxed">{t("no_permissions")}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-bold text-sm font-poppins cursor-pointer"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
