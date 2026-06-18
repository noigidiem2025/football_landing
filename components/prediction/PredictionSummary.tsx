"use client";

import { Sparkles } from "lucide-react";
import type { PredictionArticle } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PredictionBar } from "@/components/cards/PredictionBar";
import { useLanguage } from "@/i18n/useLanguage";

export function PredictionSummary({ article }: { article: PredictionArticle }) {
  const { t } = useLanguage();
  const hasScore = article.predictedScore.trim().length > 0;

  return (
    <section id="prediction" aria-labelledby="prediction-heading" className="scroll-mt-24">
      <SectionHeading id="prediction-heading" title={t("prediction.summaryTitle")} />

      <div className="card space-y-6 p-5 sm:p-6">
        {hasScore && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pitch-soft px-3 py-1.5 text-sm font-bold text-pitch">
              <Sparkles className="h-4 w-4" aria-hidden />
              {article.predictedScore}
            </span>
            {article.confidence > 0 && (
              <span className="text-sm text-muted">
                <span className="font-display font-bold text-foreground">
                  {article.confidence}%
                </span>
              </span>
            )}
          </div>
        )}

        {article.outcomes.length > 0 && <PredictionBar outcomes={article.outcomes} />}

        <p className="text-sm leading-relaxed text-muted">
          {article.summary.trim().length > 0
            ? article.summary
            : t("common.predictionUpdating")}
        </p>
      </div>
    </section>
  );
}
