import type { Prediction } from "@/lib/types";
import { teams } from "./teams";

export const predictions: Prediction[] = [
  {
    id: "bra-ger",
    slug: "brazil-vs-germany",
    matchId: "wc26-bra-ger",
    contentStatus: "draft",
    title: "Brazil vs Germany",
    meta: "Group A · Today 20:00",
    home: teams.brazil,
    away: teams.germany,
    outcomes: [
      { label: "Brazil", pct: 62, tone: "home" },
      { label: "Draw", pct: 21, tone: "draw" },
      { label: "Germany", pct: 17, tone: "away" },
    ],
  },
  {
    id: "arg-fra",
    slug: "argentina-vs-france",
    matchId: "wc26-arg-fra",
    contentStatus: "draft",
    title: "Argentina vs France",
    meta: "Group B · Today 23:00",
    home: teams.argentina,
    away: teams.france,
    outcomes: [
      { label: "Argentina", pct: 45, tone: "home" },
      { label: "Draw", pct: 27, tone: "draw" },
      { label: "France", pct: 28, tone: "away" },
    ],
  },
  {
    id: "esp-ita",
    slug: "spain-vs-italy",
    matchId: "wc26-esp-ita",
    contentStatus: "draft",
    title: "Spain vs Italy",
    meta: "Group C · Tomorrow 18:00",
    home: teams.spain,
    away: teams.italy,
    outcomes: [
      { label: "Spain", pct: 50, tone: "home" },
      { label: "Draw", pct: 30, tone: "draw" },
      { label: "Italy", pct: 20, tone: "away" },
    ],
  },
];
