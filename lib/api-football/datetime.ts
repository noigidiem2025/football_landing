/** Date helpers anchored to the fixtures timezone (Asia/Ho_Chi_Minh). */

export const FIXTURES_TZ = "Asia/Ho_Chi_Minh";

/** `YYYY-MM-DD` in the fixtures timezone. */
export function hcmDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FIXTURES_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** `HH:mm` (24h) in the fixtures timezone. */
export function hcmTime(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: FIXTURES_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86_400_000);
}
