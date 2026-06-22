import type { EventStatus } from "./types/global-events.types";

/** Human-readable labels for the derived event status. */
export const STATUS_LABELS: Record<EventStatus, string> = {
  UPCOMING: "Upcoming",
  LIVE: "Live",
  ENDED: "Ended",
};

export const statusLabel = (s: EventStatus) => STATUS_LABELS[s];
