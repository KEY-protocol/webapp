"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { FederatedLoginResponse } from "@/app/lib/auth-api";

/** Authenticated user from the federated login. */
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  ongId: string;
}

interface AuthState {
  /** The authenticated user, or null if not logged in. */
  user: AuthUser | null;
  /** The JWT access token issued by the ORGServer. */
  token: string | null;
  /** The resolved URL of the user's ONG server. */
  ongUrl: string | null;
  /** Whether the user is authenticated. */
  isAuthenticated: boolean;
  /** Stores the federated login response in context + localStorage. */
  setAuth: (response: FederatedLoginResponse) => void;
  /** Clears the federated auth state. */
  clearAuth: () => void;
}

const AUTH_STORAGE_KEY = "kp_auth";

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/** Reads persisted auth data from localStorage (safe for SSR). */
function getStoredAuth(): { user: AuthUser; token: string; ongUrl: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

/**
 * Wraps the application with NextAuth's SessionProvider and a
 * custom AuthContext for the federated credential-based login.
 *
 * The federated auth state (user + token) is persisted to
 * localStorage so it survives page refreshes.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Lazy initializer: reads localStorage once on first render (no effect needed)
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuth()?.user ?? null);
  const [token, setToken] = useState<string | null>(() => getStoredAuth()?.token ?? null);
  const [ongUrl, setOngUrl] = useState<string | null>(() => getStoredAuth()?.ongUrl ?? null);

  const setAuth = useCallback((response: FederatedLoginResponse) => {
    const authData = {
      user: response.user,
      token: response.token,
      ongUrl: response.ong_url,
    };
    setUser(authData.user);
    setToken(authData.token);
    setOngUrl(authData.ongUrl);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    setOngUrl(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      ongUrl,
      isAuthenticated: !!user && !!token,
      setAuth,
      clearAuth,
    }),
    [user, token, ongUrl, setAuth, clearAuth],
  );

  return (
    <NextAuthSessionProvider>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </NextAuthSessionProvider>
  );
}

/**
 * Hook to access the federated auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
