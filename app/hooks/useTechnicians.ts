"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type {
  TechnicianSummary,
  TechnicianDetail,
  UpdateTechnicianPayload,
} from "@/app/types/technician";
import {
  fetchTechnicians,
  fetchTechnicianById,
  approveTechnician as apiApproveTechnician,
  updateTechnician as apiUpdateTechnician,
  deleteTechnician as apiDeleteTechnician,
} from "@/app/lib/technicians-api";
import { useAuth } from "@/app/context/AuthContext";

interface UseTechniciansReturn {
  /** List of technicians. */
  technicians: TechnicianSummary[];
  /** Currently selected technician detail. */
  selectedTechnician: TechnicianDetail | null;
  /** Loading state for list. */
  isLoading: boolean;
  /** Loading state for detail/actions. */
  isActing: boolean;
  /** Error message (if any). */
  error: string | null;
  /** Refresh the technicians list. */
  refresh: () => Promise<void>;
  /** Load detail for a single technician. */
  loadDetail: (id: string) => Promise<void>;
  /** Approve a pending technician. */
  approve: (id: string) => Promise<boolean>;
  /** Update a technician's data. */
  update: (id: string, payload: UpdateTechnicianPayload) => Promise<boolean>;
  /** Delete a technician. */
  remove: (id: string) => Promise<boolean>;
  /** Clear selected technician. */
  clearSelected: () => void;
  /** Clear error state. */
  clearError: () => void;
}

/**
 * Hook to manage technician data fetching and mutations.
 * Auto-fetches the list on mount if authenticated.
 */
export function useTechnicians(): UseTechniciansReturn {
  const { isAuthenticated } = useAuth();
  const t = useTranslations("technicians_page.actions");
  const [technicians, setTechnicians] = useState<TechnicianSummary[]>([]);
  const [selectedTechnician, setSelectedTechnician] =
    useState<TechnicianDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTechnicians();
      setTechnicians(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar técnicos";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    setIsActing(true);
    setError(null);
    try {
      const data = await fetchTechnicianById(id);
      setSelectedTechnician(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar detalle";
      setError(message);
    } finally {
      setIsActing(false);
    }
  }, []);

  const approve = useCallback(
    async (id: string): Promise<boolean> => {
      setIsActing(true);
      setError(null);
      try {
        await apiApproveTechnician(id);
        await refresh();
        return true;
      } catch (err) {
        let message = "Error al aprobar técnico";
        if (err instanceof Error) {
          message = err.message;
          const apiErr = err as { details?: { code?: string } };
          if (apiErr.details && typeof apiErr.details === "object") {
            const code = apiErr.details.code;
            if (code === "APPROVE_TECHNICIAN_CENTRAL_LOOKUP_FAILED") {
              message = t("approve_error_central_lookup");
            } else if (code === "APPROVE_TECHNICIAN_IDENTITY_CREATE_FAILED") {
              message = t("approve_error_identity_create");
            }
          }
        }
        setError(message);
        return false;
      } finally {
        setIsActing(false);
      }
    },
    [refresh, t],
  );

  const update = useCallback(
    async (id: string, payload: UpdateTechnicianPayload): Promise<boolean> => {
      setIsActing(true);
      setError(null);
      try {
        await apiUpdateTechnician(id, payload);
        await refresh();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al actualizar técnico";
        setError(message);
        return false;
      } finally {
        setIsActing(false);
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      setIsActing(true);
      setError(null);
      try {
        await apiDeleteTechnician(id);
        await refresh();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al eliminar técnico";
        setError(message);
        return false;
      } finally {
        setIsActing(false);
      }
    },
    [refresh],
  );

  const clearSelected = useCallback(() => setSelectedTechnician(null), []);
  const clearError = useCallback(() => setError(null), []);

  // Auto-fetch on mount when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    }
  }, [isAuthenticated, refresh]);

  return {
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
  };
}
