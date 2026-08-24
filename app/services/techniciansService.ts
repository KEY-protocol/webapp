import axios from "axios";
import { getOngBaseUrl } from "./encargadosService";

export interface TechnicianDto {
  id: string;
  name: string;
  surname: string;
  documentNumber: string;
  documentType: string;
  phone?: string;
  skills: string[];
  status: "PENDING_APPROVAL" | "APPROVED" | "VERIFIED";
  issuerOng: string;
  did?: string;
  certId?: string;
  provisionalImgFaceUrl?: string;
  provisionalImgDniUrl?: string;
  createdAt: string;
}

export async function fetchTechnicians(
  ongUrl: string,
  token: string,
): Promise<TechnicianDto[]> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    const response = await axios.get(`${baseUrl}/technicians`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener técnicos:", error);
    return [];
  }
}

export async function fetchTechnicianById(
  ongUrl: string,
  token: string,
  id: string,
): Promise<TechnicianDto | null> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    const response = await axios.get(`${baseUrl}/technicians/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener técnico por ID:", error);
    return null;
  }
}

export async function approveTechnician(
  ongUrl: string,
  token: string,
  id: string,
): Promise<TechnicianDto | null> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    const response = await axios.patch(
      `${baseUrl}/technicians/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    console.error("Error al aprobar técnico:", error);
    throw error;
  }
}
