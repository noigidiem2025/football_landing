import type { Venue } from "@/lib/types";

/**
 * REAL DATA — the 16 official FIFA World Cup 2026 host stadiums, with host city,
 * country and IANA timezone. These were announced publicly and are verifiable.
 * (Match assignments to these venues in the demo fixtures remain placeholder.)
 */
export const venues: Venue[] = [
  { name: "MetLife Stadium", city: "New York / New Jersey", country: "USA", timezone: "America/New_York" },
  { name: "AT&T Stadium", city: "Dallas", country: "USA", timezone: "America/Chicago" },
  { name: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA", timezone: "America/New_York" },
  { name: "NRG Stadium", city: "Houston", country: "USA", timezone: "America/Chicago" },
  { name: "Arrowhead Stadium", city: "Kansas City", country: "USA", timezone: "America/Chicago" },
  { name: "Lincoln Financial Field", city: "Philadelphia", country: "USA", timezone: "America/New_York" },
  { name: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA", timezone: "America/Los_Angeles" },
  { name: "SoFi Stadium", city: "Los Angeles", country: "USA", timezone: "America/Los_Angeles" },
  { name: "Lumen Field", city: "Seattle", country: "USA", timezone: "America/Los_Angeles" },
  { name: "Gillette Stadium", city: "Boston", country: "USA", timezone: "America/New_York" },
  { name: "Hard Rock Stadium", city: "Miami", country: "USA", timezone: "America/New_York" },
  { name: "BMO Field", city: "Toronto", country: "Canada", timezone: "America/Toronto" },
  { name: "BC Place", city: "Vancouver", country: "Canada", timezone: "America/Vancouver" },
  { name: "Estadio Azteca", city: "Mexico City", country: "Mexico", timezone: "America/Mexico_City" },
  { name: "Estadio BBVA", city: "Monterrey", country: "Mexico", timezone: "America/Monterrey" },
  { name: "Estadio Akron", city: "Guadalajara", country: "Mexico", timezone: "America/Mexico_City" },
];

/** Resolve venue metadata from a stadium name (matches on the leading name). */
export function findVenue(stadium: string): Venue | undefined {
  const name = stadium.split("·")[0].trim().toLowerCase();
  return venues.find((v) => name.startsWith(v.name.toLowerCase()));
}
