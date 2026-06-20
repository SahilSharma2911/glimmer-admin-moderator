import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { moderationCasesApi } from "../api/moderation-cases.api";
import { tokenStore } from "@/lib/api/token";
import type { ListModerationCasesQuery } from "../types/moderation-cases.types";

/** Query-key factory for the moderation-cases feature. */
export const moderationCaseKeys = {
  all: ["admin", "moderation-cases"] as const,
  /** Prefix matching every paginated list query (for invalidation). */
  lists: () => [...moderationCaseKeys.all, "list"] as const,
  list: (query: ListModerationCasesQuery) =>
    [...moderationCaseKeys.all, "list", query] as const,
  stats: () => [...moderationCaseKeys.all, "stats"] as const,
  detail: (caseId: string) =>
    [...moderationCaseKeys.all, "detail", caseId] as const,
};

/**
 * List moderation cases (GET /api/admin/moderation-cases) with server-side
 * pagination, filtering, and search. Available to both ADMIN and MODERATOR.
 * Disabled when there's no token so it doesn't fire a guaranteed 401. Previous
 * page data is kept while the next page loads to avoid layout jumps.
 */
export function useModerationCases(query: ListModerationCasesQuery = {}) {
  return useQuery({
    queryKey: moderationCaseKeys.list(query),
    queryFn: () => moderationCasesApi.list(query),
    enabled: Boolean(tokenStore.get()),
    placeholderData: keepPreviousData,
  });
}
