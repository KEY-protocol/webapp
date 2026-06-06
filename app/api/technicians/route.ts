import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

/**
 * Resolves the ONG Server URL from the request headers or auth context.
 * The webapp stores ongUrl in localStorage; client passes it via x-ong-url header,
 * or we fall back to SERVIDOR_BASE_URL + resolution through it.
 *
 * For simplicity, we read the ONG server URL from the client header.
 * In production, this should be derived from server-side session.
 */
function getOngServerUrl(request: NextRequest): string {
  const headerUrl = request.headers.get("x-ong-url");
  if (headerUrl) return headerUrl;
  // Fallback: assume ONG server runs on port 3001 locally
  return process.env.ONG_SERVER_URL || "http://localhost:3001";
}

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("x-auth-token");
  return authHeader || null;
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

function handleProxyError(error: unknown): NextResponse {
  console.error("[/api/technicians] Proxy error:", error);
  if (error instanceof AxiosError && error.response) {
    return NextResponse.json(
      {
        error: error.response.data?.message || "Error del servidor ONG",
        details: error.response.data,
      },
      { status: error.response.status },
    );
  }
  const message =
    error instanceof Error ? error.message : "Error interno del servidor";
  return NextResponse.json({ error: message }, { status: 502 });
}

/**
 * GET /api/technicians
 * Lists all technicians from the ORGServer.
 */
export async function GET(request: NextRequest) {
  try {
    const baseUrl = getOngServerUrl(request);
    const { data } = await axios.get(`${baseUrl}/technicians`, {
      headers: buildHeaders(request),
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleProxyError(error);
  }
}
