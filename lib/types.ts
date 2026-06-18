/** Shared domain types for the World Cup portal. All data is mock/local. */

export type MatchStatus =
  | "live"
  | "upcoming"
  | "scheduled"
  | "finished"
  | "tbd";

/** Provenance of a data record — distinguishes real data from demo/placeholder. */
export type DataStatus = "real" | "placeholder" | "demo";

/** Editorial state of long-form content. */
export type ContentStatus = "draft" | "published";

/** Real reference venue (one of the 16 official WC2026 host stadiums). */
export interface Venue {
  /** Stadium name as referenced by fixtures/results, e.g. "MetLife Stadium". */
  name: string;
  city: string;
  country: string;
  /** IANA timezone, e.g. "America/New_York". */
  timezone: string;
}

export interface Team {
  id: string;
  name: string;
  /** 3-letter display code, e.g. "BRA". */
  code: string;
  /** ISO-3166 alpha-2 code used to resolve the flag image, e.g. "br". */
  flag: string;
  /** Group/league assignment. Unconfirmed for WC2026 → undefined. */
  group?: string;
  dataStatus?: DataStatus;
}

export interface Match {
  id: string;
  status: MatchStatus;
  group: string;
  home: Team;
  away: Team;
  homeScore?: number;
  awayScore?: number;
  /** Live clock, e.g. "72'". */
  minute?: string;
  /** Human kickoff label for upcoming matches, e.g. "Today · 23:00". */
  kickoff?: string;
  venue?: string;
  featured?: boolean;
  /** "demo" — homepage sample scores are illustrative, not real results. */
  dataStatus?: DataStatus;
}

export type OutcomeTone = "home" | "draw" | "away";

export interface PredictionOutcome {
  label: string;
  pct: number;
  tone: OutcomeTone;
}

export interface Prediction {
  id: string;
  /** Links to the prediction detail route /predictions/[slug]. */
  slug: string;
  /** Stable cross-entity match key (links prediction ↔ article ↔ result). */
  matchId?: string;
  title: string;
  meta: string;
  home: Team;
  away: Team;
  outcomes: PredictionOutcome[];
  /** Editorial state — "draft" until real expert content is written. */
  contentStatus?: ContentStatus;
}

export interface StandingRow {
  pos: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: string;
  points: number;
}

export interface Group {
  name: string;
  rows: StandingRow[];
  /** "placeholder" until the real WC2026 group standings are known. */
  dataStatus?: DataStatus;
}

/** Richer standings row (with recent form) used by the dedicated Standings page. */
export interface StandingsTeamRow {
  pos: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: FormResult[];
}

export interface LeagueTable {
  id: string;
  name: string;
  shortName: string;
  /** Top N rows highlighted as leaders / qualification. */
  promotionZone: number;
  /** Bottom M rows highlighted as the relegation zone. */
  relegationZone: number;
  promotionLabel: string;
  relegationLabel: string;
  rows: StandingsTeamRow[];
  /** "placeholder" until real standings are known. */
  dataStatus?: DataStatus;
}

export interface NavItem {
  label: string;
  href: string;
}

/* ----------------------------------- News ---------------------------------- */

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  /** ISO 8601 publish date. */
  publishedAt: string;
  /** Markdown-ish body (`## ` headings, blank-line paragraphs). */
  body: string;
  tags: string[];
  featured?: boolean;
  /** Links the article to a match, when applicable. */
  matchId?: string;
  /** "draft" until real editorial content is published. */
  status?: ContentStatus;
  /** Cover image URL (optional). Falls back to a themed gradient when absent. */
  coverUrl?: string;
  coverAlt?: string;
}

/* ------------------------------- Conversion -------------------------------- */

export type CtaPlacement =
  | "sticky"
  | "exit_intent"
  | "in_article"
  | "floating"
  | "sidebar";

export interface Cta {
  placement: CtaPlacement;
  enabled: boolean;
  title: string;
  subtitle?: string;
  ctaLabel: string;
  /** Destination URL — configurable from the Google Sheet. */
  href: string;
  badge?: string;
}

export type CtaConfig = Partial<Record<CtaPlacement, Cta>>;

export interface VipTip {
  match: string;
  market: string;
  odds: string;
  locked: boolean;
}

export interface Fixture {
  id: string;
  league: string;
  /** Competition name, e.g. "FIFA World Cup 2026". */
  tournament?: string;
  /** e.g. "Group Stage", "Round of 32", "Final". */
  round?: string;
  /** Tournament match day number, when known. */
  matchDay?: number;
  home: Team;
  away: Team;
  /** ISO 8601 kickoff (UTC). */
  kickoffISO: string;
  /** IANA timezone of the venue, e.g. "America/New_York". */
  timezone?: string;
  /** Stadium / venue. */
  venue: string;
  /** Host city of the venue. */
  venueCity?: string;
  /** scheduled | live | finished | tbd. Absent → treated as upcoming. */
  status?: MatchStatus;
  /** Slug of a prediction article, when one exists. */
  predictionSlug?: string;
  dataStatus?: DataStatus;
}

/* --------------------------------- Results --------------------------------- */

export type MatchEventType =
  | "goal"
  | "penalty"
  | "own_goal"
  | "yellow"
  | "red"
  | "sub";

export interface MatchEvent {
  /** Match minute (1-90+). */
  minute: number;
  /** Stoppage-time minutes, e.g. 90+`3`. */
  extra?: number;
  side: "home" | "away";
  player: string;
  /** Assisting player (goals) or player coming on (subs). */
  assist?: string;
  type: MatchEventType;
}

export interface MatchResult {
  id: string;
  /** Stable cross-entity match key (links result ↔ prediction/article). */
  matchId?: string;
  league: string;
  tournament?: string;
  round?: string;
  home: Team;
  away: Team;
  /** ISO 8601 kickoff (UTC) — the match date. */
  kickoffISO: string;
  venue: string;
  venueCity?: string;
  timezone?: string;
  ftHome: number;
  ftAway: number;
  htHome: number;
  htAway: number;
  /** Outcome from the home team's perspective. */
  winner?: "home" | "away" | "draw";
  /** Human label, e.g. "Brazil win" / "Draw". */
  resultLabel?: string;
  events: MatchEvent[];
  /** "demo" — these scores are illustrative, not real WC2026 results. */
  dataStatus?: DataStatus;
}

/* ----------------------------- Prediction article ----------------------------- */

export type FormResult = "W" | "D" | "L";

export interface MatchStat {
  label: string;
  home: number;
  away: number;
  /** "%" renders values as percentages and the bar as home/away share. */
  unit?: "%" | "";
}

export interface H2HMatch {
  date: string;
  competition: string;
  homeCode: string;
  awayCode: string;
  score: string;
  winner: "home" | "away" | "draw";
}

/**
 * A full prediction article. Mirrors one row of the Google Sheet
 * `predictions` tab; nested fields (outcomes/stats/h2h/forms) are stored as
 * JSON strings in their cells and parsed by the CMS mapper.
 */
export interface PredictionArticle {
  slug: string;
  /** Stable cross-entity match key (links article ↔ prediction/result). */
  matchId?: string;
  title: string;
  excerpt: string;
  home: Team;
  away: Team;
  group: string;
  tournament?: string;
  round?: string;
  /** ISO 8601 kickoff, used for SEO/JSON-LD. */
  kickoffISO: string;
  kickoffLabel: string;
  venue: string;
  venueCity?: string;
  timezone?: string;
  status: MatchStatus;
  /** "draft" until real expert content is written. */
  contentStatus?: ContentStatus;
  homeScore?: number;
  awayScore?: number;
  minute?: string;
  outcomes: PredictionOutcome[];
  predictedScore: string;
  confidence: number;
  summary: string;
  stats: MatchStat[];
  homeForm: FormResult[];
  awayForm: FormResult[];
  h2h: H2HMatch[];
  /** Markdown-ish body (`## ` headings, blank-line paragraphs). */
  body: string;
  author: string;
  publishedAt: string;
  coverImage?: string;
  related: string[];
}

/* --------------------------------- Knockout -------------------------------- */

/**
 * A knockout-stage tie whose teams are not yet confirmed. Uses string
 * placeholder labels ("Winner Group A", "Runner-up Group B", "TBD") instead of
 * `Team` objects so no flag/asset is required.
 */
export interface KnockoutTie {
  id: string;
  round: string;
  matchDay?: number;
  /** ISO date if scheduled, else undefined. */
  dateISO?: string;
  homeLabel: string;
  awayLabel: string;
  venue?: string;
  venueCity?: string;
  status: "tbd";
  dataStatus: DataStatus;
}
