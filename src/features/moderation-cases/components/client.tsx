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

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { DataTableError } from "@/components/table/data-table-error";
import { columns } from "./columns";
import { useModerationCases } from "../hooks/useModerationCases";
import type {
  ListModerationCasesQuery,
  ModerationFlag,
  ModerationCaseSource,
  ModerationCaseStatus,
} from "../types/moderation-cases.types";

const DEFAULT_PAGE_SIZE = 20;

/** First entry of a faceted-filter value (it stores selections as an array). */
function first(value: unknown): string | undefined {
  return Array.isArray(value) && value.length ? String(value[0]) : undefined;
}

/**
 * Shared moderation-cases table. Mounted by both `/admin/cases` and
 * `/moderator/cases`. Filters are declared on the columns' `meta` and rendered
 * by <DataTableToolbar>; because the list is filtered/paginated server-side,
 * the only wiring here translates the table's `columnFilters` into the API
 * query (and mirrors it to the URL so it's shareable / survives refresh).
 */
export function ModerationCasesClient() {
  // The query is gated on a JS-readable cookie that doesn't exist during SSR,
  // so defer state-dependent UI until mounted to avoid a hydration mismatch.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [{ search, status, source, flag, page, limit }, setQuery] =
    useQueryStates(
      {
        search: parseAsString.withDefault(""),
        status: parseAsString.withDefault(""),
        source: parseAsString.withDefault(""),
        flag: parseAsString.withDefault(""),
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
      },
      { history: "push", clearOnDefault: true },
    );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Build the table's filter state from the URL params (faceted filters expect
  // their value as an array; the text filter expects a string).
  const columnFilters = React.useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (search) filters.push({ id: "child", value: search });
    if (status) filters.push({ id: "status", value: [status] });
    if (source) filters.push({ id: "source", value: [source] });
    if (flag) filters.push({ id: "flag", value: [flag] });
    return filters;
  }, [search, status, source, flag]);

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    const next =
      typeof updater === "function" ? updater(columnFilters) : updater;
    const value = (id: string) => next.find((f) => f.id === id)?.value;
    const child = value("child");
    // Any filter change resets to the first page.
    setQuery({
      search: typeof child === "string" && child ? child : null,
      status: first(value("status")) ?? null,
      source: first(value("source")) ?? null,
      flag: first(value("flag")) ?? null,
      page: 1,
    });
  };

  const query: ListModerationCasesQuery = {
    page,
    limit,
    search: search.trim() || undefined,
    status: (status as ModerationCaseStatus) || undefined,
    source: (source as ModerationCaseSource) || undefined,
    flag: (flag as ModerationFlag) || undefined,
  };

  const { data, isLoading, isError, error, refetch } = useModerationCases(query);

  const cases = React.useMemo(() => data?.cases ?? [], [data]);
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
    data: cases,
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
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Cases
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review content flagged by AI moderation or reported by users. Changing
          a case status records your review — it never alters the content.
        </p>
      </header>

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
