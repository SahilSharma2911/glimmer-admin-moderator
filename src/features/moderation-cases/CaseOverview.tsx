"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CaseStatsCards } from "./components/CaseStatsCards";
import { RecentCaseActivity } from "./components/RecentCaseActivity";
import { LiveEventOverviewCard } from "@/features/global-events/components/LiveEventOverviewCard";

/**
 * Shared moderation dashboard, rendered by both the admin and moderator
 * overview pages. Reads are identical for both roles (case stats + recent
 * activity); only the link base (`/admin` vs `/moderator`) differs.
 */
export function CaseOverview({
  basePath,
}: {
  basePath: "/admin" | "/moderator";
}) {
  const { name, email, isModerator } = useCurrentUser();
  const greeting = name ?? email;

  // Global events are admin-only; show the live-ritual card on the admin
  // overview, where it links into the admin section.
  const showLiveRitual = basePath === "/admin";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {greeting ? `Welcome, ${greeting}. ` : ""}
          {isModerator
            ? "Review flagged and reported content from the queue below."
            : "Monitor the moderation queue across all surfaces."}
        </p>
      </header>

      <CaseStatsCards />

      {showLiveRitual ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
          <div className="lg:col-span-7">
            <RecentCaseActivity basePath={basePath} />
          </div>
          <div className="lg:col-span-3">
            <LiveEventOverviewCard />
          </div>
        </div>
      ) : (
        <RecentCaseActivity basePath={basePath} />
      )}
    </div>
  );
}
