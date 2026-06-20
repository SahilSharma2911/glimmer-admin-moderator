import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { globalEventsApi } from "../api/global-events.api";
import { tokenStore } from "@/lib/api/token";
import type { ListGlobalEventsQuery } from "../types/global-events.types";

/** Query-key factory for the global-events feature. */
export const globalEventKeys = {
  all: ["admin", "global-events"] as const,
  /** Prefix matching every paginated list query (for invalidation). */
  lists: () => [...globalEventKeys.all, "list"] as const,
  list: (query: ListGlobalEventsQuery) =>
    [...globalEventKeys.all, "list", query] as const,
  /** Per-status total counts (kept under `list` so mutations invalidate them). */
  count: (status: string) =>
    [...globalEventKeys.lists(), "count", status] as const,
  detail: (eventId: string) =>
    [...globalEventKeys.all, "detail", eventId] as const,
};

/**
 * List global events (GET /api/admin/global-events) with server-side
 * pagination, status filtering, and name search. Disabled without a token so
 * it doesn't fire a guaranteed 401. Previous page data is kept while the next
 * page loads to avoid layout jumps.
 */
export function useGlobalEvents(query: ListGlobalEventsQuery = {}) {
  return useQuery({
    queryKey: globalEventKeys.list(query),
    queryFn: () => globalEventsApi.list(query),
    enabled: Boolean(tokenStore.get()),
    placeholderData: keepPreviousData,
  });
}
