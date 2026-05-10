/**
 * Authentication API client.
 * Handles communication with the federated login endpoint on the SERVIDOR
 * through the webapp's own API proxy route.
 */

import axios, { AxiosError } from "axios";

/** Shape returned by SERVIDOR's /api/ong/login on success. */
export interface FederatedLoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
    ongId: string;
  };
  token: string;
  ong_url: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  ong?: string;
}

export class AuthApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Calls the webapp's own `/api/login` proxy route which in turn
 * calls SERVIDOR → ORGServer federated login.
 */
export async function loginWithCredentials(
  payload: LoginPayload,
): Promise<FederatedLoginResponse> {
  try {
    const { data } = await axios.post<FederatedLoginResponse>(
      "/api/login",
      payload,
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data: errData, status } = error.response;
      throw new AuthApiError(
        errData?.error || "Error de autenticación",
        status,
        errData?.details,
      );
    }
    throw new AuthApiError("Error de conexión con el servidor", 0);
  }
}
