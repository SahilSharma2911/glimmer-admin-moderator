import type { Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  /** Noun shown in "N–M of T <label>". */
  rowLabel?: string;
  /** Page-size choices for the "Rows per page" selector. */
  pageSizeOptions?: number[];
}

/** Builds the page list with ellipses, e.g. [1, "…", 4, 5, 6, "…", 20]. */
function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: (number | "ellipsis")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) items.push("ellipsis");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
}

export function DataTablePagination<TData>({
  table,
  rowLabel = "results",
  pageSizeOptions = [10, 20, 50, 100],
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  // `getRowCount()` honours a manually-set `rowCount` (the server total) and
  // falls back to the client row count otherwise.
  const total = table.getRowCount();
  const pageCount = table.getPageCount();
  const current = pageIndex + 1;
  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);

  const navClass =
    "flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-3 px-1 sm:flex-row",
        className,
      )}
      {...props}
    >
      <p className="text-sm text-slate-500">
        {start}-{end} of {total} {rowLabel}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-slate-500 sm:inline">
            Rows per page
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) =>
              // Reset to the first page so we never land on an empty page.
              table.setPagination({ pageIndex: 0, pageSize: Number(value) })
            }
          >
            <SelectTrigger size="sm" className="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="First page"
          className={navClass}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <DoubleArrowLeftIcon />
        </button>
        <button
          type="button"
          aria-label="Previous page"
          className={navClass}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
        </button>

        {getPageItems(current, pageCount).map((item, i) =>
          item === "ellipsis" ? (
            <span
              key={`e-${i}`}
              className="flex size-8 items-center justify-center text-sm text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === current ? "page" : undefined}
              onClick={() => table.setPageIndex(item - 1)}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                item === current
                  ? "bg-[#6A45E6] text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          className={navClass}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
        </button>
        <button
          type="button"
          aria-label="Last page"
          className={navClass}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <DoubleArrowRightIcon />
        </button>
        </div>
      </div>
    </div>
  );
}
