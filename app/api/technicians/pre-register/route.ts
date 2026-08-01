import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

function getOngServerUrl(request: NextRequest): string {
  const headerUrl = request.headers.get("x-ong-url");
  if (headerUrl) return headerUrl;
  return process.env.ONG_SERVER_URL || "http://localhost:3001";
}

function buildHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = request.headers.get("x-auth-token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * POST /api/technicians/pre-register
 * Pre-registers an authorized technician into the ORGServer database.
 * The IA will match newly submitted mobile enrollments against these records.
 */
export async function POST(request: NextRequest) {
  try {
    const baseUrl = getOngServerUrl(request);
    const body = await request.json();

    const { data } = await axios.post(`${baseUrl}/technicians/pre-register`, body, {
      headers: buildHeaders(request),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/technicians/pre-register] Proxy error:", error);
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        {
          error: error.response.data?.message || "Error al pre-registrar técnico en servidor ONG",
          details: error.response.data,
        },
        { status: error.response.status },
      );
    }
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
