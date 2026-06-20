import type { ApiError } from "@/lib/api/types";

/** Maps a global-events API error code to a user-facing message. */
export function globalEventErrorMessage(error: ApiError | null): string {
  switch (error?.code) {
    case "EVENT_NOT_FOUND":
      return "This event no longer exists. Refresh and try again.";
    case "EVENT_NOT_EDITABLE":
      return "This event has already started and can no longer be edited.";
    case "EVENT_NOT_DELETABLE":
      return "This event has already started and can no longer be deleted.";
    case "FORBIDDEN":
      return "Only admins can manage global events.";
    case "VALIDATION_ERROR":
      return "Please check the details and try again.";
    case "NETWORK_ERROR":
      return "Can't reach the server. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
