import axios, { type AxiosError } from "axios";

import { useAuthStore } from "@/store/useAuthStore";

const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://spacey.cs403bkk26.space";

/**
 * In development the Vite server proxies `/api` to VITE_API_BASE_URL.
 * The Spacey API authenticates with an HttpOnly session cookie and does not
 * send CORS headers, so the browser has to call it as a same-origin path.
 */
export const apiBaseURL = import.meta.env.DEV ? "/api" : configuredBaseUrl;

export const axiosClient = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const isCredentialAttempt = url.includes("/login") || url.includes("/register");

    if (status === 401 && !isCredentialAttempt) {
      useAuthStore.getState().logout();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);
