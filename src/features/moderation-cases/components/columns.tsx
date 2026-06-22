"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/format";
import type { Option } from "@/types/data-table";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { CaseFlagBadge } from "./CaseFlagBadge";
import { CellAction } from "./cell-action";
import {
  CASE_TYPE_LABELS,
  FLAG_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
} from "../labels";
import type { ModerationCaseListItem } from "../types/moderation-cases.types";

// Filter options derived from the label maps — consumed by DataTableToolbar via
// each column's `meta`, so the filter UI is declared here, not in the client.
const toOptions = (labels: Record<string, string>): Option[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const STATUS_OPTIONS = toOptions(STATUS_LABELS);
const SOURCE_OPTIONS = toOptions(SOURCE_LABELS);
const FLAG_OPTIONS = toOptions(FLAG_LABELS);

export const columns: ColumnDef<ModerationCaseListItem>[] = [
  {
    id: "case",
    accessorKey: "caseType",
    header: "Case",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800">
        {CASE_TYPE_LABELS[row.original.caseType]}
      </span>
    ),
    enableColumnFilter: false,
    enableHiding: false,
  },
  {
    id: "child",
    accessorKey: "child.username",
    header: "Child",
    cell: ({ row }) => {
      const username = row.original.child.username;
      const initial = username.slice(0, 1).toUpperCase();
      return (
        <span className="inline-flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15 text-[11px] font-semibold text-accent">
            {initial}
          </span>
          <span className="text-slate-700">{username}</span>
        </span>
      );
    },
    // Server-side search on the child's username.
    enableColumnFilter: true,
    meta: {
      label: "Child",
      variant: "text",
      placeholder: "Search by child username…",
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => (
      <span className="text-slate-600">{SOURCE_LABELS[row.original.source]}</span>
    ),
    enableColumnFilter: true,
    meta: { label: "Source", variant: "select", options: SOURCE_OPTIONS },
  },
  {
    accessorKey: "flag",
    header: "Flag",
    cell: ({ row }) => <CaseFlagBadge flag={row.original.flag} />,
    enableColumnFilter: true,
    meta: { label: "Flag", variant: "select", options: FLAG_OPTIONS },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <CaseStatusBadge status={row.original.status} />,
    enableColumnFilter: true,
    meta: { label: "Status", variant: "select", options: STATUS_OPTIONS },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-slate-500">{formatDate(row.original.createdAt)}</span>
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
