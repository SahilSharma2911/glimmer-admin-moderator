/**
 * Types for the centralized moderation review queue
 * (`/api/admin/moderation-cases/*`).
 *
 * A case is created (forward-only) whenever AI moderation flags/blocks content
 * (capsule, journal, Lumiri chat) or a user reports content (capsule/message).
 * Reads are available to BOTH the ADMIN (supervisor) and MODERATOR roles; only
 * a MODERATOR may change a case status. Status changes are review-tracking only
 * — they never mutate the underlying content.
 *
 * The list endpoint is paginated, filterable, and searchable server-side
 * (ordered by `createdAt` desc). `search` matches the subject child's
 * `username`, case-insensitive.
 */

import type { AdminRole } from "@/features/auth/types/auth.types";

// ---------------------------------------------------------------------------
// Enums (mirror the backend Prisma enums)
// ---------------------------------------------------------------------------

/** Where the case originated. */
export type ModerationCaseSource =
  | "AI_MODERATION"
  | "AI_SAFETY_SIGNAL"
  | "USER_REPORT";

/**
 * Review lifecycle. New cases start `OPEN`. Terminal states
 * (`RESOLVED` / `DISMISSED`) are reopenable to `IN_REVIEW`.
 */
export type ModerationCaseStatus =
  | "OPEN"
  | "IN_REVIEW"
  | "RESOLVED"
  | "DISMISSED";

/**
 * S-code recognition/severity key. Null for user reports / UNCLASSIFIED cases.
 *   S1 ·  S2 ·  S3 Sexual Content/CSAM ·  S4 Hate/Bullying ·
 *   S5 Self-harm ·  S8 Abuse Disclosure
 */
export type ModerationFlag = "S1" | "S2" | "S3" | "S4" | "S5" | "S8";

/** AI decision snapshot at the time the case was opened (AI cases only). */
export type ModerationDecision = "ALLOWED" | "FLAGGED" | "BLOCKED";

/**
 * The concrete case type (full mod.pdf taxonomy). Stored directly on the case;
 * the frontend renders the human label (e.g. `SELF_HARM_IN_AUDIO_CAPSULE` →
 * "Self-harm in Audio Capsule").
 */
export type ModerationCaseType =
  // Audio Capsule
  | "SELF_HARM_IN_AUDIO_CAPSULE"
  | "SEXUAL_CONTENT_IN_AUDIO_CAPSULE"
  | "ABUSE_DISCLOSURE_IN_AUDIO_CAPSULE"
  | "VIOLENCE_IN_AUDIO_CAPSULE"
  | "NONVIOLENT_CRIME_IN_AUDIO_CAPSULE"
  | "HATE_SPEECH_IN_AUDIO_CAPSULE"
  // Written Capsule
  | "SELF_HARM_IN_WRITTEN_CAPSULE"
  | "SEXUAL_CONTENT_IN_WRITTEN_CAPSULE"
  | "ABUSE_DISCLOSURE_IN_WRITTEN_CAPSULE"
  | "VIOLENCE_IN_WRITTEN_CAPSULE"
  | "NONVIOLENT_CRIME_IN_WRITTEN_CAPSULE"
  | "HATE_SPEECH_IN_WRITTEN_CAPSULE"
  // Image Capsule
  | "SELF_HARM_IN_IMAGE_CAPSULE"
  | "SEXUAL_CONTENT_IN_IMAGE_CAPSULE"
  | "ABUSE_DISCLOSURE_IN_IMAGE_CAPSULE"
  | "VIOLENCE_IN_IMAGE_CAPSULE"
  | "NONVIOLENT_CRIME_IN_IMAGE_CAPSULE"
  | "HATE_SPEECH_IN_IMAGE_CAPSULE"
  // Doodle Capsule
  | "SELF_HARM_IN_DOODLE_CAPSULE"
  | "SEXUAL_CONTENT_IN_DOODLE_CAPSULE"
  | "ABUSE_DISCLOSURE_IN_DOODLE_CAPSULE"
  | "VIOLENCE_IN_DOODLE_CAPSULE"
  | "NONVIOLENT_CRIME_IN_DOODLE_CAPSULE"
  | "HATE_SPEECH_IN_DOODLE_CAPSULE"
  // Lumiri Chat
  | "SELF_HARM_CHAT_WITH_LUMIRI"
  | "ABUSE_DISCLOSURE_WITH_LUMIRI"
  // Journaling
  | "SELF_HARM_IN_JOURNAL_REFLECTION"
  | "SELF_HARM_IN_JOURNAL_AUDIO"
  // User reports
  | "USER_REPORTED_CONTENT"
  | "USER_REPORTED_MESSAGE"
  // Fallback: timeout / unknown category / verdict outside a surface's taxonomy
  | "UNCLASSIFIED";

// ---------------------------------------------------------------------------
// Case shapes
// ---------------------------------------------------------------------------

/**
 * Scalar columns shared by every representation of a case. This is exactly what
 * the PATCH (status change) endpoint returns — no linked content.
 */
export interface ModerationCase {
  id: string;
  /** PRIMARY — the full taxonomy case type. */
  caseType: ModerationCaseType;
  source: ModerationCaseSource;
  /** S-code; null for reports / UNCLASSIFIED. */
  flag: ModerationFlag | null;
  status: ModerationCaseStatus;

  /** Subject of the case (content owner / reported child). */
  childId: string;

  // Polymorphic content refs — exactly one set, depending on `caseType`.
  capsuleId: string | null;
  journalId: string | null;
  lumiriSessionId: string | null;
  messageId: string | null;
  reportId: string | null;
  reportedByChildId: string | null;

  // AI snapshot at time of case (raw, for audit/trace).
  decision: ModerationDecision | null;
  /** Raw category string from the moderation layer. */
  category: string | null;
  /** Raw flag list / safety-signal snapshot. */
  flags: string[];
  score: number | null;
  /** User report reason OR Lumiri summary excerpt. */
  reason: string | null;

  // Review tracking.
  reviewedByAdminId: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;

  createdAt: string;
  updatedAt: string;
}

/** Minimal child reference attached to every list row. */
export interface ModerationCaseChildRef {
  id: string;
  username: string;
}

/** A row in the list response (GET /api/admin/moderation-cases). */
export interface ModerationCaseListItem extends ModerationCase {
  child: ModerationCaseChildRef;
}

// --- Linked content (only present on the single-case detail response) -------

/** Subject child with account status, exposed on the detail view. */
export interface ModerationCaseChild extends ModerationCaseChildRef {
  accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED";
}

/** The reviewing moderator (null until a status change is made). */
export interface ModerationCaseReviewer {
  id: string;
  name: string | null;
  email: string;
}

/**
 * Linked content blocks. Exactly one is non-null per case, matching the
 * `caseType` surface. Loosely typed (`Record`) for the raw content payloads —
 * the detail UI renders these per surface; tighten as views are built. Journal
 * text/media fields arrive already decrypted by the backend.
 */
export interface ModerationCaseDetail extends ModerationCase {
  child: ModerationCaseChild;
  capsule: Record<string, unknown> | null;
  journal: Record<string, unknown> | null;
  message: Record<string, unknown> | null;
  lumiriSession: Record<string, unknown> | null;
  reviewedBy: ModerationCaseReviewer | null;
}

// ---------------------------------------------------------------------------
// Requests / responses
// ---------------------------------------------------------------------------

/** GET /api/admin/moderation-cases — query params (all optional). */
export interface ListModerationCasesQuery {
  status?: ModerationCaseStatus;
  caseType?: ModerationCaseType;
  flag?: ModerationFlag;
  source?: ModerationCaseSource;
  /** Filter to a single subject child. */
  childId?: string;
  /** Matches the subject child's username, case-insensitive (1–120 chars). */
  search?: string;
  /** 1-based page number (default 1). */
  page?: number;
  /** Page size, 1–100 (default 20). */
  limit?: number;
}

/** Pagination metadata returned alongside the cases list. */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** GET /api/admin/moderation-cases response payload. */
export interface ModerationCaseListResult {
  cases: ModerationCaseListItem[];
  pagination: Pagination;
}

/** GET /api/admin/moderation-cases/stats response payload (dashboard cards). */
export interface ModerationCaseStats {
  total: number;
  /** Every status is seeded at 0, so all cards are always present. */
  byStatus: Record<ModerationCaseStatus, number>;
  /** Counts keyed by case type (only types with cases are present). */
  byCaseType: Partial<Record<ModerationCaseType, number>>;
  /** Counts keyed by S-code (null flags omitted) — powers the critical card. */
  byFlag: Partial<Record<ModerationFlag, number>>;
}

/**
 * PATCH /api/admin/moderation-cases/{caseId} — change a case status
 * (MODERATOR only). `reviewNote` is an optional free-text note (≤2000 chars).
 */
export interface UpdateModerationCaseStatusRequest {
  status: ModerationCaseStatus;
  reviewNote?: string;
}

// ---------------------------------------------------------------------------
// Transition rules (mirror the backend; lets the edit UI offer valid targets)
// ---------------------------------------------------------------------------

/**
 * Allowed status transitions. Re-applying the same status is rejected by the
 * backend as a no-op (409 INVALID_TRANSITION). Terminal states are reopenable
 * to IN_REVIEW so genuine mistakes can be recovered.
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<
  ModerationCaseStatus,
  ModerationCaseStatus[]
> = {
  OPEN: ["IN_REVIEW", "RESOLVED", "DISMISSED"],
  IN_REVIEW: ["OPEN", "RESOLVED", "DISMISSED"],
  RESOLVED: ["IN_REVIEW"],
  DISMISSED: ["IN_REVIEW"],
};

/** Status values a MODERATOR may move a case to from its current status. */
export function nextStatuses(
  current: ModerationCaseStatus,
): ModerationCaseStatus[] {
  return ALLOWED_STATUS_TRANSITIONS[current];
}

/**
 * Whether `actorRole` is permitted to change a case status. Reads are open to
 * both roles; only a MODERATOR may write. (The backend enforces this with a
 * 403; this is for gating UI affordances.)
 */
export function canEditCaseStatus(actorRole: AdminRole | null): boolean {
  return actorRole === "MODERATOR";
}
