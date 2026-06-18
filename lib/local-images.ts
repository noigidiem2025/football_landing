const NEWS_COVERS = [
  "/images/news-stadium.jpg",
  "/images/news-fans.jpg",
  "/images/news-pitch.jpg",
  "/images/football-card.jpg",
] as const;

export const HERO_IMAGE = "/images/hero-football.jpg";
export const DEFAULT_FOOTBALL_IMAGE = "/images/football-card.jpg";

export function isLocalImagePath(value: string | undefined): value is string {
  return Boolean(value?.startsWith("/"));
}

export function localNewsCover(seed: string | undefined): string {
  const key = seed ?? "";
  const total = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return NEWS_COVERS[total % NEWS_COVERS.length];
}

export function localImageOrFallback(
  value: string | undefined,
  fallback = DEFAULT_FOOTBALL_IMAGE,
): string {
  return isLocalImagePath(value) ? value : fallback;
}
