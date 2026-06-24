import type { ApiError } from "@/lib/api/types";

/** Maps a moderation-cases API error code to a user-facing message. */
export function moderationCaseErrorMessage(error: ApiError | null): string {
  switch (error?.code) {
    case "CASE_NOT_FOUND":
      return "This case no longer exists. Refresh and try again.";
    case "INVALID_TRANSITION":
      return "That status change isn't allowed from the current status.";
    case "CONTENT_NOT_ACTIONABLE":
      return "This case has no content to act on (e.g. a Lumiri chat or report), so it can't be marked safe or removed.";
    case "FORBIDDEN":
      return "Only moderators can change a case status.";
    case "VALIDATION_ERROR":
      return "Please check the details and try again.";
    case "NETWORK_ERROR":
      return "Can't reach the server. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
