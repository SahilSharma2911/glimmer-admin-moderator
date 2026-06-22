import type { ModerationFlag } from "../types/moderation-cases.types";
import { FLAG_LABELS } from "../labels";

/**
 * S-code severity badge. S3/S5/S8 are the critical safety codes (sexual
 * content, self-harm, abuse disclosure) and render in rose; others are neutral.
 * Renders an em-dash for reports / unclassified cases (null flag).
 */
const CRITICAL: ReadonlySet<ModerationFlag> = new Set<ModerationFlag>([
  "S3",
  "S5",
  "S8",
]);

export function CaseFlagBadge({ flag }: { flag: ModerationFlag | null }) {
  if (!flag) return <span className="text-slate-400">—</span>;

  const critical = CRITICAL.has(flag);
  const pill = critical
    ? "bg-rose-50 text-rose-600"
    : "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${pill}`}
      title={FLAG_LABELS[flag]}
    >
      {FLAG_LABELS[flag]}
    </span>
  );
}
