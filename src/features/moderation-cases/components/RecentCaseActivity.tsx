"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/lib/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { CaseFlagBadge } from "./CaseFlagBadge";
import { useModerationCases } from "../hooks/useModerationCases";
import { CASE_TYPE_LABELS } from "../labels";

const RECENT_LIMIT = 6;

/**
 * "Recent case activity" panel — the latest cases from
 * GET /api/admin/moderation-cases (ordered newest-first by the backend).
 * Links resolve under the current section via `basePath`.
 */
export function RecentCaseActivity({
  basePath,
}: {
  basePath: "/admin" | "/moderator";
}) {
  const { data, isLoading, isError, refetch } = useModerationCases({
    page: 1,
    limit: RECENT_LIMIT,
  });

  const cases = data?.cases ?? [];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Recent case activity
        </h2>
        <Link
          href={`${basePath}/cases`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark"
        >
          View all cases <ArrowRightIcon size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-y border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-5 py-2.5 font-medium">Case type</th>
              <th className="px-5 py-2.5 font-medium">Child</th>
              <th className="px-5 py-2.5 font-medium">Flag</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Created</th>
              <th className="px-5 py-2.5 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3" colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))}

            {!isLoading &&
              cases.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="px-5 py-3 font-medium text-slate-700">
                    {CASE_TYPE_LABELS[c.caseType]}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {c.child.username}
                  </td>
                  <td className="px-5 py-3">
                    <CaseFlagBadge flag={c.flag} />
                  </td>
                  <td className="px-5 py-3">
                    <CaseStatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {formatDate(c.createdAt, { month: "short" })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`${basePath}/cases/${c.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark"
                    >
                      View case <ArrowRightIcon size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && isError && (
        <div className="flex items-center justify-between px-5 py-4 text-sm text-slate-500">
          <span>Couldn&apos;t load recent cases.</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-medium text-accent hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && cases.length === 0 && (
        <div className="px-5 py-10 text-center text-sm text-slate-500">
          No cases yet.
        </div>
      )}
    </section>
  );
}
