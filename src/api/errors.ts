import axios from "axios";

export function getApiError(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
      return data.error;
    }
    if (error.response?.status === 404) return "Not found";
    if (!error.response) return "The server could not be reached.";
  }
  return fallback;
}

export function isNotFound(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
