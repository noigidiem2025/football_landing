import { promises as fs } from "fs";
import path from "path";
import {
  cacheLogoAsset,
  parseApiFootballLogoUrl,
  type LogoAsset,
} from "@/src/lib/cache/logo-cache";
import {
  appendSyncLog,
  errorMessage,
  loadSyncEnv,
  writeSyncStatus,
  type SyncStatusEntry,
} from "./shared";

const CACHE_DIRECTORIES = [
  "data/fixtures",
  "data/live",
  "data/leagues",
  "data/results",
  "data/matches",
  "data/head-to-head",
];
const DOWNLOAD_CONCURRENCY = 12;

async function listJsonFiles(directory: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(path.join(process.cwd(), directory), {
      withFileTypes: true,
    });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const relativePath = path.join(directory, entry.name);
        if (entry.isDirectory()) return listJsonFiles(relativePath);
        return entry.isFile() && entry.name.endsWith(".json") ? [relativePath] : [];
      }),
    );
    return files.flat();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

function collectLogoAssets(value: unknown, assets: Map<string, LogoAsset>): void {
  if (typeof value === "string") {
    const asset = parseApiFootballLogoUrl(value);
    if (asset) assets.set(asset.publicPath, asset);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectLogoAssets(item, assets));
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectLogoAssets(item, assets));
  }
}

async function collectFromCache(): Promise<LogoAsset[]> {
  const files = (await Promise.all(CACHE_DIRECTORIES.map(listJsonFiles))).flat();
  const assets = new Map<string, LogoAsset>();

  for (const file of files) {
    const raw = await fs.readFile(path.join(process.cwd(), file), "utf8");
    collectLogoAssets(JSON.parse(raw), assets);
  }

  return [...assets.values()].sort((a, b) => a.publicPath.localeCompare(b.publicPath));
}

export async function syncLogoAssets(): Promise<SyncStatusEntry> {
  loadSyncEnv();
  const startedAt = new Date().toISOString();

  try {
    const assets = await collectFromCache();
    let saved = 0;
    let skipped = 0;
    const errors: string[] = [];

    let cursor = 0;
    const workers = Array.from(
      { length: Math.min(DOWNLOAD_CONCURRENCY, assets.length) },
      async () => {
        while (cursor < assets.length) {
          const asset = assets[cursor];
          cursor += 1;

          try {
            const result = await cacheLogoAsset(asset);
            if (result === "saved") saved += 1;
            else skipped += 1;
          } catch (error) {
            errors.push(`${asset.publicPath}: ${errorMessage(error)}`);
          }
        }
      }
    );
    await Promise.all(workers);

    const entry: SyncStatusEntry = {
      name: "logo-assets",
      status: "success",
      startedAt,
      finishedAt: new Date().toISOString(),
      records: saved + skipped,
      error: errors.length ? `${errors.length} logo(s) failed` : undefined,
    };
    await appendSyncLog(entry);
    await writeSyncStatus(entry);

    if (errors.length) {
      console.warn(errors.slice(0, 10).join("\n"));
      if (errors.length > 10) console.warn(`...and ${errors.length - 10} more`);
    }

    return entry;
  } catch (error) {
    const entry: SyncStatusEntry = {
      name: "logo-assets",
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
  syncLogoAssets().then((entry) => {
    if (entry.status === "failed") process.exitCode = 1;
    console.log(JSON.stringify(entry, null, 2));
  });
}
