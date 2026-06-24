import type { ApiError } from "@/lib/api/types";

/** Maps a change-password API error code to a user-facing message. */
export function changePasswordErrorMessage(error: ApiError | null): string {
  switch (error?.code) {
    case "INVALID_CREDENTIALS":
      return "Your current password is incorrect.";
    case "PASSWORD_SAME_AS_OLD":
      return "New password must be different from your current one.";
    case "PASSWORD_MISMATCH":
      return "New password and confirmation don't match.";
    case "ACCOUNT_NOT_ACTIVE":
      return "Your account isn't active. Contact an administrator.";
    case "VALIDATION_ERROR":
      return "Please check the details and try again.";
    case "NETWORK_ERROR":
      return "Can't reach the server. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
