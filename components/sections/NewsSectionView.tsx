"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsCard } from "@/components/news/NewsCard";
import { UpdatingNotice } from "@/components/common/UpdatingNotice";
import { useLanguage } from "@/i18n/useLanguage";
import type { NewsArticle } from "@/lib/types";

export function NewsSectionView({ articles }: { articles: NewsArticle[] }) {
  const { t } = useLanguage();

  return (
    <section id="news" aria-labelledby="news-heading" className="scroll-mt-24 py-12 sm:py-16">
      <Container>
        <SectionHeading
          id="news-heading"
          eyebrow={t("section.news.eyebrow")}
          title={t("section.news.title")}
          action={
            articles.length > 0 ? (
              <Link
                href="/news"
                className="inline-flex items-center gap-1 text-sm font-semibold text-pitch"
              >
                {t("common.viewAll")}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : undefined
          }
        />
        {articles.length === 0 ? (
          <UpdatingNotice />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
