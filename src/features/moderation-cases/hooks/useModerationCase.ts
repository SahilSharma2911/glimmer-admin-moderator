import { useQuery } from "@tanstack/react-query";
import { moderationCasesApi } from "../api/moderation-cases.api";
import { moderationCaseKeys } from "./useModerationCases";
import { tokenStore } from "@/lib/api/token";

/**
 * Get a single moderation case with its linked content
 * (GET /api/admin/moderation-cases/{caseId}). Available to both ADMIN and
 * MODERATOR. Opening a case is audited server-side (it exposes a child's
 * private content). Disabled without a token or a caseId.
 */
export function useModerationCase(caseId: string) {
  return useQuery({
    queryKey: moderationCaseKeys.detail(caseId),
    queryFn: () => moderationCasesApi.get(caseId),
    enabled: Boolean(tokenStore.get()) && Boolean(caseId),
  });
}
