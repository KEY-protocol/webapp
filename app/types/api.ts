export type IdentityStatus = "pending" | "approved" | "rejected" | "in_review";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "encargado" | "admin";
  avatar?: string;
  organizationId?: string;
}

export interface IdentityRecord {
  id: string;
  fullName: string;
  documentNumber: string;
  documentType: "DNI" | "PASSPORT" | "LICENSE";
  status: IdentityStatus;
  createdAt: string;
  updatedAt: string;
  verificationDetails?: {
    faceScore: number;
    documentScore: number;
    notes?: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  encargadoId?: string;
  createdAt: string;
}

export interface ServerData {
  currentUser: UserProfile;
  users: UserProfile[]; // To manage other users
  organizations: Organization[];
  identities: IdentityRecord[];
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
