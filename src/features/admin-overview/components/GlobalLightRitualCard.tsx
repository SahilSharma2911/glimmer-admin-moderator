import { SparkleIcon, CalendarIcon, ArrowRightIcon } from "@/lib/icons";
import { NEXT_RITUAL } from "../mock";

export function GlobalLightRitualCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Global Light Ritual
      </h2>

      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-accent">
          <SparkleIcon size={20} />
        </span>
        <div>
          <p className="text-xs text-slate-400">Next ritual</p>
          <p className="text-sm font-semibold text-slate-800">{NEXT_RITUAL.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <CalendarIcon size={14} className="text-slate-400" />
            {NEXT_RITUAL.date}
          </p>
          <span className="mt-2 inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
            {NEXT_RITUAL.status}
          </span>
        </div>
      </div>

      <a
        href="#"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark"
      >
        View ritual details <ArrowRightIcon size={14} />
      </a>
    </section>
  );
}
