import { STATS } from "./mock";
import { StatCard } from "./components/StatCard";
import { RecentCasesTable } from "./components/RecentCasesTable";
import { ActivityFeed } from "./components/ActivityFeed";
import { GlobalLightRitualCard } from "./components/GlobalLightRitualCard";

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Admin Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor cases, manage moderators, and coordinate the Global Light Ritual.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentCasesTable />
        </div>
        <div className="space-y-6">
          <ActivityFeed />
          <GlobalLightRitualCard />
        </div>
      </div>
    </div>
  );
}
