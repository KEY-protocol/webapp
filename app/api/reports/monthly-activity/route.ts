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
  const headers: Record<string, string> = {};
  const token = getAuthToken(request);
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function handleProxyError(error: unknown): NextResponse {
  console.error("[/api/reports/monthly-activity] Proxy error:", error);
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

export async function GET(request: NextRequest) {
  try {
    const baseUrl = getOngServerUrl(request);
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period");
    const format = searchParams.get("format") || "json";

    if (!period) {
      return NextResponse.json(
        { error: "El parámetro period es requerido" },
        { status: 400 },
      );
    }

    const response = await axios.get(`${baseUrl}/reports/monthly-activity`, {
      headers: buildHeaders(request),
      params: { period, format },
      responseType: format === "json" ? "json" : "arraybuffer",
    });

    if (format !== "json") {
      const headers: Record<string, string> = {};
      if (response.headers["content-type"]) {
        headers["Content-Type"] = String(response.headers["content-type"]);
      }
      if (response.headers["content-disposition"]) {
        headers["Content-Disposition"] = String(response.headers["content-disposition"]);
      }
      return new NextResponse(response.data, {
        status: response.status,
        headers,
      });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    return handleProxyError(error);
  }
}
