import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moderationCasesApi } from "../api/moderation-cases.api";
import { moderationCaseKeys } from "./useModerationCases";
import type { ApiError } from "@/lib/api/types";
import type {
  ModerationCase,
  ModerationCaseDetail,
  UpdateModerationCaseStatusRequest,
} from "../types/moderation-cases.types";

interface UpdateModerationCaseStatusVariables {
  caseId: string;
  body: UpdateModerationCaseStatusRequest;
}

/**
 * Change a case status (PATCH /admin/moderation-cases/{caseId}).
 *
 * MODERATOR-only — ADMIN receives a 403 (`ApiError.status === 403`). Gate the
 * triggering UI on `canEditCaseStatus(role)` / `useCurrentUser().isModerator`.
 * Invalid transitions (incl. re-applying the same status) return 409
 * `INVALID_TRANSITION`; use `nextStatuses(current)` to offer only valid targets.
 *
 * The PATCH returns the updated case scalars (no linked content). MARK_SAFE /
 * REMOVE_CONTENT also mutate the underlying content (publish/delete), so we
 * optimistically merge the new scalars for an instant status update and then
 * refetch the detail (to pick up the changed linked content) along with the
 * lists and stats (status counts shift).
 */
export function useUpdateModerationCaseStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    ModerationCase,
    ApiError,
    UpdateModerationCaseStatusVariables
  >({
    mutationFn: ({ caseId, body }) =>
      moderationCasesApi.updateStatus(caseId, body),
    onSuccess: (updated) => {
      queryClient.setQueryData<ModerationCaseDetail>(
        moderationCaseKeys.detail(updated.id),
        (prev) => (prev ? { ...prev, ...updated } : prev),
      );
      // Refetch the detail so the linked-content blocks reflect a
      // publish/removal, plus the lists and stats whose counts shifted.
      queryClient.invalidateQueries({
        queryKey: moderationCaseKeys.detail(updated.id),
      });
      queryClient.invalidateQueries({ queryKey: moderationCaseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: moderationCaseKeys.stats() });
    },
  });
}
