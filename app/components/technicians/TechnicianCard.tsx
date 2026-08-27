"use client";

import { useTranslations } from "next-intl";
import { Eye, Pencil, CheckCircle, Trash2, User } from "lucide-react";
import type { TechnicianSummary } from "@/app/types/technician";

interface TechnicianRowProps {
  technician: TechnicianSummary;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  pending:
    "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  approved:
    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  verified:
    "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25",
};

export default function TechnicianRow({
  technician,
  onView,
  onEdit,
  onApprove,
  onDelete,
}: TechnicianRowProps) {
  const t = useTranslations("technicians_page");

  return (
    <div className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center border border-white/15 shrink-0">
            <User className="text-white/70 w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {technician.fullName}
            </p>
            <p className="text-white/40 text-xs font-mono truncate">
              {technician.documentType}: {technician.documentNumber}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="shrink-0">
          <span
            className={`inline-block px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${statusStyles[technician.status] || statusStyles.pending}`}
          >
            {t(`status.${technician.status}`)}
          </span>
        </div>

        {/* Date */}
        <div className="shrink-0 text-white/40 text-xs font-mono hidden lg:block">
          {new Date(technician.createdAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {technician.status === "pending" && (
            <button
              onClick={() => onApprove(technician.id)}
              className="flex items-center gap-1.5 bg-[#28a745]/20 hover:bg-[#28a745] text-[#28a745] hover:text-white border border-[#28a745]/40 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer mr-1"
              title={t("actions.approve")}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Aprobar Técnico</span>
            </button>
          )}
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            label={t("actions.view")}
            onClick={() => onView(technician.id)}
          />
          <ActionButton
            icon={<Pencil className="w-4 h-4" />}
            label={t("actions.edit")}
            onClick={() => onEdit(technician.id)}
          />
          <ActionButton
            icon={<Trash2 className="w-4 h-4" />}
            label={t("actions.delete")}
            onClick={() => onDelete(technician.id)}
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "success" | "danger";
}) {
  const colorClass =
    variant === "success"
      ? "hover:bg-emerald-500/20 hover:text-emerald-400"
      : variant === "danger"
        ? "hover:bg-red-500/20 hover:text-red-400"
        : "hover:bg-white/10 hover:text-white";

  return (
    <button
      title={label}
      onClick={onClick}
      className={`p-2 rounded-xl text-white/40 transition-colors cursor-pointer ${colorClass}`}
    >
      {icon}
    </button>
  );
}
