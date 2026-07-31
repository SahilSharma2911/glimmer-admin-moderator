import { apiRequest } from "@/lib/api/client";
import type {
  CreateGlobalEventRequest,
  DeleteGlobalEventResult,
  GlobalEventDetail,
  GlobalEventListPage,
  GlobalEventSummary,
  ListGlobalEventsQuery,
  UpdateGlobalEventRequest,
} from "../types/global-events.types";

/**
 * Admin Global Events endpoints (`/admin/global-events`).
 *
 * Reads require an authenticated admin; create / update / delete require the
 * ADMIN role (the backend returns 403 for MODERATOR). These endpoints return
 * the resource directly under `data` (no inner key), so `apiRequest` — which
 * strips the `{ success, data }` envelope — yields the object as-is.
 */
export const globalEventsApi = {
  // GET /admin/global-events?status&search&page&limit
  list: (query: ListGlobalEventsQuery = {}) =>
    apiRequest<GlobalEventListPage>({
      method: "GET",
      url: "/admin/global-events",
      params: query,
    }),

  // GET /admin/global-events/{eventId}
  get: (eventId: string) =>
    apiRequest<GlobalEventSummary>({
      method: "GET",
      url: `/admin/global-events/${eventId}`,
    }),

  // POST /admin/global-events (ADMIN only) — returns the created event.
  create: (body: CreateGlobalEventRequest) =>
    apiRequest<GlobalEventDetail>({
      method: "POST",
      url: "/admin/global-events",
      data: body,
    }),

  // PATCH /admin/global-events/{eventId} (ADMIN only, UPCOMING events only)
  update: (eventId: string, body: UpdateGlobalEventRequest) =>
    apiRequest<GlobalEventSummary>({
      method: "PATCH",
      url: `/admin/global-events/${eventId}`,
      data: body,
    }),

  // DELETE /admin/global-events/{eventId} (ADMIN only, UPCOMING events only)
  remove: (eventId: string) =>
    apiRequest<DeleteGlobalEventResult>({
      method: "DELETE",
      url: `/admin/global-events/${eventId}`,
    }),
};
