"use client";

import { cn } from "@/lib/utils";
import type { EventStatus } from "../types/global-events.types";
import type { GlobalEventCounts } from "../hooks/useGlobalEventCounts";

/** Tab value: "ALL" or a concrete derived status. */
export type EventTab = "ALL" | EventStatus;

const TABS: Array<{ value: EventTab; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "LIVE", label: "Live" },
  { value: "UPCOMING", label: "Scheduled" },
  { value: "ENDED", label: "Ended" },
];

function countFor(tab: EventTab, counts: GlobalEventCounts): number {
  return tab === "ALL" ? counts.all : counts[tab];
}

interface GlobalEventTabsProps {
  value: EventTab;
  onChange: (value: EventTab) => void;
  counts: GlobalEventCounts;
}

/** Status tabs with per-status counts, sitting above the events table. */
export function GlobalEventTabs({
  value,
  onChange,
  counts,
}: GlobalEventTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter events by status"
      className="flex items-center gap-6 border-b border-slate-200"
    >
      {TABS.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors",
              active
                ? "border-brand text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                active
                  ? "bg-brand/15 text-accent"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              {countFor(tab.value, counts)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
