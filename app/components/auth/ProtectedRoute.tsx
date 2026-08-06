"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      // Extraer el prefijo de idioma si existe (/es/home -> /es)
      const segments = pathname.split("/").filter(Boolean);
      const localePrefix = segments.length > 0 && (segments[0] === "es" || segments[0] === "en")
        ? `/${segments[0]}`
        : "";

      router.replace(localePrefix || "/");
    }
  }, [isAuthenticated, isInitializing, router, pathname]);

  if (isInitializing) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
