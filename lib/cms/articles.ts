import { cache } from "react";
import type { PredictionArticle } from "@/lib/types";
import { fetchSheetRows } from "./client";
import { mapRowsToArticles } from "./mappers";
import { predictionArticles } from "@/mocks/articles";

/**
 * Source of truth for prediction articles.
 * Live Google Sheet rows when configured; local fixtures otherwise.
 * `cache()` memoizes per request render so the sheet is read at most once.
 */
const loadAll = cache(async (): Promise<PredictionArticle[]> => {
  const rows = await fetchSheetRows();
  if (rows) {
    const mapped = mapRowsToArticles(rows);
    if (mapped.length > 0) return mapped;
  }
  return predictionArticles;
});

export const getAllPredictionArticles = loadAll;

export const getPredictionArticle = cache(
  async (slug: string): Promise<PredictionArticle | null> => {
    const all = await loadAll();
    return all.find((a) => a.slug === slug) ?? null;
  },
);

export async function getPredictionSlugs(): Promise<string[]> {
  const all = await loadAll();
  return all.map((a) => a.slug);
}

export async function getRelatedArticles(
  slug: string,
  relatedSlugs: string[],
  limit = 3,
): Promise<PredictionArticle[]> {
  const all = await loadAll();
  const picked = relatedSlugs
    .map((s) => all.find((a) => a.slug === s))
    .filter((a): a is PredictionArticle => Boolean(a) && a!.slug !== slug);

  // Top up with other recent articles if related list is short.
  if (picked.length < limit) {
    for (const a of all) {
      if (picked.length >= limit) break;
      if (a.slug !== slug && !picked.includes(a)) picked.push(a);
    }
  }
  return picked.slice(0, limit);
}
