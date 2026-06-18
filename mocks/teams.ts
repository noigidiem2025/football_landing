import type { Team } from "@/lib/types";

/** Central team registry — referenced by matches, predictions and standings. */
export const teams = {
  brazil: { id: "brazil", name: "Brazil", code: "BRA", flag: "br" },
  germany: { id: "germany", name: "Germany", code: "GER", flag: "de" },
  mexico: { id: "mexico", name: "Mexico", code: "MEX", flag: "mx" },
  usa: { id: "usa", name: "USA", code: "USA", flag: "us" },
  argentina: { id: "argentina", name: "Argentina", code: "ARG", flag: "ar" },
  france: { id: "france", name: "France", code: "FRA", flag: "fr" },
  japan: { id: "japan", name: "Japan", code: "JPN", flag: "jp" },
  morocco: { id: "morocco", name: "Morocco", code: "MAR", flag: "ma" },
  spain: { id: "spain", name: "Spain", code: "ESP", flag: "es" },
  italy: { id: "italy", name: "Italy", code: "ITA", flag: "it" },
  croatia: { id: "croatia", name: "Croatia", code: "CRO", flag: "hr" },
  ghana: { id: "ghana", name: "Ghana", code: "GHA", flag: "gh" },
  portugal: { id: "portugal", name: "Portugal", code: "POR", flag: "pt" },
  netherlands: { id: "netherlands", name: "Netherlands", code: "NED", flag: "nl" },
  uruguay: { id: "uruguay", name: "Uruguay", code: "URU", flag: "uy" },
  korea: { id: "korea", name: "South Korea", code: "KOR", flag: "kr" },
} satisfies Record<string, Team>;
