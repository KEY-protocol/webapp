import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

/**
 * POST /api/login
 *
 * Server-side proxy that forwards login credentials to the SERVIDOR's
 * federated login endpoint (POST http://localhost:3000/api/ong/login).
 *
 * This avoids CORS issues (browser → same-origin → SERVIDOR)
 * and keeps the SERVIDOR URL out of client-side code.
 *
 * Expected body: { email: string; password: string; ong?: string }
 *
 * When `ong` is omitted (SUPERADMIN / ENCARGADO flow), the server
 * falls back to DEFAULT_ONG_ID from the environment.
 */

const SERVIDOR_BASE_URL =
  process.env.SERVIDOR_BASE_URL || "http://localhost:3000";

const DEFAULT_ONG_ID =
  process.env.DEFAULT_ONG_ID || "fundacion_gran_chaco";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, ong } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: email, password" },
        { status: 400 },
      );
    }

    const requestBody: { email: string; password: string; ong?: string } = { email, password };
    if (ong) {
      requestBody.ong = ong;
    }

    const { data: servidorData } = await axios.post(
      `${SERVIDOR_BASE_URL}/api/ong/login`,
      requestBody,
    );

    // SERVIDOR wraps success responses in { ok: true, data: { ... } }
    const payload = servidorData?.data || servidorData;

    return NextResponse.json({
      user: payload.user,
      token: payload.token,
      ong_url: payload.ong_url,
    });
  } catch (error) {
    console.error("[/api/login] Error:", error);

    if (error instanceof AxiosError && error.response) {
      // Forward the error from SERVIDOR/ORGServer as-is
      const remoteData = error.response.data;
      const errorMessage =
        remoteData?.error ||
        remoteData?.message ||
        "Error en la autenticación";
      return NextResponse.json(
        { error: errorMessage, details: remoteData?.details || null },
        { status: error.response.status },
      );
    }

    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json(
      { error: message },
      { status: 502 },
    );
  }
}
