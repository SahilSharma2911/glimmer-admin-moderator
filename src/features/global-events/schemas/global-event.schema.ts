import { z } from "zod";

/**
 * Create/edit form validation. Mirrors the backend `CreateGlobalEventSchema`
 * (name 1–120, description 1–2000) plus a client-only guard that the moment is
 * scheduled in the future — a past `scheduledAt` would make the event LIVE/ENDED
 * immediately and non-editable.
 *
 * `scheduledAt` is the raw value from a `<input type="datetime-local">`
 * (local wall-clock, e.g. "2026-07-01T19:00"); convert it to ISO before sending.
 */
export const globalEventSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or fewer"),
  scheduledAt: z
    .string()
    .min(1, "Pick a date and time")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "Invalid date")
    .refine(
      (v) => new Date(v).getTime() > Date.now(),
      "Schedule the moment in the future",
    ),
});

export type GlobalEventFormValues = z.infer<typeof globalEventSchema>;
