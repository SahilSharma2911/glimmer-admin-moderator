import { z } from "zod";

/**
 * Change-password form. Mirrors the backend `AdminChangePasswordSchema`
 * (all fields ≥ 8 chars, new must match confirm). The "different from
 * current" rule is enforced server-side (PASSWORD_SAME_AS_OLD).
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
