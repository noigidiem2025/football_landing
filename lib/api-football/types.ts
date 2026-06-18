/** Raw API-Football v3 `/fixtures` response shapes (only fields we use). */
export interface RawFixtureItem {
  fixture: {
    id: number;
    timezone: string;
    date: string; // ISO with the requested timezone offset
    timestamp: number;
    status: { long: string; short: string; elapsed: number | null };
    venue: { id: number | null; name: string | null; city: string | null };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    round: string;
    season: number;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner?: boolean | null };
    away: { id: number; name: string; logo: string; winner?: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score?: {
    halftime?: { home: number | null; away: number | null };
    fulltime?: { home: number | null; away: number | null };
  };
}

export interface ApiFootballResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: unknown; // [] on success, object/array of messages on error
  results: number;
  response: T[];
}

/** Internal, UI-facing match model (provider-agnostic). */
export interface FootballMatch {
  matchId: number;
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  season: number;
  round: string;
  /** Provider kickoff ISO string with timezone offset. */
  isoDate: string;
  /** Provider kickoff unix timestamp. */
  timestamp: number;
  /** Local match date `YYYY-MM-DD` (Asia/Ho_Chi_Minh). */
  date: string;
  /** Local kickoff `HH:mm` (Asia/Ho_Chi_Minh). */
  kickoffTime: string;
  timezone: string;
  status: string;
  statusShort: string;
  elapsed: number | null;
  venueName: string | null;
  venueCity: string | null;
  homeTeamId: number;
  homeTeamName: string;
  homeTeamLogo: string;
  homeWinner: boolean | null;
  awayTeamId: number;
  awayTeamName: string;
  awayTeamLogo: string;
  awayWinner: boolean | null;
  homeScore: number | null;
  awayScore: number | null;
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface MatchDetail {
  fixtureId: number;
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  season: number;
  round: string;
  /** Provider kickoff ISO string with timezone offset. */
  date: string;
  timestamp: number;
  timezone: string;
  status: string;
  statusShort: string;
  elapsed: number | null;
  venueName: string | null;
  venueCity: string | null;
  homeTeamId: number;
  homeTeamName: string;
  homeTeamLogo: string;
  homeWinner: boolean | null;
  awayTeamId: number;
  awayTeamName: string;
  awayTeamLogo: string;
  awayWinner: boolean | null;
  homeScore: number | null;
  awayScore: number | null;
  halfTimeHomeScore: number | null;
  halfTimeAwayScore: number | null;
  fullTimeHomeScore: number | null;
  fullTimeAwayScore: number | null;
}

export interface FootballResult extends MatchDetail {
  /** Local match date `YYYY-MM-DD` (Asia/Ho_Chi_Minh). */
  localDate: string;
  /** Local kickoff `HH:mm` (Asia/Ho_Chi_Minh). */
  kickoffTime: string;
}

/** One previous meeting between two teams. */
export interface HeadToHeadMatch {
  fixtureId: number;
  /** Provider ISO date string. */
  date: string;
  leagueName: string;
  leagueLogo?: string;
  homeTeamName: string;
  homeTeamLogo?: string;
  awayTeamName: string;
  awayTeamLogo?: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
}

/** Normalized head-to-head summary for a pair of teams. */
export interface HeadToHeadData {
  homeTeamId: number;
  awayTeamId: number;
  totalMatches: number;
  /** Wins of `homeTeamId` (across both venues). */
  homeWins: number;
  /** Wins of `awayTeamId` (across both venues). */
  awayWins: number;
  draws: number;
  recentMatches: HeadToHeadMatch[];
}
