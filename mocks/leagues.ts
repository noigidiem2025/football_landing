import type { LeagueTable, StandingsTeamRow, FormResult, Team } from "@/lib/types";
import { teams } from "./teams";

type RowSeed = [
  team: Team,
  w: number,
  d: number,
  l: number,
  gf: number,
  ga: number,
  form: FormResult[],
];

/** Build sorted, positioned rows (points desc, then goal difference). */
function table(
  meta: Omit<LeagueTable, "rows">,
  seeds: RowSeed[],
): LeagueTable {
  const rows: StandingsTeamRow[] = seeds
    .map(([team, w, d, l, gf, ga, form]) => ({
      pos: 0,
      team,
      played: w + d + l,
      won: w,
      drawn: d,
      lost: l,
      gf,
      ga,
      gd: gf - ga,
      points: w * 3 + d,
      form,
    }))
    .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
    .map((row, i) => ({ ...row, pos: i + 1 }));

  return { ...meta, rows };
}

const zoneLabels = {
  promotionZone: 1,
  relegationZone: 1,
  promotionLabel: "Leader · advances",
  relegationLabel: "Relegation zone",
  // Demo standings — not real WC2026/competition data.
  dataStatus: "placeholder" as const,
};

export const leagues: LeagueTable[] = [
  table(
    { id: "league-a", name: "Nations League · League A", shortName: "League A", ...zoneLabels },
    [
      [teams.france, 4, 1, 1, 12, 6, ["W", "W", "D", "W", "L"]],
      [teams.spain, 3, 2, 1, 10, 7, ["W", "D", "W", "L", "W"]],
      [teams.italy, 2, 1, 3, 8, 10, ["L", "W", "L", "D", "L"]],
      [teams.germany, 1, 0, 5, 4, 11, ["L", "L", "L", "W", "L"]],
    ],
  ),
  table(
    { id: "league-b", name: "Nations League · League B", shortName: "League B", ...zoneLabels },
    [
      [teams.argentina, 5, 0, 1, 15, 5, ["W", "W", "W", "L", "W"]],
      [teams.brazil, 3, 1, 2, 11, 8, ["W", "L", "D", "W", "L"]],
      [teams.uruguay, 2, 1, 3, 7, 9, ["L", "W", "L", "W", "L"]],
      [teams.mexico, 0, 2, 4, 4, 15, ["L", "D", "L", "L", "D"]],
    ],
  ),
  table(
    { id: "league-c", name: "Nations League · League C", shortName: "League C", ...zoneLabels },
    [
      [teams.portugal, 4, 2, 0, 13, 4, ["W", "W", "D", "W", "D"]],
      [teams.netherlands, 3, 1, 2, 10, 7, ["W", "L", "W", "D", "W"]],
      [teams.croatia, 1, 3, 2, 6, 8, ["D", "D", "L", "W", "D"]],
      [teams.japan, 0, 2, 4, 3, 13, ["L", "D", "L", "L", "D"]],
    ],
  ),
  table(
    { id: "league-d", name: "Nations League · League D", shortName: "League D", ...zoneLabels },
    [
      [teams.usa, 4, 1, 1, 11, 6, ["W", "W", "L", "D", "W"]],
      [teams.morocco, 3, 1, 2, 9, 7, ["W", "D", "W", "L", "W"]],
      [teams.ghana, 2, 1, 3, 8, 9, ["L", "W", "D", "L", "W"]],
      [teams.korea, 1, 1, 4, 5, 11, ["L", "L", "W", "D", "L"]],
    ],
  ),
];
