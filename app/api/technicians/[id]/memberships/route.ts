import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

function getOngServerUrl(request: NextRequest): string {
  const headerUrl = request.headers.get("x-ong-url");
  if (headerUrl) return headerUrl;
  return process.env.ONG_SERVER_URL || "http://localhost:3001";
}

function getAuthToken(request: NextRequest): string | null {
  return request.headers.get("x-auth-token") || null;
}

function buildHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getAuthToken(request);
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * GET /api/technicians/[id]/memberships
 * Fetch memberships for a single technician.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const baseUrl = getOngServerUrl(request);
    const { data } = await axios.get(
      `${baseUrl}/technicians/${id}/memberships`,
      { headers: buildHeaders(request) },
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/technicians/[id]/memberships] Proxy error:", error);
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        {
          error: error.response.data?.message || "Error al obtener membresías",
          details: error.response.data,
        },
        { status: error.response.status },
      );
    }
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
