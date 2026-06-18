"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Newspaper } from "lucide-react";
import type { NewsArticle } from "@/lib/types";
import { useLanguage } from "@/i18n/useLanguage";

/**
 * News article card. Renders a cover image when `coverUrl` is set, otherwise a
 * themed gradient panel (backend-free fallback, no layout shift).
 */
export function NewsCard({ article }: { article: NewsArticle }) {
  const { t, lang } = useLanguage();

  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(
        lang === "vi" ? "vi-VN" : "en-GB",
        { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
      )
    : "";

  return (
    <Link
      href={`/news/${article.slug}`}
      className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className="relative flex h-40 items-end overflow-hidden">
        {article.coverUrl ? (
          <Image
            src={article.coverUrl}
            alt={article.coverAlt ?? ""}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="pitch-backdrop absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <Newspaper className="absolute right-4 top-4 h-5 w-5 text-pitch/80" aria-hidden />
        <span className="relative m-4 rounded-full bg-pitch-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pitch">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-display text-base font-bold leading-snug tracking-tight transition-colors group-hover:text-pitch">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-muted">
          <span>{date}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-pitch">
            {t("common.read")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
