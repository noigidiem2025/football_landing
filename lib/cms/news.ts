import { cache } from "react";
import type { NewsArticle } from "@/lib/types";
import { fetchSheetRows } from "./client";
import { news as fallbackNews } from "@/mocks/news";

const NEWS_TAB = process.env.SHEET_NEWS_TAB ?? "news";

type Row = Record<string, string>;

function rowsToObjects(rows: string[][]): Row[] {
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const obj: Row = {};
    headers.forEach((h, i) => {
      obj[h] = (cells[i] ?? "").trim();
    });
    return obj;
  });
}

function asBool(v: string | undefined): boolean {
  const s = (v ?? "").toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

function mapRows(rows: string[][]): NewsArticle[] {
  return rowsToObjects(rows)
    .filter((r) => r.slug && r.title && (r.status ? r.status !== "draft" : true))
    .map<NewsArticle>((r) => ({
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt || "",
      category: r.category || "News",
      author: r.author || "Match Center",
      publishedAt: r.published_at || "",
      body: r.body || "",
      tags: (r.tags || "")
        .split("|")
        .map((t) => t.trim())
        .filter(Boolean),
      featured: asBool(r.featured),
      coverUrl: r.cover_url || undefined,
      coverAlt: r.cover_alt || undefined,
    }));
}

function sortByDate(a: NewsArticle, b: NewsArticle): number {
  return +new Date(b.publishedAt) - +new Date(a.publishedAt);
}

/** All news articles — live Google Sheet `news` rows when configured, else fixtures. */
const loadAll = cache(async (): Promise<NewsArticle[]> => {
  const rows = await fetchSheetRows(NEWS_TAB);
  if (rows) {
    const mapped = mapRows(rows);
    if (mapped.length > 0) return [...mapped].sort(sortByDate);
  }
  return [...fallbackNews].sort(sortByDate);
});

export const getAllNews = loadAll;

export async function getLatestNews(limit = 3): Promise<NewsArticle[]> {
  return (await loadAll()).slice(0, limit);
}

export const getNewsArticle = cache(
  async (slug: string): Promise<NewsArticle | null> => {
    const all = await loadAll();
    return all.find((a) => a.slug === slug) ?? null;
  },
);

export async function getNewsSlugs(): Promise<string[]> {
  return (await loadAll()).map((a) => a.slug);
}

export async function getRelatedNews(
  slug: string,
  limit = 3,
): Promise<NewsArticle[]> {
  const all = await loadAll();
  return all.filter((a) => a.slug !== slug).slice(0, limit);
}
