import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
};
