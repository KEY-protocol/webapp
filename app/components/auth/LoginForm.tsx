"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LoginFormActions } from "./LoginFormActions";
// TODO: Remove DevCredentialsPanel import before production deployment.
import { DevCredentialsPanel } from "./DevCredentialsPanel";
import { OngSelectionModal } from "./OngSelectionModal";
import {
  loginWithCredentials,
  AuthApiError,
  type FederatedLoginResponse,
} from "@/app/lib/auth-api";
import { useAuth } from "@/app/context/AuthContext";

/**
 * Roles that bypass the ONG selection modal.
 *
 * - SUPERADMIN: manages the entire platform, creates ADMIN users for ONGs.
 * - ENCARGADO: already pre-assigned to a specific ONG by the ADMIN who
 *   created their account, so they don't need to choose.
 */
const ROLES_WITHOUT_ONG_SELECTION = ["SUPERADMIN", "ENCARGADO"];

/**
 * Login form component containing email and password fields.
 *
 * Role hierarchy:
 * - SUPERADMIN creates ADMIN users and assigns them to one or more ONGs.
 * - ADMIN logs in and selects which ONG to administer (may manage several).
 * - ADMIN creates ENCARGADO users scoped to a specific ONG.
 * - ENCARGADO logs in and is taken directly to their assigned ONG's view.
 *
 * Post-login flow:
 * 1. User enters email + password and submits.
 * 2. Credentials are sent to the federated login proxy (no ONG needed).
 * 3. ADMIN → ONG selection modal appears (they choose which ONG to work in).
 * 4. SUPERADMIN → redirect to /organizations (their home view).
 * 5. ENCARGADO → redirect to /home directly.
 */
export function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state: holds the login response while waiting for ONG selection
  const [pendingAuth, setPendingAuth] = useState<FederatedLoginResponse | null>(
    null,
  );
  const [isModalLoading, setIsModalLoading] = useState(false);

  /**
   * TODO: Remove this handler before production deployment.
   * It enables auto-filling credentials from the DevCredentialsPanel.
   */
  const handleDevCredentialSelect = (devEmail: string, devPassword: string) => {
    setEmail(devEmail);
    setPassword(devPassword);
  };

  /**
   * Completes the login by storing auth data and redirecting.
   * Superadmin goes to /organizations (their only view).
   * Everyone else goes to /home.
   */
  const completeLogin = (response: FederatedLoginResponse) => {
    setAuth(response);
    const isSuperadmin = response.user.role.toUpperCase() === "SUPERADMIN";
    router.push(isSuperadmin ? "/organizations" : "/home");
  };

  /**
   * Handles the login form submission.
   * Sends credentials without ONG — the proxy uses a default.
   * After login, checks the user's role to decide the next step.
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
      });

      const userRole = response.user.role.toUpperCase();

      if (ROLES_WITHOUT_ONG_SELECTION.includes(userRole)) {
        // SUPERADMIN → global access, no ONG context needed
        // ENCARGADO → pre-assigned to a specific ONG by the ADMIN
        completeLogin(response);
      } else {
        // ADMIN → may administer multiple ONGs, must choose one
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
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              disabled={isLoading}
              className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* TODO: Remove DevCredentialsPanel before production deployment. */}
        {process.env.NODE_ENV !== "production" && (
          <DevCredentialsPanel onSelectCredential={handleDevCredentialSelect} />
        )}
      </form>

      {/* ONG Selection Modal — only shown for ADMIN role after login */}
      {pendingAuth && (
        <OngSelectionModal
          onConfirm={handleOngConfirm}
          isLoading={isModalLoading}
        />
      )}
    </>
  );
}
