import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moderatorsApi } from "../api/moderators.api";
import { moderatorKeys } from "./useModerators";
import type { ApiError } from "@/lib/api/types";
import type {
  CreateModeratorRequest,
  Moderator,
} from "../types/moderators.types";

/**
 * Invite a moderator (POST /api/admin/moderators). On success the backend
 * emails a signed onboarding link; we refresh the list. Consumers handle
 * toasts via mutate's onSuccess/onError.
 */
export function useCreateModerator() {
  const queryClient = useQueryClient();

  return useMutation<Moderator, ApiError, CreateModeratorRequest>({
    mutationFn: moderatorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderatorKeys.lists() });
    },
  });
}
