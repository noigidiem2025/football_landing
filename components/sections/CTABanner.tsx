"use client";

import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site } from "@/mocks";
import { useLanguage } from "@/i18n/useLanguage";
import type { TranslationKey } from "@/i18n/vi";

const FEATURE_KEYS: TranslationKey[] = [
  "ctaBanner.feature1",
  "ctaBanner.feature2",
  "ctaBanner.feature3",
];

export function CTABanner() {
  const { t } = useLanguage();
  const { href } = site.cta;

  return (
    <section aria-labelledby="cta-heading" className="py-12 sm:py-16">
      <Container>
        <div className="card pitch-backdrop relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-pitch-soft blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-pitch">
                {t("ctaBanner.eyebrow")}
              </span>
              <h2
                id="cta-heading"
                className="mt-3 font-display text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl"
              >
                {t("ctaBanner.title")}
              </h2>
              <p className="mt-3 text-muted sm:text-lg">{t("ctaBanner.subtitle")}</p>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex items-center gap-2 text-sm font-semibold">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pitch-soft">
                      <Check className="h-3 w-3 text-pitch" aria-hidden />
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0">
              <Button href={href} size="lg" className="group">
                {t("cta.getStarted")}
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Button>
              <p className="mt-3 text-center text-[11px] text-muted">{t("ctaBanner.free")}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
