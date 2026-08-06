"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, User, Shield, Phone, Tag, Calendar, Globe } from "lucide-react";
import type { TechnicianDetail } from "@/app/types/technician";
import { normalizeStatus } from "@/app/types/technician";
import SharePermissionsModal from "./SharePermissionsModal";

import { useData } from "@/app/context/DataContext";

interface TechnicianDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: TechnicianDetail | null;
  isLoading: boolean;
}

export default function TechnicianDetailModal({
  isOpen,
  onClose,
  technician,
  isLoading,
}: TechnicianDetailModalProps) {
  const t = useTranslations("technicians_page.detail_modal");

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { data } = useData();
  const isAdmin = data.currentUser.role === "admin";

  const handleClose = () => {
    setIsShareModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  const normalized = technician ? normalizeStatus(technician.status) : "pending";

  const statusColor =
    normalized === "pending"
      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
      : normalized === "approved"
        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a2b15] border border-white/10 rounded-3xl shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-montserrat text-2xl font-bold text-white">
              {t("title")}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isLoading || !technician ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <User className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {technician.name} {technician.surname}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-3 py-0.5 text-xs font-bold rounded-full border ${statusColor}`}
                  >
                    {normalized.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<Shield className="w-4 h-4" />}
                  label={t("document_type")}
                  value={technician.documentType}
                />
                <DetailRow
                  icon={<Tag className="w-4 h-4" />}
                  label={t("document_number")}
                  value={technician.documentNumber}
                />
                <DetailRow
                  icon={<Phone className="w-4 h-4" />}
                  label={t("phone")}
                  value={technician.phone || "—"}
                />
                <DetailRow
                  icon={<Globe className="w-4 h-4" />}
                  label={t("issuer")}
                  value={technician.issuerOng}
                />
                <DetailRow
                  icon={<Calendar className="w-4 h-4" />}
                  label={t("created_at")}
                  value={new Date(technician.createdAt).toLocaleDateString()}
                />
                <DetailRow
                  icon={<Calendar className="w-4 h-4" />}
                  label={t("updated_at")}
                  value={new Date(technician.updatedAt).toLocaleDateString()}
                />
              </div>

              {/* DID */}
              {technician.did && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs font-bold text-white/50 mb-1">
                    {t("did")}
                  </p>
                  <p className="text-sm text-white font-mono break-all">
                    {technician.did}
                  </p>
                </div>
              )}

              {/* Skills */}
              {technician.skills && technician.skills.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-white/60 mb-2">
                    {t("skills")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {technician.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-medium bg-white/10 text-white/80 rounded-full border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}



              {/* Images */}
              <div>
                <p className="text-sm font-bold text-white/60 mb-3">
                  {t("images")}
                </p>
                {technician.dniUrl || technician.selfieUrl ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {technician.selfieUrl && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <p className="text-xs font-bold text-white/40 px-4 pt-3">
                          {t("selfie")}
                        </p>
                        <div className="p-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={technician.selfieUrl}
                            alt="Selfie"
                            className="w-full h-40 object-cover rounded-xl"
                          />
                        </div>
                      </div>
                    )}
                    {technician.dniUrl && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <p className="text-xs font-bold text-white/40 px-4 pt-3">
                          {t("dni")}
                        </p>
                        <div className="p-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={technician.dniUrl}
                            alt="DNI"
                            className="w-full h-40 object-cover rounded-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-8 text-center">
                    <p className="text-white/40 text-sm">{t("no_images")}</p>
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-between items-center pt-2">
                <div>
                  {isAdmin && technician.sourceOfTruth && technician.status !== "PENDING_APPROVAL" && (
                    <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-bold hover:bg-white/15 transition-all font-poppins cursor-pointer flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      {t("share_permissions_btn")}
                    </button>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors font-poppins cursor-pointer"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Permissions Modal */}
      {technician && (
        <SharePermissionsModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          technician={technician}
        />
      )}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-xl p-3">
      <span className="text-white/40 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-bold text-white/40">{label}</p>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  );
}
