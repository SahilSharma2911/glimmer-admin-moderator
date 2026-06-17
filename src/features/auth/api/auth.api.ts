import { apiRequest } from "@/lib/api/client";
import type {
  AdminProfile,
  AuthResult,
  ForgotPasswordRequest,
  ForgotPasswordResult,
  LoginRequest,
  OnboardRequest,
  ResetPasswordRequest,
  ResetPasswordResult,
  VerifyOtpRequest,
  VerifyOtpResult,
} from "../types/auth.types";

/**
 * Admin auth endpoints. Each function returns the unwrapped `data`
 * payload (the `{ success, data }` envelope is handled by apiRequest).
 */
export const authApi = {
  // POST /api/admin/auth/login
  login: (body: LoginRequest) =>
    apiRequest<AuthResult>({
      method: "POST",
      url: "/api/admin/auth/login",
      data: body,
    }),

  // POST /api/admin/auth/password/forgot
  forgotPassword: (body: ForgotPasswordRequest) =>
    apiRequest<ForgotPasswordResult>({
      method: "POST",
      url: "/api/admin/auth/password/forgot",
      data: body,
    }),

  // POST /api/admin/auth/password/verify-otp
  verifyOtp: (body: VerifyOtpRequest) =>
    apiRequest<VerifyOtpResult>({
      method: "POST",
      url: "/api/admin/auth/password/verify-otp",
      data: body,
    }),

  // POST /api/admin/auth/password/reset
  resetPassword: (body: ResetPasswordRequest) =>
    apiRequest<ResetPasswordResult>({
      method: "POST",
      url: "/api/admin/auth/password/reset",
      data: body,
    }),

  // POST /api/admin/auth/onboard (moderator onboarding — auto-login)
  onboard: (body: OnboardRequest) =>
    apiRequest<AuthResult>({
      method: "POST",
      url: "/api/admin/auth/onboard",
      data: body,
    }),

  // GET /api/admin/auth/me
  me: () =>
    apiRequest<AdminProfile>({
      method: "GET",
      url: "/api/admin/auth/me",
    }),
};
