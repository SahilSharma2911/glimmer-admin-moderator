"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/lib/icons";
import { Sparkles, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { useGlobalEvents } from "../hooks/useGlobalEvents";

const BASE_PATH = "/admin/global-light-ritual";

/** ends date with time, e.g. "Jun 30 · 11:59 PM". */
function formatEnds(iso: string): string {
  const date = formatDate(iso, { month: "short", year: undefined });
  const time = new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
}

/**
 * Compact "Global Light Ritual" card for the admin overview sidebar — surfaces
 * the event that's currently LIVE, or an empty state when none is. Sits beside
 * the recent-activity table.
 */
export function LiveEventOverviewCard() {
  const { data, isLoading } = useGlobalEvents({
    status: "LIVE",
    page: 1,
    limit: 1,
  });
  const event = data?.events[0];

  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Global Light Ritual
        </h2>
        <Link
          href={BASE_PATH}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark"
        >
          Manage <ArrowRightIcon size={14} />
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : event ? (
          <div className="flex flex-1 flex-col">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live now
            </span>

            <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-900">
              {event.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
              {event.description}
            </p>

            <dl className="mt-4 space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-sm">
                <dt className="text-slate-500">Children reached</dt>
                <dd className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                  <Users size={14} className="text-slate-400" />
                  {event.totalJoined.toLocaleString()}
                </dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="text-slate-500">Ends</dt>
                <dd className="font-medium text-slate-700">
                  {formatEnds(event.endsAt)}
                </dd>
              </div>
            </dl>

            <Link
              href={`${BASE_PATH}/${event.id}`}
              className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-accent hover:text-accent-dark"
            >
              View details <ArrowRightIcon size={14} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
            <Sparkles size={24} className="text-slate-300" />
            <p className="text-sm text-slate-500">No ritual is live right now.</p>
            <Link
              href={`${BASE_PATH}/new`}
              className="text-sm font-medium text-accent hover:underline"
            >
              Schedule one
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
