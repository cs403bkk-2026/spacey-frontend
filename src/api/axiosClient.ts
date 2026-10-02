import axios, { type AxiosError } from "axios";

import { appBasename } from "@/lib/app-path";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Development calls go through the Vite proxy at `/api`, which forwards to
 * VITE_API_BASE_URL. Production calls are origin-relative (`/spaces`, `/login`)
 * so the session cookie is sent to Spacey on the same host. Traefik only sends
 * `/app` to this container, so those API paths stay on Spacey.
 */
export const apiBaseURL = import.meta.env.DEV ? "/api" : "";

const loginPath = `${appBasename}/login`;

export const axiosClient = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const isCredentialAttempt = url.includes("/login") || url.includes("/register");

    if (status === 401 && !isCredentialAttempt) {
      useAuthStore.getState().logout();
      if (!window.location.pathname.startsWith(loginPath)) {
        window.location.assign(loginPath);
      }
    }

    return Promise.reject(error);
  },
);
