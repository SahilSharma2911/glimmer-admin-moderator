"use client";

import * as React from "react";
import Link from "next/link";
import {
  type PaginationState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Search } from "lucide-react";

import { DataTable } from "@/components/table/data-table";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { DataTableError } from "@/components/table/data-table-error";
import { DebouncedInput } from "@/components/table/debounced-input";
import { buttonVariants } from "@/components/ui/button";
import { UserPlusIcon } from "@/lib/icons";
import { useModerators } from "../hooks/useModerators";
import { columns } from "./columns";

const DEFAULT_PAGE_SIZE = 20;

export function ModeratorsClient() {
  // The query is gated on a JS-readable cookie that doesn't exist during SSR,
  // so defer state-dependent UI until mounted to avoid a hydration mismatch.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Table state lives in the URL so it's shareable and survives refresh/back.
  const [{ search, page, limit }, setQuery] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
    },
    { history: "push", clearOnDefault: true },
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const { data, isLoading, isError, error, refetch } = useModerators({
    page,
    limit,
    search: search.trim() || undefined,
  });

  const moderators = React.useMemo(() => data?.moderators ?? [], [data]);
  const total = data?.pagination.total ?? 0;

  const pagination = React.useMemo<PaginationState>(
    () => ({ pageIndex: page - 1, pageSize: limit }),
    [page, limit],
  );

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    const next =
      typeof updater === "function" ? updater(pagination) : updater;
    setQuery({ page: next.pageIndex + 1, limit: next.pageSize });
  };

  const table = useReactTable({
    data: moderators,
    columns,
    state: { pagination, columnVisibility },
    rowCount: total,
    manualPagination: true,
    onPaginationChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  // Searching resets to the first page.
  const onSearchChange = (value: string) =>
    setQuery({ search: value || null, page: 1 });

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Moderators
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Invite moderators and manage their access to the moderation
            dashboard.
          </p>
        </div>
        <Link
          href="/admin/moderators/new"
          className={buttonVariants({ variant: "brand" })}
        >
          <UserPlusIcon size={16} />
          Invite moderator
        </Link>
      </header>

      {mounted && isError ? (
        <DataTableError error={error} onRetry={() => refetch()} />
      ) : (
        <DataTable table={table} isLoading={!mounted || isLoading}>
          <div className="flex w-full items-center justify-between gap-2 p-1">
            <DebouncedInput
              value={search}
              onChange={onSearchChange}
              placeholder="Search by name or email…"
              icon={<Search className="h-4 w-4" />}
              className="h-10 w-56 bg-white focus:border-brand/40 focus:ring-brand/15 lg:w-72"
            />
            <DataTableViewOptions table={table} />
          </div>
        </DataTable>
      )}
    </div>
  );
}
