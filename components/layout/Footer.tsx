"use client";

import Link from "next/link";
import { Trophy, Send, AtSign, Play, Globe, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { site } from "@/mocks";
import { useLanguage } from "@/i18n/useLanguage";
import type { TranslationKey } from "@/i18n/vi";

// lucide removed trademarked brand glyphs in v1; map to generic icons,
// platform names remain as accessible labels.
const socialIcons: Record<string, LucideIcon> = {
  twitter: Send,
  instagram: AtSign,
  youtube: Play,
  facebook: Globe,
};

const COL_TITLE_KEY: Record<string, TranslationKey> = {
  Tournament: "footer.tournament",
  Explore: "footer.explore",
  Company: "footer.company",
};

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-line bg-surface-muted/40">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} home`}>
              <Trophy className="h-6 w-6 text-pitch" aria-hidden />
              <span className="font-display text-base font-extrabold tracking-tight text-pitch">
                {site.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted">{site.description}</p>
            <div className="mt-5 flex gap-2">
              {site.footer.socials.map((key) => {
                const Icon = socialIcons[key];
                return (
                  <Link
                    key={key}
                    href="#"
                    aria-label={key}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-pitch hover:text-pitch"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </Link>
                );
              })}
            </div>
          </div>

          {site.footer.columns.map((col) => {
            const title = COL_TITLE_KEY[col.title] ? t(COL_TITLE_KEY[col.title]) : col.title;
            return (
            <nav key={col.title} aria-label={title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">
                {title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted transition-colors hover:text-pitch"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row">
          <p>© 2026 {site.name}. {t("footer.rights")}</p>
          <p>{t("footer.demoNote")}</p>
        </div>
      </Container>
    </footer>
  );
}
