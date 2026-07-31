export type AdminRole = "ADMIN" | "MODERATOR";

/** Auth payload returned by login and onboard (auto-login). */
export interface AuthResult {
  adminToken: string;
  adminId: string;
  role: AdminRole;
}

// POST /admin/auth/login
export interface LoginRequest {
  email: string;
  password: string;
}

// POST /admin/auth/password/forgot
export interface ForgotPasswordRequest {
  email: string;
}
export interface ForgotPasswordResult {
  message: string;
  resendAvailableInSeconds: number;
}

// POST /admin/auth/password/verify-otp
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}
export interface VerifyOtpResult {
  resetToken: string;
  expiresInSeconds: number;
}

// POST /admin/auth/password/reset
export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}
export interface ResetPasswordResult {
  message: string;
}

// POST /admin/auth/onboard (moderator first-time password via invite)
export interface OnboardRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// GET /admin/auth/me
export interface AdminProfile {
  adminId: string;
  email: string;
  name: string | null;
  role: AdminRole;
}
