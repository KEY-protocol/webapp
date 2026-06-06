/**
 * Preconfigured axios instance for internal API calls.
 * Automatically injects the ONG auth token and server URL
 * from localStorage into every request.
 */

import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

/** Attach auth headers from localStorage before each request. */
apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  try {
    const raw = localStorage.getItem("kp_auth");
    if (raw) {
      const auth = JSON.parse(raw);
      if (auth.token) {
        config.headers.set("x-auth-token", auth.token);
      }
      if (auth.ongUrl) {
        config.headers.set("x-ong-url", auth.ongUrl);
      }
    }
  } catch {
    // Ignore malformed data
  }

  return config;
});

export default apiClient;
