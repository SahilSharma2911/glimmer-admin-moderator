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
 * Change a case status (PATCH /api/admin/moderation-cases/{caseId}).
 *
 * MODERATOR-only — ADMIN receives a 403 (`ApiError.status === 403`). Gate the
 * triggering UI on `canEditCaseStatus(role)` / `useCurrentUser().isModerator`.
 * Invalid transitions (incl. re-applying the same status) return 409
 * `INVALID_TRANSITION`; use `nextStatuses(current)` to offer only valid targets.
 *
 * The PATCH returns the updated case scalars (no linked content), so on success
 * we merge them into the detail cache (preserving child/linked content) and
 * refresh the lists and stats (status counts shift).
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
      queryClient.invalidateQueries({ queryKey: moderationCaseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: moderationCaseKeys.stats() });
    },
  });
}
