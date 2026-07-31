import { useMutation, useQueryClient } from "@tanstack/react-query";
import { globalEventsApi } from "../api/global-events.api";
import { globalEventKeys } from "./useGlobalEvents";
import type { ApiError } from "@/lib/api/types";
import type {
  CreateGlobalEventRequest,
  GlobalEventDetail,
} from "../types/global-events.types";

/**
 * Create a global event (POST /admin/global-events). ADMIN only — a
 * MODERATOR receives a 403. On success we seed the detail cache and refresh
 * the lists.
 */
export function useCreateGlobalEvent() {
  const queryClient = useQueryClient();

  return useMutation<GlobalEventDetail, ApiError, CreateGlobalEventRequest>({
    mutationFn: (body) => globalEventsApi.create(body),
    onSuccess: (event) => {
      queryClient.setQueryData(globalEventKeys.detail(event.id), event);
      queryClient.invalidateQueries({ queryKey: globalEventKeys.lists() });
    },
  });
}
