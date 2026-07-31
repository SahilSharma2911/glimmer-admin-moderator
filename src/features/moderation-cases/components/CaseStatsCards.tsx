"use client";

import {
  AlertTriangleIcon,
  DocumentIcon,
  FolderIcon,
  CheckCircleIcon,
} from "@/lib/icons";
import { DataTableError } from "@/components/table/data-table-error";
import { CaseStatCard } from "./CaseStatCard";
import { useModerationCaseStats } from "../hooks/useModerationCaseStats";
import type { ModerationCaseStats } from "../types/moderation-cases.types";

/** S-codes that count as critical safety cases (sexual content, self-harm, abuse). */
const CRITICAL_FLAGS = ["S3", "S5", "S8"] as const;

function criticalCount(stats: ModerationCaseStats | undefined): number {
  if (!stats) return 0;
  return CRITICAL_FLAGS.reduce((sum, f) => sum + (stats.byFlag[f] ?? 0), 0);
}

/** Terminal outcomes — a case is "closed" once it reaches any of these. */
const CLOSED_STATUSES = ["RESOLVED", "MARK_SAFE", "REMOVE_CONTENT"] as const;

function closedCount(stats: ModerationCaseStats | undefined): number | undefined {
  if (!stats) return undefined;
  return CLOSED_STATUSES.reduce((sum, s) => sum + (stats.byStatus[s] ?? 0), 0);
}

/**
 * Dashboard stat cards driven by GET /admin/moderation-cases/stats.
 * Open / In review counts come from `byStatus`; the critical card sums the
 * S3/S5/S8 flags (matching the backend's critical-cases definition); the
 * closed card sums the terminal statuses (resolved + marked safe + removed).
 */
export function CaseStatsCards() {
  const { data, isLoading, isError, refetch } = useModerationCaseStats();

  if (isError) {
    return <DataTableError error={null} onRetry={() => refetch()} />;
  }

  const cards = [
    {
      label: "Open cases",
      value: data?.byStatus.OPEN,
      icon: FolderIcon,
    },
    {
      label: "In review",
      value: data?.byStatus.IN_REVIEW,
      icon: DocumentIcon,
    },
    {
      label: "Critical cases",
      value: criticalCount(data),
      icon: AlertTriangleIcon,
      danger: true,
    },
    {
      label: "Closed",
      value: closedCount(data),
      icon: CheckCircleIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <CaseStatCard key={card.label} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}
