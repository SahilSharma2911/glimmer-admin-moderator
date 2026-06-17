import { z } from "zod";

/**
 * Login form validation. Mirrors the backend contract:
 * email format + password min length 8.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email({ message: "Enter a valid email address" })),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
