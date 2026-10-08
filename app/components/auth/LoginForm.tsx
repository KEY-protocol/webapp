"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LoginFormActions } from "./LoginFormActions";
import { OngSelectionModal } from "./OngSelectionModal";
import {
  loginWithCredentials,
  AuthApiError,
  type FederatedLoginResponse,
} from "@/app/lib/auth-api";
import { useAuth } from "@/app/context/AuthContext";
import { PasswordInput } from "@/app/components/ui/PasswordInput";
import { organizationsService } from "@/app/services/organizationsService";

/**
 * Roles that bypass the ONG selection modal.
 */
const ROLES_WITHOUT_ONG_SELECTION = ["ADMIN"];

/**
 * Login form component containing organization selector, email and password fields.
 *
 * Flujo descentralizado:
 * - Superadmin selecciona "KEY Protocol (Superadministrador)" e ingresa a /organizations.
 * - Usuarios de ONGs seleccionan su respectiva organización e ingresan directamente a /home.
 */
export function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const { setAuth } = useAuth();

  const [selectedOng, setSelectedOng] = useState("key-protocol");
  const [orgList, setOrgList] = useState<Array<{ id: string; name: string }>>([
    { id: "key-protocol", name: "KEY Protocol (Superadministrador)" },
  ]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state fallback si se requiere re-selección
  const [pendingAuth, setPendingAuth] = useState<FederatedLoginResponse | null>(
    null,
  );
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadOrgs() {
      setLoadingOrgs(true);
      try {
        const data = await organizationsService.getPublicOrganizations();
        if (!isMounted) return;
        const active = (data || [])
          .filter((o) => o.isActive !== false && o.ongId !== "key-protocol")
          .map((o) => ({ id: o.ongId, name: o.name }));

        setOrgList([
          { id: "key-protocol", name: "KEY Protocol (Superadministrador)" },
          ...active,
        ]);
      } catch (err) {
        console.warn("No se pudieron cargar las organizaciones públicas:", err);
      } finally {
        if (isMounted) setLoadingOrgs(false);
      }
    }
    loadOrgs();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Completes the login by storing auth data and redirecting.
   * Admin goes to /organizations (their only view).
   * Everyone else goes to /home.
   */
  const completeLogin = (response: FederatedLoginResponse) => {
    setAuth(response);
    const isAdmin = response.user.role.toUpperCase() === "ADMIN";
    const targetPath = isAdmin ? "/organizations" : "/home";
    if (typeof window !== "undefined") {
      window.location.href = targetPath;
    } else {
      router.push(targetPath);
    }
  };

  /**
   * Handles the login form submission.
   * Sends credentials together with the selected organization.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError(t("errorMissingFields"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginWithCredentials({
        email: email.trim(),
        password,
        ong: selectedOng,
      });

      const userRole = response.user.role.toUpperCase();

      // Si el usuario ya eligió una ONG específica en el formulario, o es ADMIN, completar login directamente
      if (ROLES_WITHOUT_ONG_SELECTION.includes(userRole) || selectedOng !== "key-protocol") {
        completeLogin(response);
      } else {
        // En caso excepcional donde un USER se logueó bajo key-protocol
        setPendingAuth(response);
      }
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.status === 401) {
          setError(t("errorInvalidCredentials"));
        } else if (err.status === 404) {
          setError(t("errorOngNotFound"));
        } else if (err.status === 502 || err.status === 504) {
          setError(t("errorServerUnavailable"));
        } else if (err.status === 429) {
          setError(t("errorTooManyAttempts"));
        } else {
          setError(err.message);
        }
      } else {
        setError(t("errorGeneric"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Called when the ADMIN confirms which ONG they want to administer.
   * Re-authenticates with the selected ONG to get a token scoped to it.
   * The ADMIN may manage several ONGs, but only works in one at a time.
   */
  const handleOngConfirm = async (ongId: string) => {
    setIsModalLoading(true);

    try {
      // Re-login with the selected ONG to get a token scoped to that ONG
      const response = await loginWithCredentials({
        email: email.trim(),
        password,
        ong: ongId,
      });

      completeLogin(response);
    } catch {
      // If re-auth with selected ONG fails, fall back to the initial auth
      if (pendingAuth) {
        completeLogin(pendingAuth);
      }
    } finally {
      setIsModalLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-8">
        <div className="space-y-6">
          {/* Organization Selector */}
          <div className="space-y-2">
            <label
              htmlFor="login-ong"
              className="block text-sm font-poppins text-white ml-1"
            >
              {t("organizationLabel")}
            </label>
            <div className="relative">
              <select
                id="login-ong"
                value={selectedOng}
                onChange={(e) => setSelectedOng(e.target.value)}
                disabled={isLoading || loadingOrgs}
                className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer pr-10"
              >
                {orgList.map((org) => (
                  <option
                    key={org.id}
                    value={org.id}
                    className="bg-[#0d1a0a] text-white"
                  >
                    {org.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="block text-sm font-poppins text-white ml-1"
            >
              {t("emailLabel")}
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              disabled={isLoading}
              className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="login-password"
              className="block text-sm font-poppins text-white ml-1"
            >
              {t("passwordLabel")}
            </label>
            <PasswordInput
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              disabled={isLoading}
              className="w-full bg-[#1a2b15] border border-white/10 rounded-xl py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-poppins rounded-xl px-4 py-3 animate-in fade-in duration-200"
            >
              {error}
            </div>
          )}
        </div>

        <LoginFormActions isLoading={isLoading} />
      </form>

      {/* ONG Selection Modal — only shown for ADMIN role after login */}
      {pendingAuth && (
        <OngSelectionModal
          onConfirm={handleOngConfirm}
          isLoading={isModalLoading}
          defaultOngId={pendingAuth.user?.ongId}
        />
      )}
    </>
  );
}
