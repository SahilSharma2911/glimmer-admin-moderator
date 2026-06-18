import { ArrowRightIcon } from "@/lib/icons";
import { RECENT_CASES, type CaseStatus } from "../mock";

const STATUS_STYLES: Record<CaseStatus, { pill: string; dot: string }> = {
  Urgent: { pill: "bg-rose-50 text-rose-600", dot: "bg-rose-500" },
  Low: { pill: "bg-sky-50 text-sky-600", dot: "bg-sky-500" },
  "In review": { pill: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
};

function StatusBadge({ status }: { status: CaseStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function Assignee({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-[11px] font-semibold text-accent">
        {name.slice(0, 1).toUpperCase()}
      </span>
      <span className="text-slate-600">{name}</span>
    </span>
  );
}

export function RecentCasesTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Recent case activity</h2>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark"
        >
          View all cases <ArrowRightIcon size={14} />
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-y border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-5 py-2.5 font-medium">Case ID</th>
              <th className="px-5 py-2.5 font-medium">Case Type</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Assigned</th>
              <th className="px-5 py-2.5 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_CASES.map((c) => (
              <tr
                key={c.id}
                className={`border-b border-slate-50 last:border-0 ${
                  c.status === "Urgent" ? "bg-rose-50/40" : ""
                }`}
              >
                <td className="px-5 py-3 font-medium text-accent">{c.id}</td>
                <td className="px-5 py-3 text-slate-700">{c.type}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-5 py-3">
                  <Assignee name={c.assignee} />
                </td>
                <td className="px-5 py-3 text-right">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark"
                  >
                    View Case <ArrowRightIcon size={14} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
