import type { ModeratorStatus } from "../types/moderators.types";

const STATUS_STYLES: Record<
  ModeratorStatus,
  { label: string; pill: string; dot: string }
> = {
  ACTIVE: {
    label: "Active",
    pill: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Pending invite",
    pill: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
  SUSPENDED: {
    label: "Suspended",
    pill: "bg-rose-50 text-rose-600",
    dot: "bg-rose-500",
  },
};

export function ModeratorStatusBadge({ status }: { status: ModeratorStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
