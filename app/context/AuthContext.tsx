"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  /** Whether the initial auth check and stored state hydration is complete. */
  isInitializing: boolean;
  /** Stores the federated login response in context + localStorage. */
  setAuth: (response: FederatedLoginResponse) => void;
  /** Clears the federated auth state. */
  clearAuth: (reason?: string) => void;
}

const AUTH_STORAGE_KEY = "kp_auth";
const LAST_ACTIVITY_KEY = "kp_auth_last_activity";
const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutos de tolerancia

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

    // Verificar si la sesión ya expiró por inactividad acumulada
    const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (lastActivityStr) {
      const lastActivity = parseInt(lastActivityStr, 10);
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT_MS) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        return null;
      }
    }

    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    return null;
  }
}

/**
 * Wraps the application with NextAuth's SessionProvider and a
 * custom AuthContext for the federated credential-based login.
 *
 * Persists auth state to localStorage and enforces a 20-minute inactivity auto-logout.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ongUrl, setOngUrl] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const lastActivityRef = useRef<number>(0);


  const clearAuth = useCallback((_reason?: string) => {
    setUser(null);
    setToken(null);
    setOngUrl(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    }
  }, []);

  const setAuth = useCallback((response: FederatedLoginResponse) => {
    const authData = {
      user: response.user,
      token: response.token,
      ongUrl: response.ong_url,
    };
    const now = Date.now();
    setUser(authData.user);
    setToken(authData.token);
    setOngUrl(authData.ongUrl);
    lastActivityRef.current = now;
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
    }
  }, []);

  // Hydrate initial state
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
      setOngUrl(stored.ongUrl);
      const lastAct = localStorage.getItem(LAST_ACTIVITY_KEY);
      lastActivityRef.current = lastAct ? parseInt(lastAct, 10) : Date.now();
    }
    setIsInitializing(false);
  }, []);

  // Update last activity timestamp on user interaction
  const updateActivity = useCallback(() => {
    if (!user) return;
    const now = Date.now();
    // Throttle localStorage updates to max once every 10 seconds
    if (now - lastActivityRef.current > 10000) {
      lastActivityRef.current = now;
      if (typeof window !== "undefined") {
        localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
      }
    } else {
      lastActivityRef.current = now;
    }
  }, [user]);

  // Activity listeners & Inactivity timer
  useEffect(() => {
    if (!user) return;

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    const handleUserInteraction = () => updateActivity();

    events.forEach((event) => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    // Interval to check inactivity every 10 seconds
    const interval = setInterval(() => {
      const storedLastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
      const lastActivityTime = storedLastActivityStr
        ? parseInt(storedLastActivityStr, 10)
        : lastActivityRef.current;

      if (Date.now() - lastActivityTime >= INACTIVITY_TIMEOUT_MS) {
        clearAuth("inactivity");
      }
    }, 10000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
      clearInterval(interval);
    };
  }, [user, updateActivity, clearAuth]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      ongUrl,
      isAuthenticated: !!user && !!token,
      isInitializing,
      setAuth,
      clearAuth,
    }),
    [user, token, ongUrl, isInitializing, setAuth, clearAuth],
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

