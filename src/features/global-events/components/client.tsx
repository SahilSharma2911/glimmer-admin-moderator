"use client";

import * as React from "react";
import {
  type ColumnFiltersState,
  type PaginationState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import Link from "next/link";
import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { DataTableError } from "@/components/table/data-table-error";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { LiveEventCard } from "./LiveEventCard";
import { GlobalEventTabs, type EventTab } from "./GlobalEventTabs";
import { useGlobalEvents } from "../hooks/useGlobalEvents";
import { useGlobalEventCounts } from "../hooks/useGlobalEventCounts";
import type {
  EventStatus,
  ListGlobalEventsQuery,
} from "../types/global-events.types";

const DEFAULT_PAGE_SIZE = 20;

/**
 * Admin global-events table. Filters are declared on the columns' `meta` and
 * rendered by <DataTableToolbar>; because the list is paginated/filtered
 * server-side, the only wiring here maps the table's `columnFilters` into the
 * API query (mirrored to the URL so it's shareable / survives refresh).
 */
export function GlobalEventsClient() {
  // The query is gated on a JS-readable cookie that doesn't exist during SSR,
  // so defer state-dependent UI until mounted to avoid a hydration mismatch.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [{ search, status, page, limit }, setQuery] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      status: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
    },
    { history: "push", clearOnDefault: true },
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Status is driven by the tabs (below); the toolbar only owns the name search.
  const columnFilters = React.useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (search) filters.push({ id: "name", value: search });
    return filters;
  }, [search]);

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    const next =
      typeof updater === "function" ? updater(columnFilters) : updater;
    const name = next.find((f) => f.id === "name")?.value;
    // Any filter change resets to the first page.
    setQuery({
      search: typeof name === "string" && name ? name : null,
      page: 1,
    });
  };

  const { counts } = useGlobalEventCounts();
  const activeTab: EventTab = status ? (status as EventStatus) : "ALL";
  const onTabChange = (tab: EventTab) =>
    setQuery({ status: tab === "ALL" ? null : tab, page: 1 });

  const query: ListGlobalEventsQuery = {
    page,
    limit,
    search: search.trim() || undefined,
    status: (status as EventStatus) || undefined,
  };

  const { data, isLoading, isError, error, refetch } = useGlobalEvents(query);

  const events = React.useMemo(() => data?.events ?? [], [data]);
  const total = data?.pagination.total ?? 0;

  const pagination = React.useMemo<PaginationState>(
    () => ({ pageIndex: page - 1, pageSize: limit }),
    [page, limit],
  );

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    setQuery({ page: next.pageIndex + 1, limit: next.pageSize });
  };

  const table = useReactTable({
    data: events,
    columns,
    state: { pagination, columnVisibility, columnFilters },
    rowCount: total,
    manualPagination: true,
    manualFiltering: true,
    onPaginationChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Global Light Ritual
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Schedule shared moments of care every child can join in realtime.
          </p>
        </div>
        <Link
          href="/admin/global-light-ritual/new"
          className={buttonVariants({ variant: "brand" })}
        >
          <Plus size={16} />
          Create event
        </Link>
      </header>

      <LiveEventCard />

      <GlobalEventTabs
        value={activeTab}
        onChange={onTabChange}
        counts={counts}
      />

      {mounted && isError ? (
        <DataTableError error={error} onRetry={() => refetch()} />
      ) : (
        <DataTable table={table} isLoading={!mounted || isLoading}>
          <DataTableToolbar table={table} />
        </DataTable>
      )}
    </div>
  );
}
