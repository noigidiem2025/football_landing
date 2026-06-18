import type { ApiFootballResponse, RawFixtureItem } from "./types";
import { FIXTURES_TZ } from "./datetime";

/**
 * Centralized API-Football v3 client. SERVER-ONLY: it reads `API_FOOTBALL_KEY`
 * (no `NEXT_PUBLIC_` prefix → never shipped to the browser). UI code must read
 * local cache through `src/services/*`; only sync jobs should import this client.
 */

const API_BASE = "https://v3.football.api-sports.io";

export class ApiFootballError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiFootballError";
    this.status = status;
  }
}

export interface FixturesQuery {
  id?: string | number;
  live?: string;
  date?: string;
  from?: string;
  to?: string;
  league?: string | number;
  season?: string | number;
  timezone?: string;
}

function hasApiErrors(errors: unknown): boolean {
  if (Array.isArray(errors)) return errors.length > 0;
  if (errors && typeof errors === "object") return Object.keys(errors).length > 0;
  return false;
}

/** Fetch raw `/fixtures` rows with the given query and ISR cache window. */
export async function fetchFixtures(
  query: FixturesQuery,
  revalidate: number,
): Promise<RawFixtureItem[]> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    throw new ApiFootballError("Missing API_FOOTBALL_KEY environment variable");
  }

  const params = new URLSearchParams();
  params.set("timezone", query.timezone ?? FIXTURES_TZ);
  if (query.id != null) params.set("id", String(query.id));
  if (query.live) params.set("live", query.live);
  if (query.date) params.set("date", query.date);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.league != null) params.set("league", String(query.league));
  if (query.season != null) params.set("season", String(query.season));

  const url = `${API_BASE}/fixtures?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "x-apisports-key": key },
      next: { revalidate, tags: ["api-football:fixtures"] },
    });
  } catch {
    throw new ApiFootballError("Network error calling API-Football");
  }

  if (!res.ok) {
    throw new ApiFootballError(`API-Football responded ${res.status}`, res.status);
  }

  const data = (await res.json()) as ApiFootballResponse<RawFixtureItem>;
  if (hasApiErrors(data.errors)) {
    throw new ApiFootballError(`API-Football error: ${JSON.stringify(data.errors)}`);
  }

  return data.response ?? [];
}

/** Fetch head-to-head fixtures between two teams. */
export async function fetchHeadToHead(
  homeTeamId: number,
  awayTeamId: number,
  revalidate: number,
): Promise<RawFixtureItem[]> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    throw new ApiFootballError("Missing API_FOOTBALL_KEY environment variable");
  }

  const params = new URLSearchParams();
  params.set("h2h", `${homeTeamId}-${awayTeamId}`);
  params.set("timezone", FIXTURES_TZ);

  const url = `${API_BASE}/fixtures/headtohead?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "x-apisports-key": key },
      next: { revalidate, tags: ["api-football:h2h"] },
    });
  } catch {
    throw new ApiFootballError("Network error calling API-Football");
  }

  if (!res.ok) {
    throw new ApiFootballError(`API-Football responded ${res.status}`, res.status);
  }

  const data = (await res.json()) as ApiFootballResponse<RawFixtureItem>;
  if (hasApiErrors(data.errors)) {
    throw new ApiFootballError(`API-Football error: ${JSON.stringify(data.errors)}`);
  }

  return data.response ?? [];
}

export interface RawLeagueItem {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
  seasons: Array<{
    year: number;
    current: boolean;
  }>;
}

export async function fetchLeagues(revalidate: number): Promise<RawLeagueItem[]> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    throw new ApiFootballError("Missing API_FOOTBALL_KEY environment variable");
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/leagues?current=true`, {
      headers: { "x-apisports-key": key },
      next: { revalidate, tags: ["api-football:leagues"] },
    });
  } catch {
    throw new ApiFootballError("Network error calling API-Football");
  }

  if (!res.ok) {
    throw new ApiFootballError(`API-Football responded ${res.status}`, res.status);
  }

  const data = (await res.json()) as ApiFootballResponse<RawLeagueItem>;
  if (hasApiErrors(data.errors)) {
    throw new ApiFootballError(`API-Football error: ${JSON.stringify(data.errors)}`);
  }

  return data.response ?? [];
}
