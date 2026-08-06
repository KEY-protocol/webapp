"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw, Search, AlertCircle, UserPlus } from "lucide-react";
import { useTechnicians } from "@/app/hooks/useTechnicians";
import TechnicianRow from "@/app/components/technicians/TechnicianCard";
import TechnicianDetailModal from "@/app/components/technicians/TechnicianDetailModal";
import EditTechnicianModal from "@/app/components/technicians/EditTechnicianModal";
import { useRouter } from "@/i18n/navigation";
import type { TechnicianStatus } from "@/app/types/technician";

type FilterStatus = "all" | TechnicianStatus;

export default function TechniciansPage() {
  const t = useTranslations("technicians_page");
  const router = useRouter();

  const {
    technicians,
    selectedTechnician,
    isLoading,
    isActing,
    error,
    refresh,
    loadDetail,
    approve,
    update,
    remove,
    clearSelected,
    clearError,
  } = useTechnicians();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

import { toast } from "react-toastify";

// Filtered technicians
  const filtered = useMemo(() => {
    let list = technicians;

    if (filterStatus !== "all") {
      list = list.filter((tech) => tech.status === filterStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (tech) =>
          tech.fullName.toLowerCase().includes(q) ||
          tech.documentNumber.toLowerCase().includes(q),
      );
    }

    return list;
  }, [technicians, filterStatus, search]);

  // Handlers
  const handleView = useCallback(
    async (id: string) => {
      await loadDetail(id);
      setShowDetailModal(true);
    },
    [loadDetail],
  );

  const handleEdit = useCallback(
    async (id: string) => {
      await loadDetail(id);
      setShowEditModal(true);
    },
    [loadDetail],
  );

  const handleApprove = useCallback(
    async (id: string) => {
      const confirmMsg = t("actions.approve_confirm");
      if (!window.confirm(confirmMsg)) return;
      await approve(id);
    },
    [approve, t],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmMsg = t("actions.delete_confirm");
      if (!window.confirm(confirmMsg)) return;
      await remove(id);
    },
    [remove, t],
  );

  const handleCloseDetail = useCallback(() => {
    setShowDetailModal(false);
    clearSelected();
  }, [clearSelected]);

  const handleCloseEdit = useCallback(() => {
    setShowEditModal(false);
    clearSelected();
  }, [clearSelected]);

  const filterTabs: { key: FilterStatus; label: string }[] = [
    { key: "all", label: t("filter.all") },
    { key: "pending", label: t("filter.pending") },
    { key: "approved", label: t("filter.approved") },
    { key: "verified", label: t("filter.verified") },
  ];

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-white">
              {t("title")}
            </h1>
            <p className="text-white/50 font-poppins text-sm mt-1">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/technicians/pre-register")}
              className="flex items-center gap-2 bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-xl font-semibold font-poppins transition-all text-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Pre-registrar Técnico
            </button>

            <button
              onClick={refresh}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl font-semibold font-poppins transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {t("refresh")}
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_placeholder")}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === tab.key
                    ? "bg-white/15 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-300 text-sm flex-1">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Count */}
        {!isLoading && (
          <p className="text-white/30 text-xs font-poppins">
            {t("total_count", { count: filtered.length })}
          </p>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/40 text-sm">{t("loading")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/15 rounded-2xl p-16 text-center">
            <p className="text-white/30 font-poppins text-base">
              {technicians.length === 0
                ? t("no_technicians")
                : t("no_results")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((tech) => (
              <TechnicianRow
                key={tech.id}
                technician={tech}
                onView={handleView}
                onEdit={handleEdit}
                onApprove={handleApprove}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <TechnicianDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetail}
        technician={selectedTechnician}
        isLoading={isActing}
      />

      {/* Edit Modal */}
      <EditTechnicianModal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        technician={selectedTechnician}
        onSave={update}
        isSaving={isActing}
      />

      {/* Full-screen Loading Overlay for Actions (Approve / Save / Delete) */}
      {isActing && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-center select-none">
          <div className="bg-primary/90 border border-white/10 p-8 rounded-2xl flex flex-col items-center max-w-sm w-full shadow-2xl space-y-4">
            <RefreshCw className="w-10 h-10 text-[#28a745] animate-spin" />
            <div className="space-y-1">
              <h3 className="text-white font-montserrat font-bold text-lg">
                Procesando Aprobación
              </h3>
              <p className="text-white/60 font-poppins text-xs leading-relaxed">
                Validando identidad en el servidor central TEE y registrando en la red. Por favor, espere un momento...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
