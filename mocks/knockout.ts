import type { KnockoutTie } from "@/lib/types";

/**
 * PLACEHOLDER knockout bracket. The WC2026 knockout structure (Round of 32 →
 * Final) and the round dates/venues below are real/announced, but the
 * qualifying teams are NOT yet confirmed, so every tie uses placeholder labels
 * ("Winner Group X", "Runner-up Group Y", "TBD"). Do not present as confirmed.
 *
 * Exact match-to-match slotting is intentionally NOT invented — replace with the
 * official bracket once the group stage concludes.
 */
export const knockout: KnockoutTie[] = [
  // Round of 32 (Jun 28 – Jul 3) — representative placeholder ties.
  { id: "ko-r32-1", round: "Round of 32", dateISO: "2026-06-28", homeLabel: "Winner Group A", awayLabel: "Runner-up Group B", venue: "Estadio Azteca", venueCity: "Mexico City", status: "tbd", dataStatus: "placeholder" },
  { id: "ko-r32-2", round: "Round of 32", dateISO: "2026-06-29", homeLabel: "Winner Group C", awayLabel: "Runner-up Group D", venue: "AT&T Stadium", venueCity: "Dallas", status: "tbd", dataStatus: "placeholder" },
  { id: "ko-r32-3", round: "Round of 32", dateISO: "2026-06-30", homeLabel: "Winner Group E", awayLabel: "Runner-up Group F", venue: "MetLife Stadium", venueCity: "New York / New Jersey", status: "tbd", dataStatus: "placeholder" },
  { id: "ko-r32-4", round: "Round of 32", dateISO: "2026-07-01", homeLabel: "Winner Group B", awayLabel: "3rd Group A/C/D", venue: "SoFi Stadium", venueCity: "Los Angeles", status: "tbd", dataStatus: "placeholder" },

  // Round of 16 (Jul 4 – Jul 7)
  { id: "ko-r16-1", round: "Round of 16", dateISO: "2026-07-04", homeLabel: "Winner R32-1", awayLabel: "Winner R32-2", venue: "Hard Rock Stadium", venueCity: "Miami", status: "tbd", dataStatus: "placeholder" },
  { id: "ko-r16-2", round: "Round of 16", dateISO: "2026-07-05", homeLabel: "Winner R32-3", awayLabel: "Winner R32-4", venue: "Lincoln Financial Field", venueCity: "Philadelphia", status: "tbd", dataStatus: "placeholder" },

  // Quarter-finals (Jul 9 – Jul 11)
  { id: "ko-qf-1", round: "Quarter-final", dateISO: "2026-07-09", homeLabel: "Winner R16-1", awayLabel: "Winner R16-2", venue: "Gillette Stadium", venueCity: "Boston", status: "tbd", dataStatus: "placeholder" },
  { id: "ko-qf-2", round: "Quarter-final", dateISO: "2026-07-11", homeLabel: "Winner R16-3", awayLabel: "Winner R16-4", venue: "Arrowhead Stadium", venueCity: "Kansas City", status: "tbd", dataStatus: "placeholder" },

  // Semi-finals (Jul 14 – Jul 15)
  { id: "ko-sf-1", round: "Semi-final", dateISO: "2026-07-14", homeLabel: "Winner QF-1", awayLabel: "Winner QF-2", venue: "AT&T Stadium", venueCity: "Dallas", status: "tbd", dataStatus: "placeholder" },
  { id: "ko-sf-2", round: "Semi-final", dateISO: "2026-07-15", homeLabel: "Winner QF-3", awayLabel: "Winner QF-4", venue: "Mercedes-Benz Stadium", venueCity: "Atlanta", status: "tbd", dataStatus: "placeholder" },

  // Third place (Jul 18) & Final (Jul 19) — venues/dates are real.
  { id: "ko-3p", round: "Third-place play-off", dateISO: "2026-07-18", homeLabel: "Loser SF-1", awayLabel: "Loser SF-2", venue: "Hard Rock Stadium", venueCity: "Miami", status: "tbd", dataStatus: "placeholder" },
  { id: "ko-final", round: "Final", dateISO: "2026-07-19", homeLabel: "Winner SF-1", awayLabel: "Winner SF-2", venue: "MetLife Stadium", venueCity: "New York / New Jersey", status: "tbd", dataStatus: "placeholder" },
];
