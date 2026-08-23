import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface OrganizationConfig {
  id: string;
  organizationId: string;
  dbConnectionString?: string | null;
  apiBaseUrl?: string | null;
  phalaTeeUrl?: string | null;
  blockchainRpcUrl?: string | null;
  maxTechniciansLimit?: number | null;
  metadata?: any;
}

export interface OrganizationAdmin {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface OrganizationRecord {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  contactEmail?: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
  config?: OrganizationConfig | null;
  users?: OrganizationAdmin[];
  adminCount?: number;
}

export interface CreateOrgPayload {
  name: string;
  slug: string;
  description?: string;
  contactEmail?: string;
  dbConnectionString?: string;
  apiBaseUrl?: string;
  phalaTeeUrl?: string;
  blockchainRpcUrl?: string;
  maxTechniciansLimit?: number;
}

export interface UpdateOrgCredentialsPayload {
  dbConnectionString?: string;
  apiBaseUrl?: string;
  phalaTeeUrl?: string;
  blockchainRpcUrl?: string;
  maxTechniciansLimit?: number;
}

export const organizationsService = {
  async getOrganizations(): Promise<OrganizationRecord[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/organizations`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener lista de organizaciones:", error);
      return [];
    }
  },

  async getOrganization(id: string): Promise<OrganizationRecord | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/organizations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la organización ${id}:`, error);
      return null;
    }
  },

  async createOrganization(data: CreateOrgPayload): Promise<OrganizationRecord> {
    const response = await axios.post(`${API_BASE_URL}/organizations`, data);
    return response.data;
  },

  async updateOrganization(
    id: string,
    data: { name?: string; description?: string; contactEmail?: string; status?: string }
  ): Promise<OrganizationRecord> {
    const response = await axios.put(`${API_BASE_URL}/organizations/${id}`, data);
    return response.data;
  },

  async updateCredentials(
    id: string,
    data: UpdateOrgCredentialsPayload
  ): Promise<OrganizationConfig> {
    const response = await axios.put(`${API_BASE_URL}/organizations/${id}/credentials`, data);
    return response.data;
  },

  async createOrgAdmin(
    id: string,
    data: { email: string; passwordRaw: string }
  ): Promise<OrganizationAdmin> {
    const response = await axios.post(`${API_BASE_URL}/organizations/${id}/admins`, data);
    return response.data;
  },
};
