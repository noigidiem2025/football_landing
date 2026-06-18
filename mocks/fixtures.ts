import type { Fixture, Team } from "@/lib/types";
import { teams } from "./teams";
import { findVenue } from "./venues";

interface FixtureTemplate {
  league: string;
  home: Team;
  away: Team;
  venue: string;
  /** Days from "today". */
  offset: number;
  /** Kickoff hour (UTC). */
  hour: number;
  predictionSlug?: string;
}

const WC = "World Cup 2026";

const templates: FixtureTemplate[] = [
  // Today
  { league: WC, home: teams.mexico, away: teams.usa, venue: "Estadio Azteca · Mexico City", offset: 0, hour: 17 },
  { league: WC, home: teams.brazil, away: teams.germany, venue: "MetLife Stadium · New Jersey", offset: 0, hour: 20, predictionSlug: "brazil-vs-germany" },
  { league: WC, home: teams.argentina, away: teams.france, venue: "SoFi Stadium · Los Angeles", offset: 0, hour: 23, predictionSlug: "argentina-vs-france" },
  // Tomorrow
  { league: WC, home: teams.croatia, away: teams.ghana, venue: "NRG Stadium · Houston", offset: 1, hour: 16 },
  { league: WC, home: teams.spain, away: teams.italy, venue: "AT&T Stadium · Dallas", offset: 1, hour: 18, predictionSlug: "spain-vs-italy" },
  { league: WC, home: teams.portugal, away: teams.netherlands, venue: "Hard Rock Stadium · Miami", offset: 1, hour: 21 },
  // This week
  { league: WC, home: teams.japan, away: teams.morocco, venue: "Lumen Field · Seattle", offset: 2, hour: 19 },
  { league: WC, home: teams.uruguay, away: teams.korea, venue: "BMO Field · Toronto", offset: 2, hour: 22 },
  { league: WC, home: teams.brazil, away: teams.mexico, venue: "MetLife Stadium · New Jersey", offset: 3, hour: 20 },
  { league: "Friendly", home: teams.france, away: teams.japan, venue: "Mercedes-Benz Stadium · Atlanta", offset: 3, hour: 18 },
  { league: "UEFA Euro", home: teams.spain, away: teams.croatia, venue: "AT&T Stadium · Dallas", offset: 4, hour: 19 },
  { league: "Copa América", home: teams.argentina, away: teams.uruguay, venue: "SoFi Stadium · Los Angeles", offset: 4, hour: 23 },
  { league: "Friendly", home: teams.germany, away: teams.italy, venue: "Arrowhead Stadium · Kansas City", offset: 5, hour: 18 },
  { league: "UEFA Euro", home: teams.netherlands, away: teams.portugal, venue: "Hard Rock Stadium · Miami", offset: 6, hour: 20 },
  { league: "Friendly", home: teams.usa, away: teams.ghana, venue: "NRG Stadium · Houston", offset: 6, hour: 21 },
];

/**
 * Build the fixture list relative to `now` (UTC midnight + offset days + hour),
 * so the Today / Tomorrow / This Week tabs always have realistic content.
 */
export function buildFixtures(now: Date): Fixture[] {
  const baseUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  return templates.map((t, i) => {
    const isWC = t.league === "World Cup 2026";
    const venueMeta = findVenue(t.venue);
    return {
      id: `fx-${i + 1}-${t.home.id}-${t.away.id}`,
      league: t.league,
      tournament: isWC ? "FIFA World Cup 2026" : t.league,
      round: isWC ? "Group Stage" : undefined,
      home: t.home,
      away: t.away,
      venue: t.venue,
      venueCity: venueMeta?.city,
      timezone: venueMeta?.timezone,
      kickoffISO: new Date(
        baseUTC + t.offset * 86_400_000 + t.hour * 3_600_000,
      ).toISOString(),
      // Demo schedule — real WC2026 fixtures not yet entered.
      status: "scheduled" as const,
      dataStatus: "placeholder" as const,
      predictionSlug: t.predictionSlug,
    };
  });
}
