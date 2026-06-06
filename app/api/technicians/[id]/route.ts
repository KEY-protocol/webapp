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

function handleProxyError(error: unknown): NextResponse {
  console.error("[/api/technicians/[id]] Proxy error:", error);
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
 * GET /api/technicians/[id]
 * Fetch a single technician with image URLs.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const baseUrl = getOngServerUrl(request);
    const { data } = await axios.get(`${baseUrl}/technicians/${id}`, {
      headers: buildHeaders(request),
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleProxyError(error);
  }
}

/**
 * PATCH /api/technicians/[id]
 * Update a technician's data.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const baseUrl = getOngServerUrl(request);
    const body = await request.json();
    const { data } = await axios.patch(`${baseUrl}/technicians/${id}`, body, {
      headers: buildHeaders(request),
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleProxyError(error);
  }
}

/**
 * DELETE /api/technicians/[id]
 * Delete a technician.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const baseUrl = getOngServerUrl(request);
    const { data } = await axios.delete(`${baseUrl}/technicians/${id}`, {
      headers: buildHeaders(request),
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleProxyError(error);
  }
}
