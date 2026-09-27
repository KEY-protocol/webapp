import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

const SERVIDOR_BASE_URL =
  process.env.SERVIDOR_BASE_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "El token de confirmación es requerido." },
        { status: 400 },
      );
    }

    const endpoint = `${SERVIDOR_BASE_URL}/api/v1/auth/confirm-email?token=${encodeURIComponent(
      token,
    )}`;

    const { data } = await axios.get(endpoint);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/confirm-email] Error:", error);

    if (error instanceof AxiosError && error.response) {
      const remoteData = error.response.data;
      const errorMessage =
        remoteData?.message ||
        remoteData?.error ||
        "Error al confirmar la casilla de correo.";
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response.status },
      );
    }

    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
