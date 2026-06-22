import type { ModerationCaseStatus } from "../types/moderation-cases.types";
import { STATUS_LABELS } from "../labels";

const STATUS_STYLES: Record<
  ModerationCaseStatus,
  { pill: string; dot: string }
> = {
  OPEN: { pill: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
  IN_REVIEW: { pill: "bg-sky-50 text-sky-600", dot: "bg-sky-500" },
  RESOLVED: { pill: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  DISMISSED: { pill: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

export function CaseStatusBadge({ status }: { status: ModerationCaseStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
