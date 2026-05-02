import { handlers } from "@/auth";
import { NextRequest } from "next/server";

/**
 * NextAuth.js API Route Handler
 *
 * In Next.js 15+, dynamic route parameters are asynchronous (Promises).
 * We wrap the Auth.js handlers to satisfy the Next.js type system and
 * ensure compatibility with the App Router's expected signature.
 *
 * TODO: When the backend login endpoint is ready, integrate
 * the server-side authentication flow here to validate tokens
 * and sync user data with the backend.
 */

type RouteContext = {
  params: Promise<{ nextauth: string[] }>;
};

export async function GET(req: NextRequest, _context: RouteContext) {
  return handlers.GET(req);
}

export async function POST(req: NextRequest, _context: RouteContext) {
  return handlers.POST(req);
}

