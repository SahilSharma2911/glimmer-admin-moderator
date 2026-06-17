import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { ApiError } from "@/lib/api/types";
import type {
  ResetPasswordRequest,
  ResetPasswordResult,
} from "../types/auth.types";

/**
 * Step 3 of password reset: set a new password using the `resetToken`
 * from verify-otp. The admin must log in again afterwards.
 */
export function useResetPassword() {
  return useMutation<ResetPasswordResult, ApiError, ResetPasswordRequest>({
    mutationFn: authApi.resetPassword,
  });
}
