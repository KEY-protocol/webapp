import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Rutas exclusivas para el rol ADMIN (Plataforma Global)
const ADMIN_ROUTES = [
  "/organizations",
  "/managers",
  "/admin-audit",
  "/admin-forms",
];

// Rutas exclusivas para usuarios de ONG (USER / ENCARGADO)
const USER_ROUTES = [
  "/home",
  "/technicians",
  "/audit-evidence",
  "/mobile-form-preview",
  "/dashboard",
  "/reports",
  "/training",
  "/ai-agents",
];

/** Extrae el rol del usuario desde el JWT sin firma */
function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const jsonString =
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(jsonString);
    return payload.role ? String(payload.role).toUpperCase() : null;
  } catch {
    return null;
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip next-intl middleware for all API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const localeMatch = pathname.match(/^\/(es|en)(\/|$)/);
  const localePrefix = localeMatch ? `/${localeMatch[1]}` : "";
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    pathname.includes(route)
  );
  const isUserRoute = USER_ROUTES.some((route) => pathname.includes(route));

  if (isAdminRoute || isUserRoute) {
    const token = request.cookies.get("kp_token")?.value;

    // 1. Si no hay token de sesión, redirigir al login principal (/)
    if (!token) {
      const loginUrl = new URL(`${localePrefix}/`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = getRoleFromToken(token);

    // Normalize role string comparison
    const isAdminRole = userRole?.trim().toUpperCase() === "ADMIN";

    // 2. ADMIN intentando acceder a rutas de ONG (/technicians, /home, etc.) -> redirigir a /organizations
    if (isAdminRole && isUserRoute) {
      const adminDefaultUrl = new URL(
        `${localePrefix}/organizations`,
        request.url
      );
      return NextResponse.redirect(adminDefaultUrl);
    }

    // 3. USER intentando acceder a rutas de ADMIN (/organizations, etc.) -> redirigir a /home
    if (!isAdminRole && isAdminRoute) {
      const userDefaultUrl = new URL(`${localePrefix}/home`, request.url);
      return NextResponse.redirect(userDefaultUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next (Next.js internals)
     * - _vercel (Vercel internals)
     * - Static files (svg, png, jpg, jpeg, gif, webp, ico, css, js)
     */
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
