import { getLiveMatches as readLiveMatches } from "@/src/lib/cache/cache-reader";
import type { FootballMatch } from "@/lib/api-football/types";

export async function getLiveMatches(): Promise<FootballMatch[]> {
  return readLiveMatches();
}
