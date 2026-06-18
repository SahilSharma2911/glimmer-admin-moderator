import type { ApiError } from "@/lib/api/types";

/** Maps a moderators API error code to a user-facing message. */
export function moderatorErrorMessage(error: ApiError | null): string {
  switch (error?.code) {
    case "EMAIL_ALREADY_EXISTS":
      return "A moderator with this email already exists.";
    case "EMAIL_SEND_FAILED":
      return "The invite email couldn't be sent. Please try again.";
    case "MODERATOR_NOT_FOUND":
      return "This moderator no longer exists. Refresh and try again.";
    case "MODERATOR_ALREADY_ONBOARDED":
      return "This moderator has already completed onboarding.";
    case "VALIDATION_ERROR":
      return "Please check the details and try again.";
    case "NETWORK_ERROR":
      return "Can't reach the server. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
