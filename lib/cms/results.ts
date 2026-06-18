import { cache } from "react";
import type { MatchResult, MatchEvent, MatchEventType } from "@/lib/types";
import { fetchSheetRows } from "./client";
import { results as fallbackResults } from "@/mocks/results";
import { teams } from "@/mocks/teams";
import type { Team } from "@/lib/types";

const RESULTS_TAB = process.env.SHEET_RESULTS_TAB ?? "results";

type Row = Record<string, string>;

function rowsToObjects(rows: string[][]): Row[] {
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const obj: Row = {};
    headers.forEach((h, i) => {
      obj[h] = (cells[i] ?? "").trim();
    });
    return obj;
  });
}

function resolveTeam(idOrCode: string): Team | null {
  const key = idOrCode?.toLowerCase();
  const direct = (teams as Record<string, Team>)[key];
  if (direct) return direct;
  return (
    Object.values(teams).find(
      (t) => t.code.toLowerCase() === key || t.flag === key,
    ) ?? null
  );
}

const EVENT_TYPES: MatchEventType[] = [
  "goal",
  "penalty",
  "own_goal",
  "yellow",
  "red",
  "sub",
];

/** Parse the `events` JSON cell defensively — sheet content is untrusted. */
function parseEvents(value: string | undefined): MatchEvent[] {
  if (!value) return [];
  try {
    const raw = JSON.parse(value) as unknown[];
    if (!Array.isArray(raw)) return [];
    return raw
      .map((e): MatchEvent | null => {
        const ev = e as Partial<MatchEvent>;
        if (
          typeof ev.minute !== "number" ||
          (ev.side !== "home" && ev.side !== "away") ||
          typeof ev.player !== "string" ||
          !EVENT_TYPES.includes(ev.type as MatchEventType)
        ) {
          return null;
        }
        return {
          minute: ev.minute,
          extra: typeof ev.extra === "number" ? ev.extra : undefined,
          side: ev.side,
          player: ev.player,
          assist: typeof ev.assist === "string" ? ev.assist : undefined,
          type: ev.type as MatchEventType,
        };
      })
      .filter((e): e is MatchEvent => e !== null);
  } catch {
    return [];
  }
}

function mapRowsToResults(rows: string[][]): MatchResult[] {
  return rowsToObjects(rows)
    .map((r): MatchResult | null => {
      const home = resolveTeam(r.home_team_id ?? r.home ?? "");
      const away = resolveTeam(r.away_team_id ?? r.away ?? "");
      if (!r.id || !home || !away) return null;
      return {
        id: r.id,
        league: r.league || "",
        home,
        away,
        kickoffISO: r.kickoff_iso || r.kickoff || "",
        venue: r.venue || "",
        ftHome: Number(r.ft_home ?? 0) || 0,
        ftAway: Number(r.ft_away ?? 0) || 0,
        htHome: Number(r.ht_home ?? 0) || 0,
        htAway: Number(r.ht_away ?? 0) || 0,
        events: parseEvents(r.events),
      };
    })
    .filter((r): r is MatchResult => r !== null);
}

/** Finished match results — live Google Sheet rows when configured, else fixtures. */
export const getResults = cache(async (): Promise<MatchResult[]> => {
  const rows = await fetchSheetRows(RESULTS_TAB);
  if (rows) {
    const mapped = mapRowsToResults(rows);
    if (mapped.length > 0) return mapped;
  }
  return fallbackResults;
});
