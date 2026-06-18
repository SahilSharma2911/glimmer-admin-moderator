import { ArrowUpRightIcon } from "@/lib/icons";
import type { Stat } from "../mock";

export function StatCard({ label, value, trend, icon: Icon, danger }: Stat) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <Icon size={18} className="text-slate-300" />
      </div>
      <div
        className={`mt-3 text-3xl font-semibold tracking-tight ${
          danger ? "text-rose-500" : "text-slate-900"
        }`}
      >
        {value}
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs">
        <span className="inline-flex items-center gap-0.5 font-medium text-rose-500">
          <ArrowUpRightIcon size={13} />
          {trend}
        </span>
        <span className="text-slate-400">vs yesterday</span>
      </div>
    </div>
  );
}
