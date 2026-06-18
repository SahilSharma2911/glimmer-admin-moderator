/** Formats a date value for display, e.g. "May 21, 2026". */
export function formatDate(
  date: Date | string | number | undefined | null,
  opts: Intl.DateTimeFormatOptions = {},
): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch {
    return "";
  }
}
