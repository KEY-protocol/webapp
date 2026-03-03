export type IdentityStatus = "pending" | "approved" | "rejected" | "in_review";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "user";
  avatar?: string;
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

export interface ServerData {
  currentUser: UserProfile;
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
