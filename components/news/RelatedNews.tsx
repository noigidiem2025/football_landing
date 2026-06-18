"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsCard } from "./NewsCard";
import { useLanguage } from "@/i18n/useLanguage";
import type { NewsArticle } from "@/lib/types";

export function RelatedNews({ articles }: { articles: NewsArticle[] }) {
  const { t } = useLanguage();
  if (articles.length === 0) return null;

  return (
    <div className="mx-auto mt-12 max-w-5xl">
      <SectionHeading title={t("news.related")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <NewsCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  );
}
