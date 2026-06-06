/**
 * Technicians API client.
 * All calls go through the webapp's own /api/technicians proxy routes
 * to avoid CORS issues and keep the ORGServer URL server-side only.
 */

import apiClient from "@/app/lib/api-client";
import { AxiosError } from "axios";
import type {
  TechnicianSummary,
  TechnicianDetail,
  UpdateTechnicianPayload,
  TechnicianImageUrls,
  TechnicianMembership,
  TechnicianSharePermission,
} from "@/app/types/technician";

export class TechniciansApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "TechniciansApiError";
    this.status = status;
    this.details = details;
  }
}

function handleAxiosError(error: unknown): never {
  if (error instanceof AxiosError && error.response) {
    const { data, status } = error.response;
    throw new TechniciansApiError(
      data?.error || data?.message || "Error en la operación",
      status,
      data?.details,
    );
  }
  throw new TechniciansApiError("Error de conexión con el servidor", 0);
}

/** Fetch all technicians from the ORGServer via proxy. */
export async function fetchTechnicians(): Promise<TechnicianSummary[]> {
  try {
    const { data } = await apiClient.get<TechnicianSummary[]>("/technicians");
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Fetch a single technician by ID (includes provisional image URLs). */
export async function fetchTechnicianById(
  id: string,
): Promise<TechnicianDetail> {
  try {
    const { data } = await apiClient.get<TechnicianDetail>(
      `/technicians/${id}`,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Approve a pending technician. */
export async function approveTechnician(
  id: string,
): Promise<TechnicianDetail> {
  try {
    const { data } = await apiClient.patch<TechnicianDetail>(
      `/technicians/${id}/approve`,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Update a technician's data. */
export async function updateTechnician(
  id: string,
  payload: UpdateTechnicianPayload,
): Promise<TechnicianDetail> {
  try {
    const { data } = await apiClient.patch<TechnicianDetail>(
      `/technicians/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Delete a technician by ID. */
export async function deleteTechnician(
  id: string,
): Promise<{ deleted: boolean }> {
  try {
    const { data } = await apiClient.delete<{ deleted: boolean }>(
      `/technicians/${id}`,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Fetch provisional (signed, temporary) image URLs for a technician. */
export async function fetchTechnicianImageUrls(
  id: string,
): Promise<TechnicianImageUrls> {
  try {
    const { data } = await apiClient.get<TechnicianImageUrls>(
      `/technicians/${id}/images`,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Fetch memberships for a technician. */
export async function fetchTechnicianMemberships(
  id: string,
): Promise<TechnicianMembership[]> {
  try {
    const { data } = await apiClient.get<TechnicianMembership[]>(
      `/technicians/${id}/memberships`,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Fetch share permissions for a technician. */
export async function fetchSharePermissions(
  id: string,
): Promise<TechnicianSharePermission[]> {
  try {
    const { data } = await apiClient.get<TechnicianSharePermission[]>(
      `/technicians/${id}/share-permissions`,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Update/create a share permission for a technician. */
export async function updateSharePermission(
  id: string,
  targetOng: string,
  canAccess: boolean,
): Promise<TechnicianSharePermission> {
  try {
    const { data } = await apiClient.post<TechnicianSharePermission>(
      `/technicians/${id}/share-permissions`,
      { targetOng, canAccess },
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}
