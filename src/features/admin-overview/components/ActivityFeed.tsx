import { ArrowRightIcon } from "@/lib/icons";
import { ACTIVITY } from "../mock";

export function ActivityFeed() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Recent case activity
      </h2>

      <ul className="space-y-4">
        {ACTIVITY.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{item.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <a
        href="#"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark"
      >
        View all cases <ArrowRightIcon size={14} />
      </a>
    </section>
  );
}
