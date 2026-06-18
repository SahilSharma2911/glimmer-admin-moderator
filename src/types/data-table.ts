import type { FC, SVGProps } from "react";
import type { RowData } from "@tanstack/react-table";

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: FC<SVGProps<SVGSVGElement>>;
}

export type FilterVariant =
  | "text"
  | "number"
  | "range"
  | "date"
  | "dateRange"
  | "boolean"
  | "select"
  | "multiSelect";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    /** Numeric range [min, max] for range/slider filters. */
    range?: [number, number];
    /** Unit suffix for numeric filters (e.g. "hrs"). */
    unit?: string;
    icon?: FC<SVGProps<SVGSVGElement>>;
  }
}
