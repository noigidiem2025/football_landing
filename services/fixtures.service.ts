import {
  getTodayFixtures,
  getTomorrowFixtures,
  getWeekFixtures,
} from "@/src/lib/cache/cache-reader";
import type { FootballMatch } from "@/lib/api-football/types";

export { getTodayFixtures, getTomorrowFixtures };

export async function getThisWeekFixtures(): Promise<FootballMatch[]> {
  return getWeekFixtures();
}

export async function getFixturesByDate(date: string): Promise<FootballMatch[]> {
  const week = await getWeekFixtures();
  return week.filter((match) => match.date === date);
}

export async function getFixturesByRange(
  from: string,
  to: string,
): Promise<FootballMatch[]> {
  const week = await getWeekFixtures();
  return week.filter((match) => match.date >= from && match.date <= to);
}
