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

export async function GET(request: NextRequest) {
  try {
    const baseUrl = getOngServerUrl(request);
    const { data } = await axios.get(`${baseUrl}/courses`, {
      headers: buildHeaders(request),
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/courses] Proxy error:", error);
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Error del servidor ONG" },
        { status: error.response.status },
      );
    }
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
