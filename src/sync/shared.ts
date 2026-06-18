import { promises as fs } from "fs";
import path from "path";
import { loadEnvConfig } from "@next/env";
import type { CacheEnvelope } from "@/src/lib/cache/cache-reader";
import { CACHE_PATHS } from "@/src/lib/cache/cache-reader";
import { readJson, saveJson } from "@/src/lib/cache/cache-writer";

export const TTL = {
  fixtures: 21_600,
  live: 60,
  leagues: 604_800,
  matchDetailLive: 60,
  matchDetailUpcoming: 3_600,
  matchDetailFinished: 86_400,
  results: 21_600,
} as const;

export interface SyncStatusEntry {
  name: string;
  status: "success" | "failed";
  startedAt: string;
  finishedAt: string;
  records: number;
  error?: string;
}

export type SyncStatus = Record<string, SyncStatusEntry>;

export function loadSyncEnv(): void {
  loadEnvConfig(process.cwd());
}

export function envelope<T>(data: T, ttlSeconds: number, records: number): CacheEnvelope<T> {
  return {
    source: "api-football",
    generatedAt: new Date().toISOString(),
    ttlSeconds,
    records,
    data,
  };
}

export async function appendSyncLog(entry: SyncStatusEntry): Promise<void> {
  const logPath = path.join(process.cwd(), "logs", "sync.log");
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  const message = [
    entry.finishedAt,
    entry.name,
    entry.status,
    `records=${entry.records}`,
    `started=${entry.startedAt}`,
    entry.error ? `error=${entry.error}` : null,
  ]
    .filter(Boolean)
    .join(" | ");
  await fs.appendFile(logPath, `${message}\n`, "utf8");
}

export async function writeSyncStatus(entry: SyncStatusEntry): Promise<void> {
  const current = (await readJson<SyncStatus>(CACHE_PATHS.syncStatus)) ?? {};
  await saveJson(CACHE_PATHS.syncStatus, { ...current, [entry.name]: entry });
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
