import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPredictionSlugs } from "@/lib/cms/articles";
import { getNewsSlugs } from "@/lib/cms/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/fixtures`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/results`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/standings`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ];

  const [predictionSlugs, newsSlugs] = await Promise.all([
    getPredictionSlugs(),
    getNewsSlugs(),
  ]);

  const predictionRoutes: MetadataRoute.Sitemap = predictionSlugs.map((slug) => ({
    url: `${SITE_URL}/predictions/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const newsRoutes: MetadataRoute.Sitemap = newsSlugs.map((slug) => ({
    url: `${SITE_URL}/news/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...predictionRoutes, ...newsRoutes];
}
