"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PredictionCard } from "@/components/cards/PredictionCard";
import { predictions } from "@/mocks";
import { useLanguage } from "@/i18n/useLanguage";

export function MatchPredictions() {
  const { t } = useLanguage();
  return (
    <section
      id="predictions"
      aria-labelledby="predictions-heading"
      className="scroll-mt-24 py-12 sm:py-16"
    >
      <Container>
        <SectionHeading
          id="predictions-heading"
          eyebrow={t("section.predictions.eyebrow")}
          title={t("section.predictions.title")}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {predictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      </Container>
    </section>
  );
}
