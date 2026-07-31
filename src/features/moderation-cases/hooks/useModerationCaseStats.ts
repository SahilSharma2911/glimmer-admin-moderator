import { useQuery } from "@tanstack/react-query";
import { moderationCasesApi } from "../api/moderation-cases.api";
import { moderationCaseKeys } from "./useModerationCases";
import { tokenStore } from "@/lib/api/token";

/**
 * Dashboard case stats (GET /admin/moderation-cases/stats) — totals plus
 * breakdowns by status, case type, and S-code flag for the dashboard cards.
 * Available to both ADMIN and MODERATOR. Disabled without a token.
 */
export function useModerationCaseStats() {
  return useQuery({
    queryKey: moderationCaseKeys.stats(),
    queryFn: () => moderationCasesApi.stats(),
    enabled: Boolean(tokenStore.get()),
  });
}
