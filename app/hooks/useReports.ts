"use client";

import { useCallback, useState } from "react";
import {
  getMonthlyActivityReport,
  getCourseCompletionReport,
  getTechnicianActivityReport,
  ReportData,
} from "../lib/reports-api";

interface UseReportsReturn {
  isLoading: boolean;
  error: string | null;
  reportData: ReportData | null;
  fetchMonthlyReport: (period: string, format: "json" | "pdf" | "excel") => Promise<void>;
  fetchCourseReport: (courseId: string, format: "json" | "pdf" | "excel") => Promise<void>;
  fetchTechnicianReport: (technicianId: string, format: "json" | "pdf" | "excel") => Promise<void>;
  clearReportData: () => void;
  clearError: () => void;
}

export function useReports(): UseReportsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const clearReportData = useCallback(() => setReportData(null), []);
  const clearError = useCallback(() => setError(null), []);

  const fetchMonthlyReport = useCallback(
    async (period: string, format: "json" | "pdf" | "excel") => {
      setIsLoading(true);
      setError(null);
      if (format === "json") {
        setReportData(null);
      }
      try {
        const res = await getMonthlyActivityReport(period, format);
        if (format === "json") {
          setReportData(res || null);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al obtener reporte mensual";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchCourseReport = useCallback(
    async (courseId: string, format: "json" | "pdf" | "excel") => {
      setIsLoading(true);
      setError(null);
      if (format === "json") {
        setReportData(null);
      }
      try {
        const res = await getCourseCompletionReport(courseId, format);
        if (format === "json") {
          setReportData(res || null);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al obtener reporte del curso";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchTechnicianReport = useCallback(
    async (technicianId: string, format: "json" | "pdf" | "excel") => {
      setIsLoading(true);
      setError(null);
      if (format === "json") {
        setReportData(null);
      }
      try {
        const res = await getTechnicianActivityReport(technicianId, format);
        if (format === "json") {
          setReportData(res || null);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al obtener reporte del técnico";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    reportData,
    fetchMonthlyReport,
    fetchCourseReport,
    fetchTechnicianReport,
    clearReportData,
    clearError,
  };
}
