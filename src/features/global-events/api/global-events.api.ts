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
 * Admin Global Events endpoints (`/api/admin/global-events`).
 *
 * Reads require an authenticated admin; create / update / delete require the
 * ADMIN role (the backend returns 403 for MODERATOR). These endpoints return
 * the resource directly under `data` (no inner key), so `apiRequest` — which
 * strips the `{ success, data }` envelope — yields the object as-is.
 */
export const globalEventsApi = {
  // GET /api/admin/global-events?status&search&page&limit
  list: (query: ListGlobalEventsQuery = {}) =>
    apiRequest<GlobalEventListPage>({
      method: "GET",
      url: "/api/admin/global-events",
      params: query,
    }),

  // GET /api/admin/global-events/{eventId}
  get: (eventId: string) =>
    apiRequest<GlobalEventSummary>({
      method: "GET",
      url: `/api/admin/global-events/${eventId}`,
    }),

  // POST /api/admin/global-events (ADMIN only) — returns the created event.
  create: (body: CreateGlobalEventRequest) =>
    apiRequest<GlobalEventDetail>({
      method: "POST",
      url: "/api/admin/global-events",
      data: body,
    }),

  // PATCH /api/admin/global-events/{eventId} (ADMIN only, UPCOMING events only)
  update: (eventId: string, body: UpdateGlobalEventRequest) =>
    apiRequest<GlobalEventSummary>({
      method: "PATCH",
      url: `/api/admin/global-events/${eventId}`,
      data: body,
    }),

  // DELETE /api/admin/global-events/{eventId} (ADMIN only, UPCOMING events only)
  remove: (eventId: string) =>
    apiRequest<DeleteGlobalEventResult>({
      method: "DELETE",
      url: `/api/admin/global-events/${eventId}`,
    }),
};
