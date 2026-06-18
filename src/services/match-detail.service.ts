import { getCachedMatchDetail } from "@/src/lib/cache/cache-reader";
import type { MatchDetail } from "@/lib/api-football/types";

export async function getMatchDetail(fixtureId: number): Promise<MatchDetail | null> {
  return getCachedMatchDetail(fixtureId);
}
