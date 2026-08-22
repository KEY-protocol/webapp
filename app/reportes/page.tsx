"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
} from "lucide-react";

export default function ReportesPage() {
  const [reportType, setReportType] = useState("MONTHLY_ACTIVITY");
  const [period, setPeriod] = useState("2026-08");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = (format: "excel" | "pdf") => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Reporte (${format.toUpperCase()}) generado con éxito para el periodo ${period}.`);
    }, 1200);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-montserrat flex items-center gap-3">
          <FileText className="w-8 h-8 text-accent" /> Reportes Institucionales
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Exporta resúmenes ejecutivos, avance de cursos y actividad de técnicos en Excel o PDF.
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/50 border border-white/10 rounded-3xl p-6 space-y-4">
          <label className="text-xs font-bold uppercase text-white/40 flex items-center gap-2">
            <Filter size={14} /> Tipo de Reporte
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="MONTHLY_ACTIVITY" className="bg-primary">Actividad Mensual Institucional</option>
            <option value="COURSE_COMPLETION" className="bg-primary">Finalización de Cursos y Capacitaciones</option>
            <option value="TECHNICIAN_ACTIVITY" className="bg-primary">Rendimiento y Clases por Técnico</option>
          </select>
        </div>

        <div className="bg-primary/50 border border-white/10 rounded-3xl p-6 space-y-4">
          <label className="text-xs font-bold uppercase text-white/40 flex items-center gap-2">
            <Calendar size={14} /> Periodo / Mes
          </label>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <div className="bg-primary/50 border border-white/10 rounded-3xl p-6 flex flex-col justify-center gap-3">
          <p className="text-xs font-bold uppercase text-white/40">Descargar Formato</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleDownload("excel")}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold py-3 rounded-2xl hover:bg-emerald-600/30 transition-all text-sm"
            >
              <FileSpreadsheet size={16} /> Excel
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 border border-red-500/30 text-red-400 font-bold py-3 rounded-2xl hover:bg-red-600/30 transition-all text-sm"
            >
              <Download size={16} /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-primary/30 border border-white/10 rounded-3xl p-8 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <CheckCircle2 className="text-accent" /> Resumen del Reporte Seleccionado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
          <div className="p-4 bg-white/5 rounded-2xl">
            <p className="text-xs text-white/40">Métrica Principal</p>
            <p className="text-xl font-bold text-white mt-1">32 Clases Dictadas</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl">
            <p className="text-xs text-white/40">Técnicos Activos</p>
            <p className="text-xl font-bold text-white mt-1">12 Técnicos</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl">
            <p className="text-xs text-white/40">Verificaciones On-Chain</p>
            <p className="text-xl font-bold text-accent mt-1">100% Auditadas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
