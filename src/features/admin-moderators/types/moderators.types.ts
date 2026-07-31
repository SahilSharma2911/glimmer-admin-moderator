import type { AdminRole } from "@/features/auth/types/auth.types";

/**
 * Types for the admin-only moderator management API
 * (`/admin/moderators/*`). All routes require the ADMIN role.
 *
 * The list endpoint is paginated and searchable server-side (ordered by
 * `createdAt` desc). `search` matches name OR email, case-insensitive; there
 * is no status filter on the API.
 */

/**
 * Lifecycle of a moderator account (backend enum `AdminStatus`):
 * - `PENDING`:   invite email sent, password not yet set (not onboarded).
 *                System-managed — cannot be set via the update endpoint.
 * - `ACTIVE`:    onboarded and able to sign in.
 * - `SUSPENDED`: access revoked by an admin (reversible via reactivate).
 */
export type ModeratorStatus = "PENDING" | "ACTIVE" | "SUSPENDED";

/** A moderator account as returned by the admin moderators endpoints. */
export interface Moderator {
  id: string;
  email: string;
  name: string | null;
  /** Always `"MODERATOR"` for these endpoints. */
  role: AdminRole;
  status: ModeratorStatus;
  /** Admin who invited this moderator (null for seeded/legacy records). */
  invitedByAdminId: string | null;
  /** When onboarding completed, or null while still PENDING. */
  onboardedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// GET /admin/moderators — query params.
export interface ListModeratorsQuery {
  /** 1-based page number (default 1). */
  page?: number;
  /** Page size, 1–100 (default 20). */
  limit?: number;
  /** Matches name or email, case-insensitive (1–120 chars). */
  search?: string;
}

/** Pagination metadata returned alongside the moderators list. */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** GET /admin/moderators response payload. */
export interface ModeratorListResult {
  moderators: Moderator[];
  pagination: Pagination;
}

// POST /admin/moderators — invite a moderator by name + email.
export interface CreateModeratorRequest {
  /** 1–120 chars (backend trims). */
  name: string;
  /** Backend lowercases + validates as email. */
  email: string;
}

/**
 * PATCH /admin/moderators/{moderatorId} — rename / suspend / reactivate.
 * At least one field is required. `status` only toggles ACTIVE ↔ SUSPENDED;
 * PENDING is system-managed and rejected.
 */
export interface UpdateModeratorRequest {
  name?: string;
  status?: Extract<ModeratorStatus, "ACTIVE" | "SUSPENDED">;
}
