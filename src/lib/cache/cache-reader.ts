import { cache } from "react";
import { footballMatchToMatchDetail } from "@/lib/api-football/mapper";
import type {
  FootballMatch,
  FootballResult,
  MatchDetail,
} from "@/lib/api-football/types";
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

export const getTodayFixtures = cache(async (): Promise<FootballMatch[]> => {
  return (await readEnvelope<FootballMatch[]>(CACHE_PATHS.fixturesToday))?.data ?? [];
});

export const getTomorrowFixtures = cache(async (): Promise<FootballMatch[]> => {
  return (await readEnvelope<FootballMatch[]>(CACHE_PATHS.fixturesTomorrow))?.data ?? [];
});

export const getWeekFixtures = cache(async (): Promise<FootballMatch[]> => {
  return (await readEnvelope<FootballMatch[]>(CACHE_PATHS.fixturesWeek))?.data ?? [];
});

export const getLiveMatches = cache(async (): Promise<FootballMatch[]> => {
  return (await readEnvelope<FootballMatch[]>(CACHE_PATHS.liveMatches))?.data ?? [];
});

export const getCachedLeagues = cache(async (): Promise<CachedLeague[]> => {
  return (await readEnvelope<CachedLeague[]>(CACHE_PATHS.leagues))?.data ?? [];
});

export const getCachedMatchDetail = cache(
  async (fixtureId: number): Promise<MatchDetail | null> => {
    const direct = await readEnvelope<MatchDetail>(CACHE_PATHS.matchDetail(fixtureId));
    if (direct?.data) return direct.data;

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
    return match ? footballMatchToMatchDetail(match) : null;
  },
);

export const getCachedRecentResults = cache(async (): Promise<FootballResult[]> => {
  return (await readEnvelope<FootballResult[]>(CACHE_PATHS.resultsRecent))?.data ?? [];
});

export const getCachedResultsByDate = cache(
  async (date: string): Promise<FootballResult[]> => {
    const direct = await readEnvelope<FootballResult[]>(CACHE_PATHS.resultsByDate(date));
    if (direct?.data) return direct.data;

    const recent = await getCachedRecentResults();
    return recent.filter((result) => result.localDate === date);
  },
);
