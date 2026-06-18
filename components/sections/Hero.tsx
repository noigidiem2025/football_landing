"use client";

import Image from "next/image";
import { TrendingUp, CalendarDays } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site } from "@/mocks";
import { useLanguage } from "@/i18n/useLanguage";

export function Hero() {
  const { t } = useLanguage();
  const { titleLead, titleAccent } = site.hero;

  const stats = [
    { value: "48", labelKey: "hero.statTeams" as const },
    { value: "104", labelKey: "hero.statMatches" as const },
    { value: "16", labelKey: "hero.statCities" as const },
  ];

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-stadium.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/75 to-background" />
        <div className="pitch-backdrop absolute inset-0 opacity-50" />
      </div>

      <Container className="relative z-10 py-16 sm:py-20 lg:py-28">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-pitch">
            {t("hero.eyebrow")}
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {titleLead}
            <br />
            <span className="text-gradient">{titleAccent}</span>
          </h1>

          <p className="mt-5 max-w-md text-base text-muted sm:text-lg">{t("hero.subtitle")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#live-matches" size="lg">
              {t("cta.viewLiveMatches")}
              <TrendingUp className="h-5 w-5" aria-hidden />
            </Button>
            <Button href="#standings" size="lg" variant="outline">
              <CalendarDays className="h-5 w-5" aria-hidden />
              {t("cta.tournamentStandings")}
            </Button>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.labelKey} className="card px-3 py-4 text-center">
                <dt className="sr-only">{t(s.labelKey)}</dt>
                <dd>
                  <span className="block font-display text-2xl font-extrabold text-pitch sm:text-3xl">
                    {s.value}
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {t(s.labelKey)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
