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
  process.env.NEXT_PUBLIC_CENTRAL_SERVER_URL ||
  process.env.SERVIDOR_BASE_URL ||
  "http://localhost:3000";

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
    let targetServerBase = centralBase;
    let authResponse: any = null;

    // Determinar si la autenticación es para una ONG descentralizada o para el Superadministrador (central)
    const isSpecificOrg = Boolean(ong && ong !== DEFAULT_ONG_ID && ong !== "key-protocol");

    if (isSpecificOrg) {
      let orgBase = cleanUrl(ONG_SERVER_URL);

      // Resolver dinámicamente la URL del servidor de la ONG consultando al servidor central
      try {
        const orgsResp = await axios.get(`${centralBase}/api/v1/ong/list`, {
          timeout: 4000,
        });
        const orgList = Array.isArray(orgsResp.data) ? orgsResp.data : [];
        const found = orgList.find(
          (o: any) => o.ongId === ong || o.id === ong || o.slug === ong,
        );
        if (found?.apiBaseUrl || found?.url) {
          orgBase = cleanUrl(found.apiBaseUrl || found.url);
        }
      } catch (discoveryErr: any) {
        console.warn(
          `[Login Proxy] No se pudo resolver URL para ONG '${ong}' vía discovery. Usando fallback (${orgBase}):`,
          discoveryErr?.message,
        );
      }

      targetServerBase = orgBase;

      // Autenticar contra el servidor de la ONG
      try {
        const resp = await axios.post(
          `${targetServerBase}/api/v1/auth/login`,
          credentials,
          {
            headers: {
              "Content-Type": "application/json",
              "x-ong-id": ong,
            },
            timeout: 10000,
          },
        );
        authResponse = resp.data;
      } catch (err: any) {
        // Fallback amistoso: si falla en la ONG y las credenciales son del superadmin central
        if (
          err.response?.status === 401 &&
          credentials.email.toLowerCase() === "general@key.com.ar"
        ) {
          try {
            const respCentral = await axios.post(
              `${centralBase}/api/v1/auth/login`,
              credentials,
              { headers: { "Content-Type": "application/json" }, timeout: 7000 },
            );
            authResponse = respCentral.data;
            targetServerBase = centralBase;
          } catch {
            throw err;
          }
        } else {
          throw err;
        }
      }
    } else {
      // Flujo de Superadministrador / KEY Protocol central
      try {
        const resp = await axios.post(
          `${centralBase}/api/v1/auth/login`,
          credentials,
          { headers: { "Content-Type": "application/json" }, timeout: 10000 },
        );
        authResponse = resp.data;
        targetServerBase = centralBase;
      } catch (err: any) {
        // Fallback: si el servidor central devuelve 401 o 404, intentar con el servidor local de ONG
        if (
          err.response?.status === 401 ||
          err.response?.status === 404 ||
          !err.response
        ) {
          const fallbackOrgBase = cleanUrl(ONG_SERVER_URL);
          const resp = await axios.post(
            `${fallbackOrgBase}/api/v1/auth/login`,
            credentials,
            {
              headers: {
                "Content-Type": "application/json",
                ...(ong ? { "x-ong-id": ong } : {}),
              },
              timeout: 10000,
            },
          );
          authResponse = resp.data;
          targetServerBase = fallbackOrgBase;
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
      ong_url: payload.ong_url || targetServerBase,
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
