import { fetchHeadToHead, ApiFootballError } from "@/lib/api-football/client";
import type { CacheEnvelope } from "@/src/lib/cache/cache-reader";
import { localLogoPathFromApiUrl } from "@/src/lib/cache/logo-cache";
import { readJson, saveJson } from "@/src/lib/cache/cache-writer";
import type {
  HeadToHeadData,
  HeadToHeadMatch,
  RawFixtureItem,
} from "@/lib/api-football/types";

/**
 * Head-to-head service. Read-through cache: serves the local cache file while it
 * is fresh, otherwise fetches from API-Football and writes the cache. On API
 * failure it falls back to a stale cache, or an empty (but safe) shape. The
 * Next fetch layer also caches the API response, so user traffic for a given
 * pair triggers at most one upstream call per TTL window.
 */

const TTL_SECONDS = 86_400; // 24 hours

function cachePath(homeTeamId: number, awayTeamId: number): string {
  return `data/head-to-head/${homeTeamId}-${awayTeamId}.json`;
}

function isFresh(envelope: CacheEnvelope<HeadToHeadData>): boolean {
  const ageSeconds = (Date.now() - Date.parse(envelope.generatedAt)) / 1000;
  return Number.isFinite(ageSeconds) && ageSeconds < envelope.ttlSeconds;
}

function emptyData(homeTeamId: number, awayTeamId: number): HeadToHeadData {
  return {
    homeTeamId,
    awayTeamId,
    totalMatches: 0,
    homeWins: 0,
    awayWins: 0,
    draws: 0,
    recentMatches: [],
  };
}

function withLocalLogos(data: HeadToHeadData): HeadToHeadData {
  return {
    ...data,
    recentMatches: data.recentMatches.map((match) => ({
      ...match,
      leagueLogo: localLogoPathFromApiUrl(match.leagueLogo),
      homeTeamLogo: localLogoPathFromApiUrl(match.homeTeamLogo),
      awayTeamLogo: localLogoPathFromApiUrl(match.awayTeamLogo),
    })),
  };
}

function buildData(
  homeTeamId: number,
  awayTeamId: number,
  raw: RawFixtureItem[],
): HeadToHeadData {
  let total = 0;
  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;

  for (const item of raw) {
    const h = item.goals.home;
    const a = item.goals.away;
    if (h === null || a === null) continue; // not played → skip
    total += 1;
    if (h === a) {
      draws += 1;
      continue;
    }
    const winnerId = h > a ? item.teams.home.id : item.teams.away.id;
    if (winnerId === homeTeamId) homeWins += 1;
    else if (winnerId === awayTeamId) awayWins += 1;
  }

  const recentMatches: HeadToHeadMatch[] = [...raw]
    .sort((x, y) => (y.fixture.timestamp ?? 0) - (x.fixture.timestamp ?? 0))
    .slice(0, 5)
    .map((item) => ({
      fixtureId: item.fixture.id,
      date: item.fixture.date,
      leagueName: item.league.name,
      leagueLogo: item.league.logo || undefined,
      homeTeamName: item.teams.home.name,
      homeTeamLogo: item.teams.home.logo || undefined,
      awayTeamName: item.teams.away.name,
      awayTeamLogo: item.teams.away.logo || undefined,
      homeScore: item.goals.home,
      awayScore: item.goals.away,
      status: item.fixture.status.short,
    }));

  return { homeTeamId, awayTeamId, totalMatches: total, homeWins, awayWins, draws, recentMatches };
}

export async function getHeadToHead(
  homeTeamId: number,
  awayTeamId: number,
): Promise<HeadToHeadData> {
  if (!homeTeamId || !awayTeamId) return emptyData(homeTeamId, awayTeamId);

  const file = cachePath(homeTeamId, awayTeamId);
  const cached = await readJson<CacheEnvelope<HeadToHeadData>>(file);

  // 1) Fresh cache → use it (no API call).
  if (cached && isFresh(cached)) return withLocalLogos(cached.data);

  // 2) Stale / missing → fetch fresh.
  try {
    const raw = await fetchHeadToHead(homeTeamId, awayTeamId, TTL_SECONDS);
    const data = buildData(homeTeamId, awayTeamId, raw);

    // Best-effort write (read-only FS in some deploys must not lose fresh data).
    try {
      await saveJson(file, {
        source: "api-football",
        generatedAt: new Date().toISOString(),
        ttlSeconds: TTL_SECONDS,
        records: data.totalMatches,
        data,
      } satisfies CacheEnvelope<HeadToHeadData>);
    } catch (writeError) {
      console.error(
        `[head-to-head] cache write failed for ${homeTeamId}-${awayTeamId}:`,
        writeError instanceof Error ? writeError.message : String(writeError),
      );
    }

    return withLocalLogos(data);
  } catch (error) {
    const message =
      error instanceof ApiFootballError
        ? `${error.message}${error.status ? ` (${error.status})` : ""}`
        : error instanceof Error
          ? error.message
          : String(error);
    console.error(`[head-to-head] fetch failed for ${homeTeamId}-${awayTeamId}:`, message);

    // 3) Stale cache on error, else safe empty state.
    if (cached) return withLocalLogos(cached.data);
    return emptyData(homeTeamId, awayTeamId);
  }
}
