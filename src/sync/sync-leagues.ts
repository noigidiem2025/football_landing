import { fetchLeagues } from "@/lib/api-football/client";
import { CACHE_PATHS, type CachedLeague } from "@/src/lib/cache/cache-reader";
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

export async function syncLeagues(): Promise<SyncStatusEntry> {
  loadSyncEnv();
  const startedAt = new Date().toISOString();

  try {
    const raw = await fetchLeagues(TTL.leagues);
    const leagues: CachedLeague[] = raw
      .map((item) => {
        const currentSeason =
          item.seasons.find((season) => season.current) ?? item.seasons[0];
        return {
          id: item.league.id,
          name: item.league.name,
          country: item.country.name,
          logo: item.league.logo,
          season: currentSeason?.year ?? new Date().getFullYear(),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    await saveJson(CACHE_PATHS.leagues, envelope(leagues, TTL.leagues, leagues.length));

    const entry: SyncStatusEntry = {
      name: "leagues",
      status: "success",
      startedAt,
      finishedAt: new Date().toISOString(),
      records: leagues.length,
    };
    await appendSyncLog(entry);
    await writeSyncStatus(entry);
    return entry;
  } catch (error) {
    const entry: SyncStatusEntry = {
      name: "leagues",
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
  syncLeagues().then((entry) => {
    if (entry.status === "failed") process.exitCode = 1;
    console.log(JSON.stringify(entry, null, 2));
  });
}
