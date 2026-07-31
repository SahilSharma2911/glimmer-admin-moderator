/**
 * Types for the admin Global Events API (`/admin/global-events/*`).
 *
 * A global event is a scheduled "moment of care" every child can join in
 * realtime. Admins own the CRUD here; children join over sockets (out of scope
 * for the admin dashboard).
 *
 * Reads require an authenticated admin; create / update / delete require the
 * ADMIN role specifically. The list endpoint is paginated, filterable by
 * derived status, and searchable by name (server-side, ordered by
 * `scheduledAt` desc).
 */

/**
 * Derived lifecycle status — never stored. Computed by the backend from
 * `scheduledAt` and a fixed 24-hour live window on every read:
 *   UPCOMING  now < scheduledAt
 *   LIVE      scheduledAt ≤ now < scheduledAt + 24h
 *   ENDED     now ≥ scheduledAt + 24h
 */
export type EventStatus = "UPCOMING" | "LIVE" | "ENDED";

/** An event as returned by the list and single-event admin endpoints. */
export interface GlobalEventSummary {
  id: string;
  name: string;
  description: string;
  /** ISO timestamp the moment goes live. */
  scheduledAt: string;
  /** ISO timestamp the live window closes (`scheduledAt` + 24h). */
  endsAt: string;
  status: EventStatus;
  /** Cumulative unique participants — only ever grows (disconnects don't decrement). */
  totalJoined: number;
  /** Always false in the admin context (admins don't participate). */
  myParticipation: boolean;
}

/** The create response, and any future detail read. Adds creation metadata. */
export interface GlobalEventDetail extends GlobalEventSummary {
  createdAt: string;
  /** Always null in the admin context. */
  myJoinedAt: string | null;
}

/** Pagination metadata returned alongside the events list. */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** GET /admin/global-events response payload. */
export interface GlobalEventListPage {
  events: GlobalEventSummary[];
  pagination: Pagination;
}

/** GET /admin/global-events — query params (all optional). */
export interface ListGlobalEventsQuery {
  /** Filter by derived status (translated to a `scheduledAt` range server-side). */
  status?: EventStatus;
  /** Matches the event name, case-insensitive (1–120 chars). */
  search?: string;
  /** 1-based page number (default 1). */
  page?: number;
  /** Page size, 1–100 (default 20). */
  limit?: number;
}

/**
 * POST /admin/global-events. `scheduledAt` is an ISO datetime string
 * (the backend coerces it to a Date).
 */
export interface CreateGlobalEventRequest {
  /** 1–120 chars (backend trims). */
  name: string;
  /** 1–2000 chars (backend trims). */
  description: string;
  /** ISO datetime the moment should go live. */
  scheduledAt: string;
}

/**
 * PATCH /admin/global-events/{eventId}. All fields optional. Only events
 * still UPCOMING are editable; the backend returns 409 EVENT_NOT_EDITABLE once
 * an event has gone live or ended.
 */
export type UpdateGlobalEventRequest = Partial<CreateGlobalEventRequest>;

/** DELETE /admin/global-events/{eventId} response payload. */
export interface DeleteGlobalEventResult {
  deleted: boolean;
}

/**
 * An event can only be edited or deleted while UPCOMING — once it goes LIVE or
 * ENDED the backend rejects mutations (409). Use this to gate the UI; the
 * backend enforces it regardless.
 */
export function isEventMutable(status: EventStatus): boolean {
  return status === "UPCOMING";
}
