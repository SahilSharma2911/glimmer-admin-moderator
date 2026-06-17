import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { ApiError } from "@/lib/api/types";
import type { VerifyOtpRequest, VerifyOtpResult } from "../types/auth.types";

/**
 * Step 2 of password reset: verify the emailed OTP. On success returns a
 * short-lived `resetToken` to pass to the reset-password step.
 */
export function useVerifyOtp() {
  return useMutation<VerifyOtpResult, ApiError, VerifyOtpRequest>({
    mutationFn: authApi.verifyOtp,
  });
}
