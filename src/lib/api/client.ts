import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStore } from "./token";
import { ApiError, type ApiErrorBody, type ApiSuccess } from "./types";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** Shared axios instance for the Glimmers admin API. */
export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach the admin Bearer token (if present) to every request.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize all failures into ApiError; drop the token on 401.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        tokenStore.clear();
      }
      return Promise.reject(
        new ApiError(data?.error ?? "REQUEST_FAILED", status, data?.message),
      );
    }
    // No response → network/timeout/CORS.
    return Promise.reject(new ApiError("NETWORK_ERROR", 0, error.message));
  },
);

/**
 * Typed request helper that unwraps the `{ success, data }` envelope and
 * returns just `data`. Use this in feature API modules.
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<ApiSuccess<T>>(config);
  return response.data.data;
}
