import { useMutation } from "@tanstack/react-query";
import { settingsApi } from "../api/settings.api";
import type { ApiError } from "@/lib/api/types";
import type {
  ChangePasswordRequest,
  ChangePasswordResult,
} from "../types/settings.types";

/**
 * Change the signed-in admin's password. The session token stays valid, so
 * there's nothing to refetch — consumers read `mutate`/`isPending`/`error`.
 */
export function useChangePassword() {
  return useMutation<ChangePasswordResult, ApiError, ChangePasswordRequest>({
    mutationFn: settingsApi.changePassword,
  });
}
