"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/format";
import { ModeratorStatusBadge } from "./ModeratorStatusBadge";
import { CellAction } from "./cell-action";
import type { Moderator } from "../types/moderators.types";

function displayName(m: Moderator): string {
  return m.name ?? m.email;
}

export const columns: ColumnDef<Moderator>[] = [
  {
    id: "moderator",
    accessorKey: "name",
    header: "Moderator",
    cell: ({ row }) => {
      const m = row.original;
      const initial = displayName(m).slice(0, 1).toUpperCase();
      return (
        <span className="inline-flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15 text-[11px] font-semibold text-accent">
            {initial}
          </span>
          <span className="font-medium text-slate-800">{m.name ?? "—"}</span>
        </span>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-slate-600">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ModeratorStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "onboardedAt",
    header: "Onboarded",
    cell: ({ row }) => (
      <span className="text-slate-500">
        {row.original.onboardedAt ? formatDate(row.original.onboardedAt) : "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <CellAction data={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
