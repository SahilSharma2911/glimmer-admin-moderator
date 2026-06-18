import { z } from "zod";

/**
 * Invite-moderator form validation. Mirrors the backend `CreateModeratorSchema`
 * (name 1–120 chars, valid email).
 */
export const inviteModeratorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or fewer"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email({ message: "Enter a valid email address" })),
});

export type InviteModeratorValues = z.infer<typeof inviteModeratorSchema>;
