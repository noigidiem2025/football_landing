import { fetchFixtures } from "@/lib/api-football/client";
import { addDays, FIXTURES_TZ, hcmDate } from "@/lib/api-football/datetime";
import { kickoffKey, mapFixture } from "@/lib/api-football/mapper";
import type { FootballMatch } from "@/lib/api-football/types";
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

function sorted(list: FootballMatch[]): FootballMatch[] {
  return [...list].sort((a, b) => kickoffKey(a).localeCompare(kickoffKey(b)));
}

async function fetchByDate(date: string): Promise<FootballMatch[]> {
  const raw = await fetchFixtures({ date, timezone: FIXTURES_TZ }, TTL.fixtures);
  return sorted(raw.map(mapFixture));
}

async function writeCollection(
  path: string,
  data: FootballMatch[],
): Promise<number> {
  await saveJson(path, envelope(data, TTL.fixtures, data.length));
  return data.length;
}

async function previousCollection(path: string): Promise<FootballMatch[]> {
  return (await readJson<CacheEnvelope<FootballMatch[]>>(path))?.data ?? [];
}

export async function syncFixtures(): Promise<SyncStatusEntry> {
  loadSyncEnv();
  const startedAt = new Date().toISOString();

  try {
    const now = new Date();
    const dates = Array.from({ length: 7 }, (_, index) => hcmDate(addDays(now, index)));
    const daily = await Promise.allSettled(dates.map(fetchByDate));
    const today =
      daily[0]?.status === "fulfilled"
        ? daily[0].value
        : await previousCollection(CACHE_PATHS.fixturesToday);
    const tomorrow =
      daily[1]?.status === "fulfilled"
        ? daily[1].value
        : await previousCollection(CACHE_PATHS.fixturesTomorrow);
    const successfulWeek = daily.flatMap((result) =>
      result.status === "fulfilled" ? result.value : [],
    );
    const week = successfulWeek.length
      ? sorted(successfulWeek)
      : await previousCollection(CACHE_PATHS.fixturesWeek);

    const records =
      (await writeCollection(CACHE_PATHS.fixturesToday, today)) +
      (await writeCollection(CACHE_PATHS.fixturesTomorrow, tomorrow)) +
      (await writeCollection(CACHE_PATHS.fixturesWeek, week));

    const entry: SyncStatusEntry = {
      name: "fixtures",
      status: "success",
      startedAt,
      finishedAt: new Date().toISOString(),
      records,
    };
    await appendSyncLog(entry);
    await writeSyncStatus(entry);
    return entry;
  } catch (error) {
    const entry: SyncStatusEntry = {
      name: "fixtures",
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
  syncFixtures().then((entry) => {
    if (entry.status === "failed") process.exitCode = 1;
    console.log(JSON.stringify(entry, null, 2));
  });
}
