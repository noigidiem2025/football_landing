"use client";

import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FixtureCard } from "@/components/fixtures/FixtureCard";
import type { FootballMatch } from "@/lib/api-football/types";
import { useLanguage } from "@/i18n/useLanguage";

export function LiveMatches({ matches }: { matches: FootballMatch[] }) {
  const { t } = useLanguage();
  return (
    <section
      id="live-matches"
      aria-labelledby="live-heading"
      className="scroll-mt-24 border-y border-line bg-surface-muted/40 py-12 sm:py-16"
    >
      <Container>
        <SectionHeading
          id="live-heading"
          eyebrow={t("section.live.eyebrow")}
          title={t("section.live.title")}
          action={
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-pitch">
              {t("common.viewAll")}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </span>
          }
        />

        {/* Mobile: horizontal snap rail. md+: responsive grid. */}
        {matches.length > 0 ? (
          <ul className="scrollbar-thin -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
            {matches.map((match) => (
              <li
                key={match.matchId}
                className="w-[80vw] max-w-[300px] shrink-0 snap-start md:w-auto md:max-w-none"
              >
                <FixtureCard match={match} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card flex flex-col items-center gap-2 px-6 py-12 text-center">
            <p className="font-semibold">{t("fixtures.noMatches")}</p>
            <p className="max-w-xs text-sm text-muted">{t("fixtures.noMatchesHint")}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
