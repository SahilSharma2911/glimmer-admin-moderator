import { useMutation, useQueryClient } from "@tanstack/react-query";
import { globalEventsApi } from "../api/global-events.api";
import { globalEventKeys } from "./useGlobalEvents";
import type { ApiError } from "@/lib/api/types";
import type { DeleteGlobalEventResult } from "../types/global-events.types";

/**
 * Delete a global event (DELETE /api/admin/global-events/{eventId}). ADMIN only,
 * and only while the event is UPCOMING — otherwise the backend returns 409
 * EVENT_NOT_DELETABLE. On success we drop the detail cache and refresh the lists.
 */
export function useDeleteGlobalEvent() {
  const queryClient = useQueryClient();

  return useMutation<DeleteGlobalEventResult, ApiError, string>({
    mutationFn: (eventId) => globalEventsApi.remove(eventId),
    onSuccess: (_result, eventId) => {
      queryClient.removeQueries({ queryKey: globalEventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: globalEventKeys.lists() });
    },
  });
}
