import { fetchFixtures } from "@/lib/api-football/client";
import { addDays, FIXTURES_TZ, hcmDate } from "@/lib/api-football/datetime";
import { footballMatchToResult, kickoffKey, mapFixture } from "@/lib/api-football/mapper";
import type { FootballMatch, FootballResult } from "@/lib/api-football/types";
import { CACHE_PATHS, type CacheEnvelope } from "@/src/lib/cache/cache-reader";
import { readJson, saveJson } from "@/src/lib/cache/cache-writer";
import {
  appendSyncLog,
  envelope,
  errorMessage,
  loadSyncEnv,
  TTL,
  writeSyncStatus,
  type SyncStatusEntry,
} from "./shared";

const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);
const RECENT_DAYS = 7;

function newestFirst(a: FootballResult, b: FootballResult): number {
  return `${b.localDate}T${b.kickoffTime}`.localeCompare(`${a.localDate}T${a.kickoffTime}`);
}

function finishedOnly(match: FootballMatch): boolean {
  return FINISHED_STATUSES.has(match.statusShort);
}

async function fetchResultsByDate(date: string): Promise<FootballResult[]> {
  const raw = await fetchFixtures({ date, timezone: FIXTURES_TZ }, TTL.results);
  return raw
    .map(mapFixture)
    .filter(finishedOnly)
    .sort((a, b) => kickoffKey(b).localeCompare(kickoffKey(a)))
    .map(footballMatchToResult);
}

async function previousRecentResults(): Promise<FootballResult[]> {
  return (await readJson<CacheEnvelope<FootballResult[]>>(CACHE_PATHS.resultsRecent))?.data ?? [];
}

async function writeDateCache(date: string, results: FootballResult[]): Promise<void> {
  await saveJson(CACHE_PATHS.resultsByDate(date), envelope(results, TTL.results, results.length));
}

export async function syncResults(): Promise<SyncStatusEntry> {
  loadSyncEnv();
  const startedAt = new Date().toISOString();

  try {
    const now = new Date();
    const dates = Array.from({ length: RECENT_DAYS }, (_, index) =>
      hcmDate(addDays(now, -index)),
    );
    const previous = await previousRecentResults();
    const daily = await Promise.allSettled(dates.map(fetchResultsByDate));
    const merged: FootballResult[] = [];
    let successfulDays = 0;

    for (const [index, result] of daily.entries()) {
      const date = dates[index];
      if (result.status === "fulfilled") {
        successfulDays += 1;
        merged.push(...result.value);
        await writeDateCache(date, result.value);
      } else {
        merged.push(...previous.filter((item) => item.localDate === date));
      }
    }

    if (successfulDays === 0) {
      throw new Error("Unable to refresh any results date");
    }

    const results = [...merged].sort(newestFirst);
    await saveJson(CACHE_PATHS.resultsRecent, envelope(results, TTL.results, results.length));

    const entry: SyncStatusEntry = {
      name: "results",
      status: "success",
      startedAt,
      finishedAt: new Date().toISOString(),
      records: results.length,
    };
    await appendSyncLog(entry);
    await writeSyncStatus(entry);
    return entry;
  } catch (error) {
    const entry: SyncStatusEntry = {
      name: "results",
      status: "failed",
      startedAt,
      finishedAt: new Date().toISOString(),
      records: 0,
      error: errorMessage(error),
    };
    await appendSyncLog(entry);
    await writeSyncStatus(entry);
    return entry;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncResults().then((entry) => {
    if (entry.status === "failed") process.exitCode = 1;
    console.log(JSON.stringify(entry, null, 2));
  });
}
