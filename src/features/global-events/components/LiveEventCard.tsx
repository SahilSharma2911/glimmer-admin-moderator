"use client";

import Link from "next/link";
import { Eye, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { useGlobalEvents } from "../hooks/useGlobalEvents";

/** ends date with time, e.g. "Jun 30, 2025 · 11:59 PM". */
function formatEnds(iso: string): string {
  const date = formatDate(iso, { month: "short" });
  const time = new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
}

/**
 * Hero card for the event that's currently LIVE. Renders nothing when no event
 * is live. Pulls the single most-recent live event from the list endpoint.
 */
export function LiveEventCard() {
  const { data } = useGlobalEvents({ status: "LIVE", page: 1, limit: 1 });
  const event = data?.events[0];

  if (!event) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col sm:flex-row">
        {/* Decorative hero panel (no media in the data model yet). */}
        <div className="relative flex min-h-36 items-end bg-linear-to-br from-brand/25 via-brand/10 to-accent/20 p-4 sm:w-64 sm:shrink-0">
          <span className="rounded-md bg-white/70 px-2 py-1 text-xs font-medium text-slate-500">
            {event.name} · hero
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live now
            </span>
            <span className="text-sm text-slate-500">
              Ends {formatEnds(event.endsAt)}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              {event.name}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {event.description}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Children reached
              </p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-lg font-semibold text-slate-900">
                <Users size={16} className="text-slate-400" />
                {event.totalJoined.toLocaleString()}
              </p>
            </div>
            <Link
              href={`/admin/global-light-ritual/${event.id}`}
              className={buttonVariants({ variant: "outline" })}
            >
              <Eye size={16} />
              View details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
