import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moderatorsApi } from "../api/moderators.api";
import { moderatorKeys } from "./useModerators";
import type { ApiError } from "@/lib/api/types";
import type {
  Moderator,
  UpdateModeratorRequest,
} from "../types/moderators.types";

interface UpdateModeratorVariables {
  moderatorId: string;
  body: UpdateModeratorRequest;
}

/**
 * Rename / suspend / reactivate a moderator
 * (PATCH /api/admin/moderators/{moderatorId}). On success we seed the detail
 * cache with the returned moderator and refresh the list.
 */
export function useUpdateModerator() {
  const queryClient = useQueryClient();

  return useMutation<Moderator, ApiError, UpdateModeratorVariables>({
    mutationFn: ({ moderatorId, body }) =>
      moderatorsApi.update(moderatorId, body),
    onSuccess: (moderator) => {
      queryClient.setQueryData(moderatorKeys.detail(moderator.id), moderator);
      queryClient.invalidateQueries({ queryKey: moderatorKeys.lists() });
    },
  });
}
