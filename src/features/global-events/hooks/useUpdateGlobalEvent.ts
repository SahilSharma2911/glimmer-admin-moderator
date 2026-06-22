import { useMutation, useQueryClient } from "@tanstack/react-query";
import { globalEventsApi } from "../api/global-events.api";
import { globalEventKeys } from "./useGlobalEvents";
import type { ApiError } from "@/lib/api/types";
import type {
  GlobalEventSummary,
  UpdateGlobalEventRequest,
} from "../types/global-events.types";

interface UpdateGlobalEventVariables {
  eventId: string;
  body: UpdateGlobalEventRequest;
}

/**
 * Update a global event (PATCH /api/admin/global-events/{eventId}). ADMIN only,
 * and only while the event is UPCOMING — otherwise the backend returns 409
 * EVENT_NOT_EDITABLE. On success we seed the detail cache and refresh the lists.
 */
export function useUpdateGlobalEvent() {
  const queryClient = useQueryClient();

  return useMutation<GlobalEventSummary, ApiError, UpdateGlobalEventVariables>({
    mutationFn: ({ eventId, body }) => globalEventsApi.update(eventId, body),
    onSuccess: (event) => {
      queryClient.setQueryData(globalEventKeys.detail(event.id), event);
      queryClient.invalidateQueries({ queryKey: globalEventKeys.lists() });
    },
  });
}
