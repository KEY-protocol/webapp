"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Calendar,
  BookOpen,
  User,
  FileText,
  Download,
  AlertCircle,
  Clock,
  MapPin,
  Award,
  ListTodo,
} from "lucide-react";
import { useReports } from "@/app/hooks/useReports";
import { fetchTechnicians } from "@/app/lib/technicians-api";
import { fetchCourses, Course, ReportClass, CertifiedStudent, CourseCreated } from "@/app/lib/reports-api";
import type { TechnicianSummary } from "@/app/types/technician";

export default function ReportsPage() {
  const t = useTranslations("reports_page");

  // API hooks
  const {
    isLoading,
    error,
    reportData,
    fetchMonthlyReport,
    fetchCourseReport,
    fetchTechnicianReport,
    clearReportData,
    clearError,
  } = useReports();

  // State for selectors
  const [technicians, setTechnicians] = useState<TechnicianSummary[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingSelectors, setLoadingSelectors] = useState(false);

  // User input states
  const [activeTab, setActiveTab] = useState<"monthly" | "course" | "technician">("monthly");
  const [selectedPeriod, setSelectedPeriod] = useState("2026-03");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedTechId, setSelectedTechId] = useState("");

  // Load selectors data on mount
  useEffect(() => {
    const loadSelectors = async () => {
      setLoadingSelectors(true);
      try {
        const [techList, courseList] = await Promise.all([
          fetchTechnicians(),
          fetchCourses(),
        ]);
        setTechnicians(techList || []);
        setCourses(courseList || []);
        if (courseList && courseList.length > 0) {
          setSelectedCourseId(courseList[0].id);
        }
        if (techList && techList.length > 0) {
          setSelectedTechId(techList[0].id);
        }
      } catch (err) {
        console.error("Error loading dropdown data for reports:", err);
      } finally {
        setLoadingSelectors(false);
      }
    };
    loadSelectors();
  }, []);

  // Handlers
  const handleGenerate = useCallback(
    async (format: "json" | "pdf" | "excel") => {
      if (activeTab === "monthly") {
        if (!selectedPeriod) return;
        await fetchMonthlyReport(selectedPeriod, format);
      } else if (activeTab === "course") {
        if (!selectedCourseId) return;
        await fetchCourseReport(selectedCourseId, format);
      } else if (activeTab === "technician") {
        if (!selectedTechId) return;
        await fetchTechnicianReport(selectedTechId, format);
      }
    },
    [
      activeTab,
      selectedPeriod,
      selectedCourseId,
      selectedTechId,
      fetchMonthlyReport,
      fetchCourseReport,
      fetchTechnicianReport,
    ],
  );

  const handleTabChange = (tab: "monthly" | "course" | "technician") => {
    setActiveTab(tab);
    clearReportData();
    clearError();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-white">
            {t("title")}
          </h1>
          <p className="text-white/50 font-poppins text-sm mt-1">
            {t("subtitle")}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 gap-6">
          <button
            onClick={() => handleTabChange("monthly")}
            className={`pb-3 font-semibold font-poppins text-sm relative transition-all cursor-pointer ${
              activeTab === "monthly" ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            {t("tabs.monthly")}
            {activeTab === "monthly" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => handleTabChange("course")}
            className={`pb-3 font-semibold font-poppins text-sm relative transition-all cursor-pointer ${
              activeTab === "course" ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            {t("tabs.course")}
            {activeTab === "course" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => handleTabChange("technician")}
            className={`pb-3 font-semibold font-poppins text-sm relative transition-all cursor-pointer ${
              activeTab === "technician" ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            {t("tabs.technician")}
            {activeTab === "technician" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            {/* Tab Specific Filters */}
            {activeTab === "monthly" && (
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-semibold font-poppins flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  {t("monthly.period_label")}
                </label>
                <input
                  type="month"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-poppins"
                />
              </div>
            )}

            {activeTab === "course" && (
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-semibold font-poppins flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  {t("course.course_label")}
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={loadingSelectors}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-poppins"
                >
                  {courses.length === 0 ? (
                    <option value="" className="bg-primary text-white/50">
                      No hay cursos disponibles
                    </option>
                  ) : (
                    courses.map((course) => (
                      <option key={course.id} value={course.id} className="bg-primary text-white">
                        {course.title}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}

            {activeTab === "technician" && (
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-semibold font-poppins flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  {t("technician.tech_label")}
                </label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  disabled={loadingSelectors}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-poppins"
                >
                  {technicians.length === 0 ? (
                    <option value="" className="bg-primary text-white/50">
                      No hay técnicos disponibles
                    </option>
                  ) : (
                    technicians.map((tech) => (
                      <option key={tech.id} value={tech.id} className="bg-primary text-white">
                        {tech.fullName}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleGenerate("json")}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold font-poppins transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                {t("export.json")}
              </button>

              <button
                onClick={() => handleGenerate("pdf")}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-xl font-semibold font-poppins transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-red-400" />
                {t("export.pdf")}
              </button>

              <button
                onClick={() => handleGenerate("excel")}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-xl font-semibold font-poppins transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-green-400" />
                {t("export.excel")}
              </button>
            </div>
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

        {/* Report Content Display */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/40 text-sm">{t("loading")}</p>
            </div>
          ) : !reportData ? (
            <div className="bg-white/5 border border-dashed border-white/15 rounded-2xl p-16 text-center">
              <p className="text-white/30 font-poppins text-base">
                {t("no_data")}
              </p>
            </div>
          ) : (
            /* Visual Report Representation */
            <div className="space-y-6 animate-fadeIn">
              {/* Report Title */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-white/15 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold font-montserrat text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    {activeTab === "monthly" && `Reporte de Actividad Mensual — Período: ${reportData.period}`}
                    {activeTab === "course" && `Reporte de Avance de Curso — ${reportData.title}`}
                    {activeTab === "technician" && `Reporte de Actividad del Técnico — ${reportData.technician?.name}`}
                  </h2>
                  {activeTab === "technician" && (
                    <p className="text-white/40 text-xs mt-1 font-mono break-all">
                      DID: {reportData.technician?.did}
                    </p>
                  )}
                </div>
                <div className="text-xs text-white/40 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 font-mono">
                  {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Summary stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activeTab === "monthly" && (
                  <>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Cursos Creados</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{reportData.summary?.courses}</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Clases Dictadas</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{reportData.summary?.classes}</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Evidencias Subidas</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{reportData.summary?.evidences}</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Certificaciones</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{reportData.summary?.certificates}</h3>
                    </div>
                  </>
                )}

                {activeTab === "course" && (
                  <>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md col-span-2">
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Total de Clases Realizadas</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{reportData.totalClasses}</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md col-span-2">
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Certificados Emitidos</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{reportData.totalCertificates}</h3>
                    </div>
                  </>
                )}

                {activeTab === "technician" && (
                  <>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md col-span-1">
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Clases Dictadas</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{reportData.totalClassesTaught}</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md col-span-1">
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Cursos Creados</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{reportData.totalCoursesCreated}</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md col-span-2">
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Certificaciones Emitidas</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{reportData.totalCertificatesIssued}</h3>
                    </div>
                  </>
                )}
              </div>

              {/* Main table data details */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm font-poppins flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-emerald-400" />
                    Detalles del Reporte
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  {/* Table for Monthly/Course classes details */}
                  {reportData.classes || reportData.classDetails ? (
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50 font-semibold font-poppins">
                          <th className="px-6 py-4">{t("table.date")}</th>
                          <th className="px-6 py-4">Curso</th>
                          {activeTab !== "course" && <th className="px-6 py-4">Técnico</th>}
                          <th className="px-6 py-4">Ubicación</th>
                          <th className="px-6 py-4 text-right">Asistentes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-white/80 font-poppins">
                        {(reportData.classes || reportData.classDetails || []).map((c: ReportClass, i: number) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-white/30" />
                              {formatDate(c.date)}
                            </td>
                            <td className="px-6 py-4 font-semibold text-white">
                              {c.course || reportData.title}
                            </td>
                            {activeTab !== "course" && (
                              <td className="px-6 py-4">{c.technician}</td>
                            )}
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                {c.location || "S/D"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                              {c.participants}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-white/30">
                      No hay clases registradas en este reporte.
                    </div>
                  )}
                </div>
              </div>

              {/* Extra details (students certified / certificates issued / courses created) */}
              {(reportData.certifiedStudents || reportData.coursesCreated || reportData.certificatesIssued) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Certified Students or Certificates Issued */}
                  {(reportData.certifiedStudents || reportData.certificatesIssued) && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                      <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                        <h4 className="font-bold text-white text-sm font-poppins flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-400" />
                          Certificados de Habilidad
                        </h4>
                      </div>
                      <div className="divide-y divide-white/5 max-h-80 overflow-y-auto no-scrollbar">
                        {(reportData.certifiedStudents || reportData.certificatesIssued || []).map((c: CertifiedStudent, i: number) => (
                          <div key={i} className="px-6 py-3.5 flex justify-between items-center hover:bg-white/5 transition-colors">
                            <div className="flex flex-col gap-1 pr-4">
                              <span className="text-white font-mono text-xs truncate max-w-xs md:max-w-sm">
                                {c.studentDid || c.studentDid || "DID Desconocido"}
                              </span>
                              {c.certificateId && (
                                <span className="text-[10px] text-white/30 font-mono">
                                  ID: {c.certificateId}
                                </span>
                              )}
                            </div>
                            <span className="text-white/40 text-xs shrink-0">
                              {formatDate(c.issuedAt)}
                            </span>
                          </div>
                        ))}
                        {(reportData.certifiedStudents || reportData.certificatesIssued || []).length === 0 && (
                          <div className="p-8 text-center text-white/30 text-xs">
                            No se han emitido certificados.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Courses Created (Only for Technician Report) */}
                  {reportData.coursesCreated && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                      <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                        <h4 className="font-bold text-white text-sm font-poppins flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-emerald-400" />
                          Cursos Creados
                        </h4>
                      </div>
                      <div className="divide-y divide-white/5 max-h-80 overflow-y-auto no-scrollbar">
                        {reportData.coursesCreated.map((course: CourseCreated, i: number) => (
                          <div key={i} className="px-6 py-3.5 flex justify-between items-center hover:bg-white/5 transition-colors">
                            <span className="text-white font-semibold font-poppins text-xs truncate max-w-xs md:max-w-sm">
                              {course.title}
                            </span>
                            <span className="text-white/40 text-xs shrink-0">
                              {formatDate(course.createdAt)}
                            </span>
                          </div>
                        ))}
                        {reportData.coursesCreated.length === 0 && (
                          <div className="p-8 text-center text-white/30 text-xs">
                            No se han creado cursos.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
