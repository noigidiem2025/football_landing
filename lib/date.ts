/**
 * Date helpers for fixtures. All bucketing/formatting is done in **UTC** so the
 * server (SSR) and client agree regardless of their local timezones — this
 * prevents hydration mismatches. Times are displayed as UTC.
 */

export function utcDayKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Add whole days in UTC (UTC has no DST, so ms arithmetic is safe). */
export function addUTCDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86_400_000);
}

export function formatTimeUTC(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

/** "Sun 15 Jun 2026" (UTC) — used for results date headers/filters. */
export function formatFullDateUTC(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "Today" / "Tomorrow" / "Mon 16 Jun" relative to a reference `now`. */
export function relativeDayLabel(iso: string, now: Date): string {
  const key = utcDayKey(new Date(iso));
  if (key === utcDayKey(now)) return "Today";
  if (key === utcDayKey(addUTCDays(now, 1))) return "Tomorrow";
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
