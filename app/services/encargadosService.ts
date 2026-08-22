import axios from "axios";

export interface EncargadoDto {
  id: string;
  email: string;
  role: "ENCARGADO" | "ADMIN";
  ongId: string;
  createdAt: string;
}

export async function fetchEncargados(ongUrl: string, token: string): Promise<EncargadoDto[]> {
  try {
    const response = await axios.get(`${ongUrl}/users/encargados`, {
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
    const response = await axios.post(
      `${ongUrl}/users`,
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
    await axios.delete(`${ongUrl}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("Error al eliminar encargado:", error);
    return false;
  }
}
