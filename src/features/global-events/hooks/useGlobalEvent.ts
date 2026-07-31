import { useQuery } from "@tanstack/react-query";
import { globalEventsApi } from "../api/global-events.api";
import { globalEventKeys } from "./useGlobalEvents";
import { tokenStore } from "@/lib/api/token";

/**
 * Get a single global event (GET /admin/global-events/{eventId}).
 * Disabled without a token or an id (e.g. before a row is selected). The
 * derived `status` / `totalJoined` are recomputed by the backend on each read.
 */
export function useGlobalEvent(eventId: string) {
  return useQuery({
    queryKey: globalEventKeys.detail(eventId),
    queryFn: () => globalEventsApi.get(eventId),
    enabled: Boolean(tokenStore.get()) && Boolean(eventId),
  });
}
