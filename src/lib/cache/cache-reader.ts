import { cache } from "react";
import { footballMatchToMatchDetail } from "@/lib/api-football/mapper";
import type {
  FootballMatch,
  FootballResult,
  MatchDetail,
} from "@/lib/api-football/types";
import { localLeagueLogoPath, localLogoPathFromApiUrl, localTeamLogoPath } from "./logo-cache";
import { readJson } from "./cache-writer";

export interface CacheEnvelope<T> {
  source: "api-football";
  generatedAt: string;
  ttlSeconds: number;
  records: number;
  data: T;
}

export interface CachedLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  season: number;
}

export const CACHE_PATHS = {
  fixturesToday: "data/fixtures/today.json",
  fixturesTomorrow: "data/fixtures/tomorrow.json",
  fixturesWeek: "data/fixtures/week.json",
  liveMatches: "data/live/matches.json",
  leagues: "data/leagues/leagues.json",
  matchDetail: (fixtureId: number) => `data/matches/detail/${fixtureId}.json`,
  resultsRecent: "data/results/recent.json",
  resultsByDate: (date: string) => `data/results/${date}.json`,
  syncStatus: "data/metadata/sync-status.json",
} as const;

async function readEnvelope<T>(filePath: string): Promise<CacheEnvelope<T> | null> {
  return readJson<CacheEnvelope<T>>(filePath);
}

function withLocalMatchLogos(match: FootballMatch): FootballMatch {
  return {
    ...match,
    leagueLogo: localLeagueLogoPath(match.leagueId),
    homeTeamLogo: localTeamLogoPath(match.homeTeamId),
    awayTeamLogo: localTeamLogoPath(match.awayTeamId),
  };
}

function withLocalDetailLogos(match: MatchDetail): MatchDetail {
  return {
    ...match,
    leagueLogo: localLeagueLogoPath(match.leagueId),
    homeTeamLogo: localTeamLogoPath(match.homeTeamId),
    awayTeamLogo: localTeamLogoPath(match.awayTeamId),
  };
}

function withLocalResultLogos(result: FootballResult): FootballResult {
  return {
    ...result,
    leagueLogo: localLeagueLogoPath(result.leagueId),
    homeTeamLogo: localTeamLogoPath(result.homeTeamId),
    awayTeamLogo: localTeamLogoPath(result.awayTeamId),
  };
}

export const getTodayFixtures = cache(async (): Promise<FootballMatch[]> => {
  return ((await readEnvelope<FootballMatch[]>(CACHE_PATHS.fixturesToday))?.data ?? []).map(
    withLocalMatchLogos,
  );
});

export const getTomorrowFixtures = cache(async (): Promise<FootballMatch[]> => {
  return ((await readEnvelope<FootballMatch[]>(CACHE_PATHS.fixturesTomorrow))?.data ?? []).map(
    withLocalMatchLogos,
  );
});

export const getWeekFixtures = cache(async (): Promise<FootballMatch[]> => {
  return ((await readEnvelope<FootballMatch[]>(CACHE_PATHS.fixturesWeek))?.data ?? []).map(
    withLocalMatchLogos,
  );
});

export const getLiveMatches = cache(async (): Promise<FootballMatch[]> => {
  return ((await readEnvelope<FootballMatch[]>(CACHE_PATHS.liveMatches))?.data ?? []).map(
    withLocalMatchLogos,
  );
});

export const getCachedLeagues = cache(async (): Promise<CachedLeague[]> => {
  return ((await readEnvelope<CachedLeague[]>(CACHE_PATHS.leagues))?.data ?? []).map(
    (league) => ({
      ...league,
      logo: localLeagueLogoPath(league.id) || localLogoPathFromApiUrl(league.logo) || "",
    }),
  );
});

export const getCachedMatchDetail = cache(
  async (fixtureId: number): Promise<MatchDetail | null> => {
    const direct = await readEnvelope<MatchDetail>(CACHE_PATHS.matchDetail(fixtureId));
    if (direct?.data) return withLocalDetailLogos(direct.data);

    const [today, tomorrow, week, live] = await Promise.all([
      getTodayFixtures(),
      getTomorrowFixtures(),
      getWeekFixtures(),
      getLiveMatches(),
    ]);

    const seen = new Set<number>();
    const all = [...live, ...today, ...tomorrow, ...week].filter((match) => {
      if (seen.has(match.matchId)) return false;
      seen.add(match.matchId);
      return true;
    });
    const match = all.find((item) => item.matchId === fixtureId);
    return match ? withLocalDetailLogos(footballMatchToMatchDetail(match)) : null;
  },
);

export const getCachedRecentResults = cache(async (): Promise<FootballResult[]> => {
  return ((await readEnvelope<FootballResult[]>(CACHE_PATHS.resultsRecent))?.data ?? []).map(
    withLocalResultLogos,
  );
});

export const getCachedResultsByDate = cache(
  async (date: string): Promise<FootballResult[]> => {
    const direct = await readEnvelope<FootballResult[]>(CACHE_PATHS.resultsByDate(date));
    if (direct?.data) return direct.data.map(withLocalResultLogos);

    const recent = await getCachedRecentResults();
    return recent.filter((result) => result.localDate === date);
  },
);
