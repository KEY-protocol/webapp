import axios from "axios";

const rawUrl =
  process.env.NEXT_PUBLIC_CENTRAL_SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVIDOR_BASE_URL ||
  process.env.SERVIDOR_BASE_URL ||
  "http://localhost:3000";

const cleanBaseUrl = rawUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
const API_BASE_URL = `${cleanBaseUrl}/api/superadmin`;

export interface OrganizationConfig {
  id: string;
  organizationId: string;
  dbConnectionString?: string | null;
  apiBaseUrl?: string | null;
  phalaTeeUrl?: string | null;
  blockchainRpcUrl?: string | null;
  blockchainPrivateKey?: string | null;
  blockchainContractAddress?: string | null;
  pinataJwt?: string | null;
  pinataApiKey?: string | null;
  pinataSecretApiKey?: string | null;
  embeddingServiceUrl?: string | null;
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
  blockchainPrivateKey?: string;
  blockchainContractAddress?: string;
  pinataJwt?: string;
  pinataApiKey?: string;
  pinataSecretApiKey?: string;
  embeddingServiceUrl?: string;
  maxTechniciansLimit?: number;
}

export interface UpdateOrgCredentialsPayload {
  dbConnectionString?: string;
  apiBaseUrl?: string;
  phalaTeeUrl?: string;
  blockchainRpcUrl?: string;
  blockchainPrivateKey?: string;
  blockchainContractAddress?: string;
  pinataJwt?: string;
  pinataApiKey?: string;
  pinataSecretApiKey?: string;
  embeddingServiceUrl?: string;
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
    try {
      const response = await axios.post(`${API_BASE_URL}/organizations`, data);
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error(
          "No se pudo conectar con el Servidor Central (puerto 3000). Asegúrate de ejecutar 'npm run dev:full' o 'npm run dev:backend'."
        );
      }
      throw error;
    }
  },

  async updateOrganization(
    id: string,
    data: { name?: string; description?: string; contactEmail?: string; status?: string }
  ): Promise<OrganizationRecord> {
    try {
      const response = await axios.put(`${API_BASE_URL}/organizations/${id}`, data);
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("No se pudo conectar con el Servidor Central (puerto 3000).");
      }
      throw error;
    }
  },

  async updateCredentials(
    id: string,
    data: UpdateOrgCredentialsPayload
  ): Promise<OrganizationConfig> {
    try {
      const response = await axios.put(`${API_BASE_URL}/organizations/${id}/credentials`, data);
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("No se pudo conectar con el Servidor Central (puerto 3000).");
      }
      throw error;
    }
  },

  async createOrgAdmin(
    id: string,
    data: { email: string; passwordRaw: string; role?: string }
  ): Promise<OrganizationAdmin> {
    try {
      const response = await axios.post(`${API_BASE_URL}/organizations/${id}/admins`, data);
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("No se pudo conectar con el Servidor Central (puerto 3000).");
      }
      throw error;
    }
  },

  async updateOrgUser(
    orgId: string,
    userId: string,
    data: { role?: string; passwordRaw?: string }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/organizations/${orgId}/users/${userId}`, data);
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("No se pudo conectar con el Servidor Central (puerto 3000).");
      }
      throw error;
    }
  },

  async deleteOrgUser(
    orgId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/organizations/${orgId}/users/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("No se pudo conectar con el Servidor Central (puerto 3000).");
      }
      throw error;
    }
  },
};
