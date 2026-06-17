/**
 * Shared types for the backend API envelope.
 * Every endpoint responds with `{ success, data }` on success
 * or `{ success: false, error }` on failure.
 */

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  /** Stable machine-readable code, e.g. "INVALID_CREDENTIALS". */
  error: string;
  /** Optional human-readable message. */
  message?: string;
}

/**
 * Normalized error thrown by the API client for any failed request.
 * `code` is the backend's `error` string (or a synthetic one for
 * network/unknown failures); `status` is the HTTP status (0 if none).
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, status: number, message?: string) {
    super(message ?? code);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}
