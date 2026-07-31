import { apiRequest } from "@/lib/api/client";
import type {
  ListModerationCasesQuery,
  ModerationCase,
  ModerationCaseDetail,
  ModerationCaseListResult,
  ModerationCaseStats,
  UpdateModerationCaseStatusRequest,
} from "../types/moderation-cases.types";

/**
 * Centralized moderation review queue endpoints (`/admin/moderation-cases`).
 *
 * Reads (`stats`, `list`, `get`) are available to both ADMIN and MODERATOR.
 * `updateStatus` (PATCH) is MODERATOR-only — the backend returns 403 for ADMIN.
 *
 * The backend wraps payloads as `data: { ... }` (list/stats) or
 * `data: { case: {...} }` (single). `apiRequest` strips the outer
 * `{ success, data }`; single-resource helpers then unwrap the inner `case`
 * key so callers get a plain case object.
 */
export const moderationCasesApi = {
  // GET /admin/moderation-cases/stats
  stats: () =>
    apiRequest<ModerationCaseStats>({
      method: "GET",
      url: "/admin/moderation-cases/stats",
    }),

  // GET /admin/moderation-cases?status&caseType&flag&source&childId&search&page&limit
  list: (query: ListModerationCasesQuery = {}) =>
    apiRequest<ModerationCaseListResult>({
      method: "GET",
      url: "/admin/moderation-cases",
      params: query,
    }),

  // GET /admin/moderation-cases/{caseId}
  get: (caseId: string) =>
    apiRequest<{ case: ModerationCaseDetail }>({
      method: "GET",
      url: `/admin/moderation-cases/${caseId}`,
    }).then((data) => data.case),

  // PATCH /admin/moderation-cases/{caseId} (MODERATOR only)
  updateStatus: (caseId: string, body: UpdateModerationCaseStatusRequest) =>
    apiRequest<{ case: ModerationCase }>({
      method: "PATCH",
      url: `/admin/moderation-cases/${caseId}`,
      data: body,
    }).then((data) => data.case),
};
