/**
 * Technician types aligned with ORGServer backend models.
 */

/** Backend status values mapped to frontend display */
export type TechnicianStatus = "pending" | "approved" | "verified";

/** Raw Prisma status values that may come from findOne (detail endpoint) */
export type TechnicianStatusRaw =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "VERIFIED";

/** Normalize any status format to the frontend-friendly lowercase version */
export function normalizeStatus(
  status: string,
): TechnicianStatus {
  const map: Record<string, TechnicianStatus> = {
    PENDING_APPROVAL: "pending",
    APPROVED: "approved",
    VERIFIED: "verified",
    pending: "pending",
    approved: "approved",
    verified: "verified",
  };
  return map[status] || "pending";
}

/** Compact technician record returned by GET /technicians (list) */
export interface TechnicianSummary {
  id: string;
  fullName: string;
  documentNumber: string;
  documentType: string;
  status: TechnicianStatus;
  createdAt: string;
  updatedAt: string;
}

/** Full technician detail returned by GET /technicians/:id */
export interface TechnicianDetail {
  id: string;
  name: string;
  surname: string;
  documentNumber: string;
  documentType: string;
  phone: string | null;
  skills: string[];
  status: string;
  did: string | null;
  certId: string | null;
  issuerOng: string;
  sourceOfTruth: boolean;
  imgfaceURL: string;
  imgDniURL: string;
  createdAt: string;
  updatedAt: string;
  /** Provisional signed URLs (included by backend in findOne) */
  expiresAt?: string;
  dniUrl?: string | null;
  selfieUrl?: string | null;
}

/** Payload for PATCH /technicians/:id */
export interface UpdateTechnicianPayload {
  name?: string;
  surname?: string;
  documentNumber?: string;
  documentType?: string;
  phone?: string;
  skills?: string[];
}

/** Image URLs response from GET /technicians/:id/provisional-image-urls */
export interface TechnicianImageUrls {
  expiresAt: string;
  dniUrl: string | null;
  selfieUrl: string | null;
}



/** Share permission details for a technician */
export interface TechnicianSharePermission {
  id: string;
  did: string;
  targetOng: string;
  canAccess: boolean;
  createdAt: string;
  updatedAt: string;
}


