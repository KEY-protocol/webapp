import axios from "axios";
import { FormSchemaDto, FormVersionDto, FormFieldDef } from "../types/api";
import { getOngBaseUrl } from "./encargadosService";

export async function fetchForms(ongUrl: string, token: string): Promise<FormSchemaDto[]> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    const response = await axios.get(`${baseUrl}/forms`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener formularios:", error);
    return [];
  }
}

export async function fetchActiveForm(
  ongUrl: string,
  token: string,
  category: string = "IDENTITY",
): Promise<FormSchemaDto | null> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    const response = await axios.get(`${baseUrl}/forms/active?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || null;
  } catch (error) {
    console.error("Error al obtener formulario activo:", error);
    return null;
  }
}

export async function createFormSchema(
  ongUrl: string,
  token: string,
  data: {
    ongId?: string;
    title: string;
    description?: string;
    category?: string;
    version?: string;
    fields: FormFieldDef[];
  },
): Promise<FormSchemaDto | null> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    const response = await axios.post(`${baseUrl}/forms`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear formulario:", error);
    throw error;
  }
}

export async function createFormVersion(
  ongUrl: string,
  token: string,
  formId: string,
  data: {
    version: string;
    description?: string;
    fields: FormFieldDef[];
  },
): Promise<FormVersionDto | null> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    const response = await axios.post(`${baseUrl}/forms/${formId}/versions`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear versión de formulario:", error);
    throw error;
  }
}

export async function setActiveFormVersion(
  ongUrl: string,
  token: string,
  formId: string,
  versionId: string,
): Promise<boolean> {
  try {
    const baseUrl = getOngBaseUrl(ongUrl);
    await axios.patch(
      `${baseUrl}/forms/${formId}/select-version`,
      { versionId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return true;
  } catch (error) {
    console.error("Error al activar versión de formulario:", error);
    return false;
  }
}
