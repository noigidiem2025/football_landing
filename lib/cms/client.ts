/**
 * Google Sheets transport. Reads a public sheet via the Sheets API v4 values
 * endpoint (read-only API key). No backend / DB of our own.
 *
 * Required env to go live:
 *   SHEET_ID                 - the spreadsheet id
 *   GOOGLE_SHEETS_API_KEY    - read-only API key (sheet shared "anyone with link")
 *   SHEET_PREDICTIONS_TAB    - tab name (default "predictions")
 *
 * When unset, callers fall back to local fixtures.
 */

const SHEET_ID = process.env.SHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const PREDICTIONS_TAB = process.env.SHEET_PREDICTIONS_TAB ?? "predictions";

/** Revalidate window (seconds) — ISR keeps pages static + the API key server-side. */
const REVALIDATE = 300;

export function isSheetConfigured(): boolean {
  return Boolean(SHEET_ID && API_KEY);
}

/**
 * Fetch raw rows (`string[][]`, including the header row) for a tab.
 * Returns null on any failure so callers can fall back gracefully.
 */
export async function fetchSheetRows(
  tab: string = PREDICTIONS_TAB,
): Promise<string[][] | null> {
  if (!SHEET_ID || !API_KEY) return null;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
    tab,
  )}?key=${API_KEY}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE, tags: [`cms:${tab}`] },
    });
    if (!res.ok) return null;
    const data: { values?: string[][] } = await res.json();
    return data.values ?? null;
  } catch {
    return null;
  }
}
