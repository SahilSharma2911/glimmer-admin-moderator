import { z } from "zod";

/** Step 1 — request an OTP to the admin's email. */
export const requestResetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email({ message: "Enter a valid email address" })),
});
export type RequestResetValues = z.infer<typeof requestResetSchema>;

/** Step 2 — verify the 6-digit OTP. */
export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "Code is required")
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
});
export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;

/** Step 3 — set the new password (with confirmation match). */
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
