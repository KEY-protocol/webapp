import axios from "axios";

const rawUrl =
  process.env.NEXT_PUBLIC_CENTRAL_SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVIDOR_BASE_URL ||
  process.env.SERVIDOR_BASE_URL ||
  "http://localhost:3000";

const cleanBaseUrl = rawUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
const API_BASE_URL = `${cleanBaseUrl}/api/superadmin`;

export interface AuditLogRecord {
  id: string;
  action: string;
  actor: string;
  ongId?: string | null;
  metadata?: any;
  timestamp: string;
}

export interface SuperadminStats {
  totalOrgs: number;
  activeOrgs: number;
  totalAdmins: number;
  totalTechnicians: number;
  verifiedTechnicians: number;
  totalAuditLogs: number;
}

export const superadminAuditService = {
  async getAuditLogs(filters?: {
    actor?: string;
    action?: string;
    ongId?: string;
    from?: string;
    to?: string;
  }): Promise<AuditLogRecord[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener los logs de auditoría:", error);
      return [];
    }
  },

  async getSuperadminStats(): Promise<SuperadminStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit/stats`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas del Superadmin:", error);
      return {
        totalOrgs: 0,
        activeOrgs: 0,
        totalAdmins: 0,
        totalTechnicians: 0,
        verifiedTechnicians: 0,
        totalAuditLogs: 0,
      };
    }
  },

  async deleteAuditLog(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/audit/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar log de auditoría:", error);
      return false;
    }
  },
};
