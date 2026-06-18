"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PredictionArticle } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Flag } from "@/components/ui/Flag";
import { useLanguage } from "@/i18n/useLanguage";

export function RelatedArticles({ articles }: { articles: PredictionArticle[] }) {
  const { t } = useLanguage();
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="scroll-mt-24">
      <SectionHeading
        id="related-heading"
        eyebrow={t("prediction.relatedEyebrow")}
        title={t("prediction.related")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/predictions/${a.slug}`}
            className="card group flex flex-col gap-4 p-5 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
              <div className="flex -space-x-2">
                <Flag team={a.home} size="sm" className="ring-2 ring-surface" />
                <Flag team={a.away} size="sm" className="ring-2 ring-surface" />
              </div>
              {a.group}
            </div>
            <h3 className="line-clamp-2 text-sm font-bold leading-snug transition-colors group-hover:text-pitch">
              {a.title}
            </h3>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-pitch">
              {t("common.readPrediction")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
