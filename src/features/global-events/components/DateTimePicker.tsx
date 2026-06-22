"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

const pad = (n: number) => String(n).padStart(2, "0");
const DEFAULT_TIME = "09:00";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1)); // 1–12
const MINUTES = Array.from({ length: 60 }, (_, i) => pad(i)); // 00–59
const MERIDIEMS = ["AM", "PM"] as const;

/** Date + "HH:mm" → "YYYY-MM-DDTHH:mm" (the datetime-local wire format). */
function toLocalValue(date: Date, time: string): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${time}`;
}

/** Midnight today — used to disable past dates in the calendar. */
function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

interface DateTimePickerProps {
  /** Controlled value as "YYYY-MM-DDTHH:mm" (local), or "" when unset. */
  value: string;
  onChange: (value: string) => void;
  id?: string;
  ariaInvalid?: boolean;
  /** Disable dates before today (default true). */
  disablePast?: boolean;
}

/**
 * Date + time picker built on the design-system Calendar + hour/minute/AM-PM
 * dropdowns, a friendlier replacement for the raw `<input type="datetime-local">`.
 * Emits the same local "YYYY-MM-DDTHH:mm" string so callers/validation are
 * unchanged.
 */
export function DateTimePicker({
  value,
  onChange,
  id,
  ariaInvalid,
  disablePast = true,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const parsed = value ? new Date(value) : null;
  const selectedDate =
    parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined;

  // Split the "HH:mm" (24h) portion into 12h dropdown parts.
  const hasTime = value.length >= 16;
  const h24 = hasTime ? Number(value.slice(11, 13)) : null;
  const minute = hasTime ? value.slice(14, 16) : "";
  const hour12 = h24 === null ? "" : String(h24 % 12 === 0 ? 12 : h24 % 12);
  const meridiem = h24 === null ? "" : h24 >= 12 ? "PM" : "AM";

  const onPickDate = (date: Date | undefined) => {
    if (!date) return;
    onChange(toLocalValue(date, hasTime ? value.slice(11, 16) : DEFAULT_TIME));
    setOpen(false);
  };

  // base-ui's onValueChange can emit null (cleared), so accept nullish and fall
  // back to the current parts via `??`.
  const applyTime = (next: {
    hour?: string | null;
    minute?: string | null;
    meridiem?: string | null;
  }) => {
    const h12 = Number(next.hour ?? hour12 ?? "") || 9;
    const min = next.minute ?? (minute || "00");
    const mer = next.meridiem ?? (meridiem || "AM");
    // 12h → 24h: 12 AM → 0, 12 PM → 12, else +12 for PM.
    const hour24 = mer === "PM" ? (h12 % 12) + 12 : h12 % 12;
    onChange(
      toLocalValue(selectedDate ?? startOfToday(), `${pad(hour24)}:${min}`),
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            data-invalid={ariaInvalid || undefined}
            className={cn(
              "flex h-11 min-w-56 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-left text-sm transition-colors",
              "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30",
              "data-[invalid=true]:border-red-400 data-[invalid=true]:focus:ring-red-200/70",
            )}
          >
            <CalendarIcon className="size-4 shrink-0 text-slate-400" />
            {selectedDate ? (
              <span className="text-slate-900">{formatDate(selectedDate)}</span>
            ) : (
              <span className="text-slate-400">Pick a date</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onPickDate}
            disabled={disablePast ? { before: startOfToday() } : undefined}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-1.5">
        <Select
          value={hour12}
          onValueChange={(v) => applyTime({ hour: v })}
        >
          <SelectTrigger className="h-11 w-18 bg-white data-[size=default]:h-11" aria-label="Hour">
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent>
            {HOURS.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-slate-400">:</span>

        <Select
          value={minute}
          onValueChange={(v) => applyTime({ minute: v })}
        >
          <SelectTrigger className="h-11 w-18 bg-white data-[size=default]:h-11" aria-label="Minute">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent>
            {MINUTES.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={meridiem}
          onValueChange={(v) => applyTime({ meridiem: v })}
        >
          <SelectTrigger className="h-11 w-20 bg-white data-[size=default]:h-11" aria-label="AM or PM">
            <SelectValue placeholder="AM" />
          </SelectTrigger>
          <SelectContent>
            {MERIDIEMS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
