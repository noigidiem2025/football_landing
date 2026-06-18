import type {
  PredictionArticle,
  Team,
  MatchStatus,
  PredictionOutcome,
  MatchStat,
  H2HMatch,
  FormResult,
} from "@/lib/types";
import { localImageOrFallback } from "@/lib/local-images";
import { teams } from "@/mocks/teams";

type Row = Record<string, string>;

/** Turn a sheet `string[][]` (header row + data) into keyed row objects. */
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

/** Defensive JSON cell parse — sheet content is untrusted, never throw. */
function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
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

const VALID_STATUS: MatchStatus[] = ["live", "upcoming", "finished"];

/** Map keyed rows → PredictionArticle[], skipping any malformed row. */
export function mapRowsToArticles(rows: string[][]): PredictionArticle[] {
  return rowsToObjects(rows)
    .map((r): PredictionArticle | null => {
      const home = resolveTeam(r.home_team_id ?? r.home ?? "");
      const away = resolveTeam(r.away_team_id ?? r.away ?? "");
      if (!r.slug || !home || !away) return null;

      const status = (VALID_STATUS.includes(r.status as MatchStatus)
        ? r.status
        : "upcoming") as MatchStatus;

      return {
        slug: r.slug,
        title: r.title || `${home.name} vs ${away.name} Prediction`,
        excerpt: r.excerpt || "",
        home,
        away,
        group: r.group || "",
        kickoffISO: r.kickoff_iso || r.kickoff || "",
        kickoffLabel: r.kickoff_label || "",
        venue: r.venue || "",
        status,
        homeScore: r.home_score ? Number(r.home_score) : undefined,
        awayScore: r.away_score ? Number(r.away_score) : undefined,
        minute: r.minute || undefined,
        outcomes: parseJson<PredictionOutcome[]>(r.outcomes, []),
        predictedScore: r.predicted_score || "",
        confidence: r.confidence ? Number(r.confidence) : 0,
        summary: r.summary || "",
        stats: parseJson<MatchStat[]>(r.stats, []),
        homeForm: parseJson<FormResult[]>(r.home_form, []),
        awayForm: parseJson<FormResult[]>(r.away_form, []),
        h2h: parseJson<H2HMatch[]>(r.h2h, []),
        body: r.body || "",
        author: r.author || "Match Center",
        publishedAt: r.published_at || "",
        coverImage: localImageOrFallback(r.cover_url),
        related: (r.related || "")
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean),
      };
    })
    .filter((a): a is PredictionArticle => a !== null);
}
