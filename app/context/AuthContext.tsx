"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps the application with NextAuth's SessionProvider so that
 * useSession() can be used anywhere in the client component tree.
 *
 * TODO: When backend is ready, extend this provider to sync
 * the NextAuth session with your backend's user context.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
