"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Menu, X, Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { site } from "@/mocks";
import { useLanguage } from "@/i18n/useLanguage";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import type { TranslationKey } from "@/i18n/vi";

/** Map a nav href to its translation key. */
const NAV_KEY: Record<string, TranslationKey> = {
  "/news": "nav.news",
  "/fixtures": "nav.fixtures",
  "/results": "nav.results",
  "/#predictions": "nav.predictions",
  "/standings": "nav.standings",
};

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} home`}>
      <Trophy className="h-6 w-6 text-pitch" aria-hidden />
      <span className="font-display text-base font-extrabold tracking-tight text-pitch">
        {site.name}
      </span>
    </Link>
  );
}

export function Header({ hasLiveMatches = false }: { hasLiveMatches?: boolean }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Brand />

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {NAV_KEY[item.href] ? t(NAV_KEY[item.href]) : item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            {/* Language switcher (top-right) */}
            <LanguageSwitcher />
            {/* Live indicator */}
            {hasLiveMatches && (
              <Link
                href="/#live-matches"
                aria-label={t("header.liveScores")}
                className="hidden items-center gap-1.5 rounded-full border border-line bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-pitch lg:inline-flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse-dot" />
                {t("header.live")}
              </Link>
            )}
            {/* Search entry point */}
            <Link
              href="/search"
              aria-label={t("header.search")}
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Button href="/fixtures" size="sm" className="hidden sm:inline-flex">
              {t("nav.fixtures")}
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-foreground md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-line transition-[max-height] duration-300 md:hidden",
          open ? "max-h-72" : "max-h-0",
        )}
      >
        <Container>
          <nav className="flex flex-col py-2" aria-label="Mobile">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line/60 py-3 text-sm font-medium text-muted hover:text-foreground"
              >
                {NAV_KEY[item.href] ? t(NAV_KEY[item.href]) : item.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="border-b border-line/60 py-3 text-sm font-medium text-muted hover:text-foreground"
            >
              {t("header.search")}
            </Link>
            {hasLiveMatches && (
              <Link
                href="/#live-matches"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 py-3 text-sm font-medium text-muted hover:text-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse-dot" />
                {t("header.liveScores")}
              </Link>
            )}
          </nav>
        </Container>
      </div>
    </header>
  );
}
