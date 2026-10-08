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
 * When `ong` is omitted (ADMIN / ENCARGADO flow), the server
 * falls back to DEFAULT_ONG_ID from the environment.
 */

const SERVIDOR_BASE_URL =
  process.env.SERVIDOR_BASE_URL || "http://localhost:3000";

const DEFAULT_ONG_ID =
  process.env.DEFAULT_ONG_ID || "key-protocol";

const ONG_SERVER_URL =
  process.env.ONG_SERVER_URL || "http://localhost:3001";

function cleanUrl(url: string): string {
  return url.replace(/\/api(\/v1)?\/?$/, "").replace(/\/$/, "");
}

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

    const credentials = {
      email: String(email).trim(),
      password: String(password),
    };

    const centralBase = cleanUrl(SERVIDOR_BASE_URL);
    const orgBase = cleanUrl(ONG_SERVER_URL);

    let authResponse: any = null;

    // If an explicit organization other than default was requested, try org server first
    const isSpecificOrg = Boolean(ong && ong !== DEFAULT_ONG_ID);

    if (isSpecificOrg) {
      try {
        const resp = await axios.post(
          `${orgBase}/api/v1/auth/login`,
          credentials,
          {
            headers: {
              "Content-Type": "application/json",
              ...(ong ? { "x-ong-id": ong } : {}),
            },
          },
        );
        authResponse = resp.data;
      } catch (err: any) {
        // Fallback to central server if org server returns 401 or 404
        if (err.response?.status === 401 || err.response?.status === 404) {
          const resp = await axios.post(
            `${centralBase}/api/v1/auth/login`,
            credentials,
            { headers: { "Content-Type": "application/json" } },
          );
          authResponse = resp.data;
        } else {
          throw err;
        }
      }
    } else {
      // Default: try central server first
      try {
        const resp = await axios.post(
          `${centralBase}/api/v1/auth/login`,
          credentials,
          { headers: { "Content-Type": "application/json" } },
        );
        authResponse = resp.data;
      } catch (err: any) {
        // If central server returns 401 or 404 or connection error, fallback to org server
        if (
          err.response?.status === 401 ||
          err.response?.status === 404 ||
          !err.response
        ) {
          const resp = await axios.post(
            `${orgBase}/api/v1/auth/login`,
            credentials,
            {
              headers: {
                "Content-Type": "application/json",
                ...(ong ? { "x-ong-id": ong } : {}),
              },
            },
          );
          authResponse = resp.data;
        } else {
          throw err;
        }
      }
    }

    // Backend may return { accessToken, user, ... } or { data: { ... } }
    const payload = authResponse?.data || authResponse;
    const token = payload?.accessToken || payload?.token;
    const user = payload?.user;

    if (!token || !user) {
      return NextResponse.json(
        { error: "Respuesta de autenticación inválida del servidor" },
        { status: 502 },
      );
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ongId: user.ongId || ong || DEFAULT_ONG_ID,
        ...(user.organizationId ? { organizationId: user.organizationId } : {}),
        ...(user.emailVerified !== undefined ? { emailVerified: user.emailVerified } : {}),
      },
      token: token,
      accessToken: token,
      ong_url: payload.ong_url || orgBase,
    });

    response.cookies.set("kp_token", token, {
      path: "/",
      httpOnly: false,
      maxAge: 86400,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("[/api/login] Error:", error);

    if (error instanceof AxiosError && error.response) {
      const remoteData = error.response.data;
      const errorMessage =
        remoteData?.message ||
        remoteData?.error ||
        "Error en la autenticación";
      const displayMessage = Array.isArray(errorMessage)
        ? errorMessage.join(", ")
        : errorMessage;

      return NextResponse.json(
        { error: displayMessage, details: remoteData?.details || null },
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
