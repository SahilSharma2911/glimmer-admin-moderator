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
  // POST /admin/auth/login
  login: (body: LoginRequest) =>
    apiRequest<AuthResult>({
      method: "POST",
      url: "/admin/auth/login",
      data: body,
    }),

  // POST /admin/auth/password/forgot
  forgotPassword: (body: ForgotPasswordRequest) =>
    apiRequest<ForgotPasswordResult>({
      method: "POST",
      url: "/admin/auth/password/forgot",
      data: body,
    }),

  // POST /admin/auth/password/verify-otp
  verifyOtp: (body: VerifyOtpRequest) =>
    apiRequest<VerifyOtpResult>({
      method: "POST",
      url: "/admin/auth/password/verify-otp",
      data: body,
    }),

  // POST /admin/auth/password/reset
  resetPassword: (body: ResetPasswordRequest) =>
    apiRequest<ResetPasswordResult>({
      method: "POST",
      url: "/admin/auth/password/reset",
      data: body,
    }),

  // POST /admin/auth/onboard (moderator onboarding — auto-login)
  onboard: (body: OnboardRequest) =>
    apiRequest<AuthResult>({
      method: "POST",
      url: "/admin/auth/onboard",
      data: body,
    }),

  // GET /admin/auth/me
  me: () =>
    apiRequest<AdminProfile>({
      method: "GET",
      url: "/admin/auth/me",
    }),
};
