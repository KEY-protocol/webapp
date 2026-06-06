/**
 * Reports API client.
 * Calls go through the webapp's own /api/reports proxy routes.
 * Supports JSON payloads and binary (PDF/Excel) downloads.
 */

import apiClient from "@/app/lib/api-client";
import { AxiosError } from "axios";

export interface Course {
  id: string;
  title: string;
}

export interface ReportClass {
  date: string;
  course?: string;
  technician?: string;
  location?: string;
  participants: number;
}

export interface CertifiedStudent {
  studentDid: string;
  certificateId: string;
  issuedAt: string;
}

export interface CourseCreated {
  title: string;
  createdAt: string;
}

export interface ReportData {
  period?: string;
  title?: string;
  technician?: {
    name: string;
    did: string;
  };
  summary?: {
    courses: number;
    classes: number;
    evidences: number;
    certificates: number;
  };
  totalClasses?: number;
  totalCertificates?: number;
  totalClassesTaught?: number;
  totalCoursesCreated?: number;
  totalCertificatesIssued?: number;
  classes?: ReportClass[];
  classDetails?: ReportClass[];
  certifiedStudents?: CertifiedStudent[];
  certificatesIssued?: CertifiedStudent[];
  coursesCreated?: CourseCreated[];
}

export class ReportsApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ReportsApiError";
    this.status = status;
    this.details = details;
  }
}

function handleAxiosError(error: unknown): never {
  if (error instanceof AxiosError && error.response) {
    const { data, status } = error.response;
    throw new ReportsApiError(
      data?.error || data?.message || "Error en la operación de reportes",
      status,
      data?.details,
    );
  }
  throw new ReportsApiError("Error de conexión con el servidor", 0);
}

function downloadFile(blob: Blob, defaultFilename: string, contentDisposition?: string) {
  let filename = defaultFilename;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/** Get monthly activity report. */
export async function getMonthlyActivityReport(
  period: string,
  format: "json" | "pdf" | "excel",
): Promise<ReportData | void> {
  try {
    if (format === "json") {
      const { data } = await apiClient.get<ReportData>(`/reports/monthly-activity`, {
        params: { period, format },
      });
      return data;
    } else {
      const response = await apiClient.get(`/reports/monthly-activity`, {
        params: { period, format },
        responseType: "blob",
      });
      const contentDisposition = response.headers["content-disposition"];
      const defaultFilename = `Monthly_Activity_Report_${period}.${format === "pdf" ? "pdf" : "xlsx"}`;
      downloadFile(response.data, defaultFilename, contentDisposition);
    }
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Get course completion report. */
export async function getCourseCompletionReport(
  courseId: string,
  format: "json" | "pdf" | "excel",
): Promise<ReportData | void> {
  try {
    if (format === "json") {
      const { data } = await apiClient.get<ReportData>(`/reports/course-completion/${courseId}`, {
        params: { format },
      });
      return data;
    } else {
      const response = await apiClient.get(`/reports/course-completion/${courseId}`, {
        params: { format },
        responseType: "blob",
      });
      const contentDisposition = response.headers["content-disposition"];
      const defaultFilename = `Course_Completion_Report_${courseId}.${format === "pdf" ? "pdf" : "xlsx"}`;
      downloadFile(response.data, defaultFilename, contentDisposition);
    }
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Get technician activity report. */
export async function getTechnicianActivityReport(
  technicianId: string,
  format: "json" | "pdf" | "excel",
): Promise<ReportData | void> {
  try {
    if (format === "json") {
      const { data } = await apiClient.get<ReportData>(`/reports/technician-activity/${technicianId}`, {
        params: { format },
      });
      return data;
    } else {
      const response = await apiClient.get(`/reports/technician-activity/${technicianId}`, {
        params: { format },
        responseType: "blob",
      });
      const contentDisposition = response.headers["content-disposition"];
      const defaultFilename = `Technician_Activity_Report_${technicianId}.${format === "pdf" ? "pdf" : "xlsx"}`;
      downloadFile(response.data, defaultFilename, contentDisposition);
    }
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Fetch courses list for selectors. */
export async function fetchCourses(): Promise<Course[] | void> {
  try {
    const { data } = await apiClient.get<Course[]>("/courses");
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}
