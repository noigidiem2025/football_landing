import type { MatchResult } from "@/lib/types";
import { teams } from "./teams";
import { findVenue } from "./venues";

/**
 * Offline fallback for the Google Sheet `results` tab.
 *
 * DEMO DATA — these scores are illustrative, NOT real WC2026 results. Each row
 * is flagged `dataStatus: "demo"`. Replace with real finished results (via the
 * sheet) once matches are actually played.
 */
const rawResults: MatchResult[] = [
  {
    id: "bra-ger-0615",
    league: "World Cup 2026",
    home: teams.brazil,
    away: teams.germany,
    kickoffISO: "2026-06-15T20:00:00Z",
    venue: "MetLife Stadium · New Jersey",
    ftHome: 2,
    ftAway: 1,
    htHome: 1,
    htAway: 0,
    events: [
      { minute: 23, side: "home", player: "Vinícius Jr.", assist: "Raphinha", type: "goal" },
      { minute: 38, side: "away", player: "Rüdiger", type: "yellow" },
      { minute: 58, side: "away", player: "Havertz", type: "goal" },
      { minute: 67, side: "home", player: "Rodrygo", type: "penalty" },
      { minute: 80, side: "home", player: "Casemiro", type: "yellow" },
      { minute: 90, extra: 2, side: "away", player: "Kimmich", type: "red" },
    ],
  },
  {
    id: "mex-usa-0615",
    league: "World Cup 2026",
    home: teams.mexico,
    away: teams.usa,
    kickoffISO: "2026-06-15T17:00:00Z",
    venue: "Estadio Azteca · Mexico City",
    ftHome: 1,
    ftAway: 1,
    htHome: 0,
    htAway: 1,
    events: [
      { minute: 30, side: "away", player: "Pulisic", type: "goal" },
      { minute: 44, side: "home", player: "Edson Álvarez", type: "yellow" },
      { minute: 72, side: "home", player: "Jiménez", type: "penalty" },
      { minute: 88, side: "away", player: "McKennie", type: "yellow" },
    ],
  },
  {
    id: "arg-uru-0614",
    league: "Copa América",
    home: teams.argentina,
    away: teams.uruguay,
    kickoffISO: "2026-06-14T23:00:00Z",
    venue: "SoFi Stadium · Los Angeles",
    ftHome: 3,
    ftAway: 0,
    htHome: 2,
    htAway: 0,
    events: [
      { minute: 12, side: "home", player: "Messi", type: "goal" },
      { minute: 34, side: "home", player: "J. Álvarez", assist: "Messi", type: "goal" },
      { minute: 41, side: "away", player: "Araújo", type: "yellow" },
      { minute: 70, side: "home", player: "L. Martínez", type: "goal" },
    ],
  },
  {
    id: "esp-ita-0614",
    league: "UEFA Euro",
    home: teams.spain,
    away: teams.italy,
    kickoffISO: "2026-06-14T18:00:00Z",
    venue: "AT&T Stadium · Dallas",
    ftHome: 2,
    ftAway: 2,
    htHome: 1,
    htAway: 1,
    events: [
      { minute: 18, side: "home", player: "Morata", type: "goal" },
      { minute: 40, side: "away", player: "Chiesa", type: "goal" },
      { minute: 55, side: "home", player: "Rodri", type: "yellow" },
      { minute: 63, side: "home", player: "Yamal", assist: "Pedri", type: "goal" },
      { minute: 85, side: "away", player: "Retegui", type: "penalty" },
      { minute: 90, extra: 1, side: "away", player: "Barella", type: "yellow" },
    ],
  },
  {
    id: "fra-jpn-0613",
    league: "Friendly",
    home: teams.france,
    away: teams.japan,
    kickoffISO: "2026-06-13T18:00:00Z",
    venue: "Mercedes-Benz Stadium · Atlanta",
    ftHome: 4,
    ftAway: 1,
    htHome: 2,
    htAway: 0,
    events: [
      { minute: 9, side: "home", player: "Mbappé", type: "goal" },
      { minute: 27, side: "home", player: "Griezmann", assist: "Mbappé", type: "goal" },
      { minute: 49, side: "away", player: "Kubo", type: "goal" },
      { minute: 58, side: "home", player: "Mbappé", type: "penalty" },
      { minute: 75, side: "home", player: "Dembélé", type: "goal" },
      { minute: 81, side: "away", player: "Endo", type: "yellow" },
    ],
  },
  {
    id: "por-ned-0613",
    league: "UEFA Euro",
    home: teams.portugal,
    away: teams.netherlands,
    kickoffISO: "2026-06-13T15:00:00Z",
    venue: "Hard Rock Stadium · Miami",
    ftHome: 0,
    ftAway: 0,
    htHome: 0,
    htAway: 0,
    events: [
      { minute: 35, side: "home", player: "Bruno Fernandes", type: "yellow" },
      { minute: 60, side: "away", player: "De Jong", type: "yellow" },
      { minute: 78, side: "home", player: "Rúben Dias", type: "red" },
    ],
  },
];

/** Derive winner/result label and attach venue + provenance metadata. */
function enrich(r: MatchResult): MatchResult {
  const winner: MatchResult["winner"] =
    r.ftHome > r.ftAway ? "home" : r.ftAway > r.ftHome ? "away" : "draw";
  const resultLabel =
    winner === "home"
      ? `${r.home.name} win`
      : winner === "away"
        ? `${r.away.name} win`
        : "Draw";
  const venueMeta = findVenue(r.venue);
  return {
    ...r,
    matchId: r.matchId ?? r.id,
    tournament: r.tournament ?? (r.league === "World Cup 2026" ? "FIFA World Cup 2026" : r.league),
    round: r.round ?? "Group Stage",
    venueCity: r.venueCity ?? venueMeta?.city,
    timezone: r.timezone ?? venueMeta?.timezone,
    winner,
    resultLabel,
    dataStatus: "demo",
  };
}

export const results: MatchResult[] = rawResults.map(enrich);
