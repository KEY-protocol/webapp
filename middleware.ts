import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Skip next-intl middleware for all API routes
  // NextAuth (/api/auth/*) and the login proxy (/api/login) need to work without locale prefixing
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // TODO: When protected routes are implemented, add auth checks here.
  // Example: check session and redirect unauthenticated users to login.
  // const session = await auth();
  // if (!session && isProtectedRoute(request.nextUrl.pathname)) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

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
