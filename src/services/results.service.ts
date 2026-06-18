import {
  getCachedRecentResults,
  getCachedResultsByDate,
} from "@/src/lib/cache/cache-reader";
import type { FootballResult } from "@/lib/api-football/types";

export async function getRecentResults(): Promise<FootballResult[]> {
  return getCachedRecentResults();
}

export async function getResultsByDate(date: string): Promise<FootballResult[]> {
  return getCachedResultsByDate(date);
}

export async function getResultsByRange(
  from: string,
  to: string,
): Promise<FootballResult[]> {
  const recent = await getRecentResults();
  return recent.filter((result) => result.localDate >= from && result.localDate <= to);
}
