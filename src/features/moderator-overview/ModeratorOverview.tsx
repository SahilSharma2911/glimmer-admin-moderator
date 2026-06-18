"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export function ModeratorOverview() {
  const { name, email } = useCurrentUser();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Moderator Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome{name || email ? `, ${name ?? email}` : ""}. Your assigned cases
          and queue will appear here.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">
          Moderator dashboard is coming soon.
        </p>
      </div>
    </div>
  );
}
