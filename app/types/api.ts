export type EvidenceStatus = "pending" | "approved" | "rejected" | "in_review";
export type IdentityStatus = EvidenceStatus;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  avatar?: string;
  organizationId?: string;
}

export interface EvidenceRecord {
  id: string;
  fullName: string;
  documentNumber: string;
  documentType: "DNI" | "PASSPORT" | "LICENSE";
  status: EvidenceStatus;
  createdAt: string;
  updatedAt: string;
  verificationDetails?: {
    faceScore: number;
    documentScore: number;
    notes?: string;
  };
}

export type IdentityRecord = EvidenceRecord;

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  adminId?: string;
  createdAt: string;
}

export interface ServerData {
  currentUser: UserProfile;
  users: UserProfile[]; // To manage other users
  organizations: Organization[];
  evidences: EvidenceRecord[];
  identities: EvidenceRecord[];
  stats: {
    totalPending: number;
    totalApproved: number;
    totalRejected: number;
  };
  notifications: {
    id: string;
    message: string;
    type: "info" | "warning" | "error" | "success";
    read: boolean;
    timestamp: string;
  }[];
}

export type FormCategory = "IDENTITY" | "TECHNICIAN_EVIDENCE";
export type FormVersionStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface FormFieldDef {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: { value: string; label: string }[];
  hint?: string;
  step?: number;
}

export interface FormVersionDto {
  id: string;
  formId: string;
  version: string;
  description?: string;
  fields: FormFieldDef[];
  status: FormVersionStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormSchemaDto {
  id: string;
  ongId: string;
  title: string;
  description?: string;
  category: FormCategory;
  activeVersionId?: string;
  createdAt: string;
  updatedAt: string;
  versions?: FormVersionDto[];
  activeVersion?: FormVersionDto;
}
