import { fetchFixtures } from "@/lib/api-football/client";
import { FIXTURES_TZ } from "@/lib/api-football/datetime";
import { mapFixtureToMatchDetail } from "@/lib/api-football/mapper";
import type { MatchDetail } from "@/lib/api-football/types";
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

const LIVE_STATUSES = new Set(["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "INT", "SUSP"]);
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);

function detailTtl(statusShort: string): number {
  if (LIVE_STATUSES.has(statusShort)) return TTL.matchDetailLive;
  if (FINISHED_STATUSES.has(statusShort)) return TTL.matchDetailFinished;
  return TTL.matchDetailUpcoming;
}

function parseFixtureArg(args: string[]): number | null {
  const fixtureArg = args.find((arg) => arg.startsWith("--fixture="));
  const value = fixtureArg?.split("=")[1] ?? args[0];
  const fixtureId = Number(value);
  return Number.isInteger(fixtureId) && fixtureId > 0 ? fixtureId : null;
}

export async function syncMatchDetail(fixtureId: number): Promise<SyncStatusEntry> {
  loadSyncEnv();
  const startedAt = new Date().toISOString();

  try {
    const raw = await fetchFixtures(
      { id: fixtureId, timezone: FIXTURES_TZ },
      TTL.matchDetailLive,
    );
    const item = raw[0];
    if (!item) {
      throw new Error(`Fixture ${fixtureId} not found`);
    }

    const match: MatchDetail = mapFixtureToMatchDetail(item);
    await saveJson(
      CACHE_PATHS.matchDetail(fixtureId),
      envelope(match, detailTtl(match.statusShort), 1),
    );

    const entry: SyncStatusEntry = {
      name: `match-detail:${fixtureId}`,
      status: "success",
      startedAt,
      finishedAt: new Date().toISOString(),
      records: 1,
    };
    await appendSyncLog(entry);
    await writeSyncStatus(entry);
    return entry;
  } catch (error) {
    const entry: SyncStatusEntry = {
      name: `match-detail:${fixtureId}`,
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
  const fixtureId = parseFixtureArg(process.argv.slice(2));

  if (!fixtureId) {
    console.error("Usage: npm run sync:match-detail -- --fixture=123456");
    process.exitCode = 1;
  } else {
    syncMatchDetail(fixtureId).then((entry) => {
      if (entry.status === "failed") process.exitCode = 1;
      console.log(JSON.stringify(entry, null, 2));
    });
  }
}
