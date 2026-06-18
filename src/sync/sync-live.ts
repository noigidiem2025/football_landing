import { fetchFixtures } from "@/lib/api-football/client";
import { FIXTURES_TZ } from "@/lib/api-football/datetime";
import { kickoffKey, mapFixture } from "@/lib/api-football/mapper";
import type { FootballMatch } from "@/lib/api-football/types";
import { CACHE_PATHS } from "@/src/lib/cache/cache-reader";
import { saveJson } from "@/src/lib/cache/cache-writer";
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

export async function syncLive(): Promise<SyncStatusEntry> {
  loadSyncEnv();
  const startedAt = new Date().toISOString();

  try {
    const raw = await fetchFixtures({ live: "all", timezone: FIXTURES_TZ }, TTL.live);
    const matches = sorted(raw.map(mapFixture));
    await saveJson(CACHE_PATHS.liveMatches, envelope(matches, TTL.live, matches.length));

    const entry: SyncStatusEntry = {
      name: "live",
      status: "success",
      startedAt,
      finishedAt: new Date().toISOString(),
      records: matches.length,
    };
    await appendSyncLog(entry);
    await writeSyncStatus(entry);
    return entry;
  } catch (error) {
    const entry: SyncStatusEntry = {
      name: "live",
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
  syncLive().then((entry) => {
    if (entry.status === "failed") process.exitCode = 1;
    console.log(JSON.stringify(entry, null, 2));
  });
}
