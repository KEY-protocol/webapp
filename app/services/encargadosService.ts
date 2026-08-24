import axios from "axios";

export interface EncargadoDto {
  id: string;
  email: string;
  role: "ENCARGADO" | "ADMIN";
  ongId: string;
  createdAt: string;
}

export function getOngBaseUrl(ongUrl?: string | null): string {
  if (!ongUrl) return "http://localhost:3001";
  let url = ongUrl.trim().replace(/\/+$/, "");
  if (typeof window !== "undefined") {
    url = url.replace(/https?:\/\/(ong-server|ongserver)/i, "http://localhost");
  }
  return url;
}

export async function fetchEncargados(ongUrl: string, token: string): Promise<EncargadoDto[]> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    const response = await axios.get(`${baseUrl}/users/encargados`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener encargados:", error);
    return [];
  }
}

export async function createEncargado(
  ongUrl: string,
  token: string,
  data: { email: string; password: string },
): Promise<EncargadoDto | null> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    const response = await axios.post(
      `${baseUrl}/users`,
      { ...data, role: "ENCARGADO" },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear encargado:", error);
    throw error;
  }
}

export async function deleteEncargado(
  ongUrl: string,
  token: string,
  id: string,
): Promise<boolean> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    await axios.delete(`${baseUrl}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("Error al eliminar encargado:", error);
    return false;
  }
}
