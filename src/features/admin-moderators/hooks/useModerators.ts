import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { moderatorsApi } from "../api/moderators.api";
import { tokenStore } from "@/lib/api/token";
import type { ListModeratorsQuery } from "../types/moderators.types";

/** Query-key factory for the moderators feature. */
export const moderatorKeys = {
  all: ["admin", "moderators"] as const,
  /** Prefix matching every paginated list query (for invalidation). */
  lists: () => [...moderatorKeys.all, "list"] as const,
  list: (query: ListModeratorsQuery) =>
    [...moderatorKeys.all, "list", query] as const,
  detail: (moderatorId: string) =>
    [...moderatorKeys.all, "detail", moderatorId] as const,
};

/**
 * List moderators (GET /admin/moderators) with server-side pagination and
 * search. Disabled when there's no token so it doesn't fire a guaranteed 401.
 * Previous page data is kept while the next page loads to avoid layout jumps.
 */
export function useModerators(query: ListModeratorsQuery = {}) {
  return useQuery({
    queryKey: moderatorKeys.list(query),
    queryFn: () => moderatorsApi.list(query),
    enabled: Boolean(tokenStore.get()),
    placeholderData: keepPreviousData,
  });
}
