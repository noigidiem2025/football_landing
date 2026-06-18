"use client";

import { MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Flag } from "@/components/ui/Flag";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredMatch } from "@/mocks";
import type { Team } from "@/lib/types";
import { useLanguage } from "@/i18n/useLanguage";

function Side({ team, score, leads }: { team: Team; score?: number; leads: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3 text-center">
      <Flag team={team} size="lg" />
      <span className="font-display text-lg font-bold uppercase tracking-tight sm:text-xl">
        {team.name}
      </span>
      <span
        className={`font-display text-5xl font-extrabold tabular-nums sm:text-6xl ${
          leads ? "text-pitch" : "text-foreground"
        }`}
      >
        {score}
      </span>
    </div>
  );
}

export function FeaturedMatch() {
  const { t } = useLanguage();
  const m = featuredMatch;
  const homeLeads = (m.homeScore ?? 0) > (m.awayScore ?? 0);
  const awayLeads = (m.awayScore ?? 0) > (m.homeScore ?? 0);

  return (
    <section
      id="featured-match"
      aria-labelledby="featured-heading"
      className="scroll-mt-24 py-12 sm:py-16"
    >
      <Container>
        <SectionHeading
          id="featured-heading"
          eyebrow={t("section.featured.eyebrow")}
          title={t("section.featured.title")}
        />

        <div className="card relative overflow-hidden p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-pitch-soft blur-3xl" />

          <div className="relative">
            <div className="mb-8 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted">
              <span>{m.group}</span>
              <span className="h-1 w-1 rounded-full bg-muted" />
              <StatusBadge status={m.status} />
            </div>

            <div className="flex items-center justify-between gap-2 sm:gap-8">
              <Side team={m.home} score={m.homeScore} leads={homeLeads} />

              <div className="flex flex-col items-center gap-2">
                <span className="font-display text-sm font-bold uppercase text-muted">{t("common.vs")}</span>
                {m.minute && (
                  <span className="rounded-full bg-live/15 px-3 py-1 font-display text-sm font-bold text-live">
                    {m.minute}
                  </span>
                )}
              </div>

              <Side team={m.away} score={m.awayScore} leads={awayLeads} />
            </div>

            {m.venue && (
              <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {m.venue}
              </p>
            )}

            <div className="mt-8 flex justify-center">
              <Button href="#live-matches" size="lg">
                {t("match.openMatchCenter")}
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
