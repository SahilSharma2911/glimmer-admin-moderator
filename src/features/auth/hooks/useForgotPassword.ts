import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { ApiError } from "@/lib/api/types";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResult,
} from "../types/auth.types";

/**
 * Step 1 of password reset: request an OTP to the admin's email.
 * Backend returns a generic message (anti-enumeration) + a resend cooldown.
 */
export function useForgotPassword() {
  return useMutation<ForgotPasswordResult, ApiError, ForgotPasswordRequest>({
    mutationFn: authApi.forgotPassword,
  });
}
