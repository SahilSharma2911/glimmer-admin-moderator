import { apiRequest } from "@/lib/api/client";
import type {
  CreateModeratorRequest,
  ListModeratorsQuery,
  Moderator,
  ModeratorListResult,
  UpdateModeratorRequest,
} from "../types/moderators.types";

/**
 * Admin moderator-management endpoints (ADMIN role required).
 *
 * The backend wraps payloads as `data: { moderators, pagination }` (list) or
 * `data: { moderator: {...} }` (single). `apiRequest` strips the outer
 * `{ success, data }`; single-resource helpers then unwrap the inner key so
 * callers get a plain `Moderator`.
 */
export const moderatorsApi = {
  // GET /admin/moderators?page&limit&search
  list: (query: ListModeratorsQuery = {}) =>
    apiRequest<ModeratorListResult>({
      method: "GET",
      url: "/admin/moderators",
      params: query,
    }),

  // GET /admin/moderators/{moderatorId}
  get: (moderatorId: string) =>
    apiRequest<{ moderator: Moderator }>({
      method: "GET",
      url: `/admin/moderators/${moderatorId}`,
    }).then((data) => data.moderator),

  // POST /admin/moderators
  create: (body: CreateModeratorRequest) =>
    apiRequest<{ moderator: Moderator }>({
      method: "POST",
      url: "/admin/moderators",
      data: body,
    }).then((data) => data.moderator),

  // PATCH /admin/moderators/{moderatorId}
  update: (moderatorId: string, body: UpdateModeratorRequest) =>
    apiRequest<{ moderator: Moderator }>({
      method: "PATCH",
      url: `/admin/moderators/${moderatorId}`,
      data: body,
    }).then((data) => data.moderator),

  // POST /admin/moderators/{moderatorId}/resend-invite
  resendInvite: (moderatorId: string) =>
    apiRequest<{ moderator: Moderator }>({
      method: "POST",
      url: `/admin/moderators/${moderatorId}/resend-invite`,
    }).then((data) => data.moderator),
};
