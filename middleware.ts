import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next (Next.js internals)
     * - _vercel (Vercel internals)
     * - Static files (svg, png, jpg, jpeg, gif, webp, ico, css, js)
     */
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
