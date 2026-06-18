import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();

export function resolveCachePath(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
}

export async function saveJson<T>(filePath: string, data: T): Promise<void> {
  const target = resolveCachePath(filePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(resolveCachePath(filePath), "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function cacheExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(resolveCachePath(filePath));
    return true;
  } catch {
    return false;
  }
}

export async function getLastUpdated(filePath: string): Promise<string | null> {
  try {
    const stat = await fs.stat(resolveCachePath(filePath));
    return stat.mtime.toISOString();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
