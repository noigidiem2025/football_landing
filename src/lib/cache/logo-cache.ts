import { promises as fs } from "fs";
import path from "path";

export type LogoKind = "leagues" | "teams";

export interface LogoAsset {
  kind: LogoKind;
  id: number;
  url: string;
  publicPath: string;
  filePath: string;
}

const PUBLIC_BASE = "/images/api-football";
const FILE_BASE = path.join(process.cwd(), "public", "images", "api-football");
const API_FOOTBALL_LOGO_RE =
  /\/football\/(leagues|teams)\/(\d+)\.(png|jpg|jpeg|webp|svg)(?:\?.*)?$/i;

function validId(id: number | null | undefined): id is number {
  return Number.isInteger(id) && Number(id) > 0;
}

function extensionFromUrl(url: string): string {
  const match = url.match(API_FOOTBALL_LOGO_RE);
  return match?.[3]?.toLowerCase() ?? "png";
}

export function localLogoPath(kind: LogoKind, id: number, ext = "png"): string {
  return `${PUBLIC_BASE}/${kind}/${id}.${ext}`;
}

export function localTeamLogoPath(id: number | null | undefined): string {
  return validId(id) ? localLogoPath("teams", id) : "";
}

export function localLeagueLogoPath(id: number | null | undefined): string {
  return validId(id) ? localLogoPath("leagues", id) : "";
}

export function parseApiFootballLogoUrl(url: string | null | undefined): LogoAsset | null {
  if (!url) return null;

  const match = url.match(API_FOOTBALL_LOGO_RE);
  if (!match) return null;

  const kind = match[1].toLowerCase() as LogoKind;
  const id = Number(match[2]);
  if (!validId(id)) return null;

  const ext = extensionFromUrl(url);
  const publicPath = localLogoPath(kind, id, ext);

  return {
    kind,
    id,
    url,
    publicPath,
    filePath: path.join(FILE_BASE, kind, `${id}.${ext}`),
  };
}

export function localLogoPathFromApiUrl(url: string | null | undefined): string | undefined {
  return parseApiFootballLogoUrl(url)?.publicPath;
}

export async function cacheLogoAsset(asset: LogoAsset): Promise<"saved" | "skipped"> {
  try {
    await fs.access(asset.filePath);
    return "skipped";
  } catch {
    // Missing file is the expected path for a new logo.
  }

  const response = await fetch(asset.url);
  if (!response.ok) {
    throw new Error(`Logo download failed ${response.status} for ${asset.url}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(asset.filePath), { recursive: true });
  await fs.writeFile(asset.filePath, bytes);
  return "saved";
}
