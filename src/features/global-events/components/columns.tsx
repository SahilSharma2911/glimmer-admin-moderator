"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/format";
import { UsersIcon } from "@/lib/icons";
import { GlobalEventStatusBadge } from "./GlobalEventStatusBadge";
import { CellAction } from "./cell-action";
import type { GlobalEventSummary } from "../types/global-events.types";

/** Scheduled date with time, e.g. "Jul 1, 2026, 7:00 PM". */
function formatScheduled(iso: string): string {
  return formatDate(iso, { month: "short", hour: "numeric", minute: "2-digit" });
}

export const columns: ColumnDef<GlobalEventSummary>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Event",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <p className="font-medium text-slate-800">{row.original.name}</p>
        <p className="truncate text-xs text-slate-500">
          {row.original.description}
        </p>
      </div>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Event",
      variant: "text",
      placeholder: "Search by name…",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <GlobalEventStatusBadge status={row.original.status} />,
    enableColumnFilter: false,
  },
  {
    accessorKey: "scheduledAt",
    header: "Scheduled",
    cell: ({ row }) => (
      <span className="text-slate-600">
        {formatScheduled(row.original.scheduledAt)}
      </span>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "totalJoined",
    header: "Participants",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 text-slate-600">
        <UsersIcon size={14} className="text-slate-400" />
        {row.original.totalJoined}
      </span>
    ),
    enableColumnFilter: false,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <CellAction data={row.original} />,
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },
];
