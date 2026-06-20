const pad = (n: number) => String(n).padStart(2, "0");

/** ISO → "YYYY-MM-DDTHH:mm" in local time, for a `datetime-local` input value. */
export function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** "YYYY-MM-DDTHH:mm" (local wall-clock) → ISO string for the API. */
export function localInputToIso(local: string): string {
  return new Date(local).toISOString();
}
