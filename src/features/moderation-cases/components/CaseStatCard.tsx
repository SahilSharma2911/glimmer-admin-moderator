import type { ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Icon = ComponentType<{ size?: number; className?: string }>;

interface CaseStatCardProps {
  label: string;
  value: number | undefined;
  icon: Icon;
  /** Render the value in rose to flag critical/at-risk counts. */
  danger?: boolean;
  isLoading?: boolean;
}

/**
 * Dashboard stat card backed by real case counts. Unlike the legacy overview
 * card, there's no fake trend line — the stats API returns counts only.
 */
export function CaseStatCard({
  label,
  value,
  icon: Icon,
  danger,
  isLoading,
}: CaseStatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <Icon size={18} className={danger ? "text-rose-300" : "text-slate-300"} />
      </div>
      {isLoading ? (
        <Skeleton className="mt-3 h-9 w-16" />
      ) : (
        <div
          className={`mt-3 text-3xl font-semibold tracking-tight ${
            danger ? "text-rose-500" : "text-slate-900"
          }`}
        >
          {value ?? 0}
        </div>
      )}
    </div>
  );
}
