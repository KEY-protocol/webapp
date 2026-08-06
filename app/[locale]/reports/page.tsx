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

// TODO: [REPORTS-PANEL] Descomentar e integrar la vista completa de reportes cuando los endpoints del backend estén listos.
/*
export default function ReportsPage() {
  ...
}
*/

export default function ReportsPage() {
  return (
    <div className="flex-1 p-8 bg-primary min-h-screen flex items-center justify-center">
      <div className="bg-white/5 border border-dashed border-white/20 p-12 rounded-3xl max-w-lg text-center space-y-4">
        <FileText className="w-14 h-14 text-emerald-400/50 mx-auto" />
        <h2 className="text-2xl font-bold text-white font-montserrat">
          Centro de Reportes
        </h2>
        <p className="text-white/60 text-sm font-poppins leading-relaxed">
          El panel de generación y exportación de reportes de actividad, por curso y por técnico se encuentra deshabilitado temporalmente.
        </p>
        <div className="pt-2">
          <span className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono rounded-full font-bold">
            TODO: Integración pendiente de backend
          </span>
        </div>
      </div>
    </div>
  );
}
