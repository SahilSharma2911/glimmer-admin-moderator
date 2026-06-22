import type { EventStatus } from "../types/global-events.types";
import { STATUS_LABELS } from "../labels";

const STATUS_STYLES: Record<EventStatus, { pill: string; dot: string }> = {
  UPCOMING: { pill: "bg-sky-50 text-sky-600", dot: "bg-sky-500" },
  LIVE: { pill: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  ENDED: { pill: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

export function GlobalEventStatusBadge({ status }: { status: EventStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.pill}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${s.dot} ${
          status === "LIVE" ? "animate-pulse" : ""
        }`}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
