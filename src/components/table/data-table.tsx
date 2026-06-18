import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import type * as React from "react";

import { DataTablePagination } from "@/components/table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  isLoading = false,
  onRowClick,
}: DataTableProps<TData>) {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      {children}
      <div className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
        <ScrollArea className="w-full">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white">
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            style={{
                              ...getCommonPinningStyles({
                                column: header.column,
                              }),
                            }}
                            className="bg-white px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                          >
                            {(() => {
                              const rendered = header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  );

                              return rendered || `FALLBACK-${header.id}`;
                            })()}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Show skeleton rows when loading
                  Array.from({ length: 8 }).map((_, index) => (
                    <TableRow
                      key={`skeleton-${index}`}
                      className="hover:bg-transparent"
                    >
                      {table.getVisibleLeafColumns().map((column) => (
                        <TableCell
                          key={column.id}
                          style={{
                            ...getCommonPinningStyles({ column }),
                          }}
                        >
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                      className={
                        onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                      }
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-3
                          "
                          style={{
                            ...getCommonPinningStyles({ column: cell.column }),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <DataTablePagination
            table={table}
            className="border-t border-slate-200 px-4 py-4"
          />
        </div>
      {actionBar &&
        table.getFilteredSelectedRowModel().rows.length > 0 &&
        actionBar}
    </div>
  );
}
