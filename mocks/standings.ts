import type { Group } from "@/lib/types";
import { teams } from "./teams";

/**
 * Tournament standings, grouped. Top two of each group qualify (highlighted).
 * DEMO DATA — real WC2026 group standings are not yet known (flagged placeholder).
 */
const groups: Group[] = [
  {
    name: "Group A",
    rows: [
      { pos: 1, team: teams.brazil, played: 2, won: 2, drawn: 0, lost: 0, gd: "+3", points: 6 },
      { pos: 2, team: teams.mexico, played: 2, won: 1, drawn: 1, lost: 0, gd: "+1", points: 4 },
      { pos: 3, team: teams.germany, played: 2, won: 0, drawn: 1, lost: 1, gd: "-1", points: 1 },
      { pos: 4, team: teams.usa, played: 2, won: 0, drawn: 0, lost: 2, gd: "-3", points: 0 },
    ],
  },
  {
    name: "Group B",
    rows: [
      { pos: 1, team: teams.argentina, played: 2, won: 2, drawn: 0, lost: 0, gd: "+4", points: 6 },
      { pos: 2, team: teams.france, played: 2, won: 1, drawn: 0, lost: 1, gd: "+1", points: 3 },
      { pos: 3, team: teams.japan, played: 2, won: 1, drawn: 0, lost: 1, gd: "0", points: 3 },
      { pos: 4, team: teams.morocco, played: 2, won: 0, drawn: 0, lost: 2, gd: "-5", points: 0 },
    ],
  },
  {
    name: "Group C",
    rows: [
      { pos: 1, team: teams.spain, played: 2, won: 1, drawn: 1, lost: 0, gd: "+2", points: 4 },
      { pos: 2, team: teams.croatia, played: 2, won: 1, drawn: 1, lost: 0, gd: "+1", points: 4 },
      { pos: 3, team: teams.italy, played: 2, won: 0, drawn: 1, lost: 1, gd: "-1", points: 1 },
      { pos: 4, team: teams.ghana, played: 2, won: 0, drawn: 1, lost: 1, gd: "-2", points: 1 },
    ],
  },
  {
    name: "Group D",
    rows: [
      { pos: 1, team: teams.portugal, played: 2, won: 2, drawn: 0, lost: 0, gd: "+5", points: 6 },
      { pos: 2, team: teams.netherlands, played: 2, won: 1, drawn: 0, lost: 1, gd: "+1", points: 3 },
      { pos: 3, team: teams.uruguay, played: 2, won: 1, drawn: 0, lost: 1, gd: "0", points: 3 },
      { pos: 4, team: teams.korea, played: 2, won: 0, drawn: 0, lost: 2, gd: "-6", points: 0 },
    ],
  },
];

export const standings: Group[] = groups.map((g) => ({
  ...g,
  dataStatus: "placeholder",
}));
