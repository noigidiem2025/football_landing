import type { Match } from "@/lib/types";
import { teams } from "./teams";

/** The single highlighted fixture rendered in the Featured Match section. */
export const featuredMatch: Match = {
  id: "bra-ger",
  status: "live",
  group: "Group A",
  home: teams.brazil,
  away: teams.germany,
  homeScore: 2,
  awayScore: 1,
  minute: "72'",
  venue: "MetLife Stadium · New Jersey",
  featured: true,
  // Demo sample — score is illustrative, not a real result.
  dataStatus: "demo",
};

/** Live + upcoming fixtures rendered in the Live Matches rail. */
const rawLiveMatches: Match[] = [
  {
    id: "bra-ger",
    status: "live",
    group: "Group A",
    home: teams.brazil,
    away: teams.germany,
    homeScore: 2,
    awayScore: 1,
    minute: "72'",
  },
  {
    id: "esp-ita",
    status: "live",
    group: "Group C",
    home: teams.spain,
    away: teams.italy,
    homeScore: 0,
    awayScore: 0,
    minute: "38'",
  },
  {
    id: "arg-fra",
    status: "upcoming",
    group: "Group B",
    home: teams.argentina,
    away: teams.france,
    kickoff: "Today · 23:00",
  },
  {
    id: "por-ned",
    status: "upcoming",
    group: "Group D",
    home: teams.portugal,
    away: teams.netherlands,
    kickoff: "Tomorrow · 18:00",
  },
  {
    id: "mex-usa",
    status: "upcoming",
    group: "Group A",
    home: teams.mexico,
    away: teams.usa,
    kickoff: "Jun 15 · 21:00",
  },
  {
    id: "cro-gha",
    status: "upcoming",
    group: "Group C",
    home: teams.croatia,
    away: teams.ghana,
    kickoff: "Jun 16 · 18:00",
  },
];

export const liveMatches: Match[] = rawLiveMatches.map((m) => ({
  dataStatus: "demo",
  ...m,
}));
