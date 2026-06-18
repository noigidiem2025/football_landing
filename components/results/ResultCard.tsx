"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { FootballResult } from "@/lib/api-football/types";
import { LogoBadge } from "@/components/ui/LogoBadge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/useLanguage";

function safeScore(primary: number | null, fallback: number | null): number | null {
  return primary ?? fallback;
}

export function ResultCard({ result }: { result: FootballResult }) {
  const { t, lang } = useLanguage();
  const locale = lang === "vi" ? "vi-VN" : "en-GB";
  const kickoff = new Date(result.date);
  const matchDate = kickoff.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const homeScore = safeScore(result.fullTimeHomeScore, result.homeScore);
  const awayScore = safeScore(result.fullTimeAwayScore, result.awayScore);
  const homeWin =
    result.homeWinner === true || (homeScore !== null && awayScore !== null && homeScore > awayScore);
  const awayWin =
    result.awayWinner === true || (homeScore !== null && awayScore !== null && awayScore > homeScore);
  const hasHalfTime = result.halfTimeHomeScore !== null && result.halfTimeAwayScore !== null;

  const resultLabel = homeWin
    ? `${result.homeTeamName} ${t("results.win")}`
    : awayWin
      ? `${result.awayTeamName} ${t("results.win")}`
      : t("results.draw");

  function teamSide(
    name: string,
    logo: string,
    win: boolean,
    align: "left" | "right",
  ) {
    return (
      <div
        className={cn(
          "flex min-w-0 items-center gap-2.5",
          align === "right" && "flex-row-reverse",
        )}
      >
        <LogoBadge src={logo} label={name} size="sm" />
        <span className={cn("truncate text-sm font-semibold", win ? "text-foreground" : "text-muted")}>
          {name}
        </span>
      </div>
    );
  }

  return (
    <article className="card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
          <LogoBadge src={result.leagueLogo} label={result.leagueName} size="xs" icon />
          <span className="truncate">{result.leagueName}</span>
        </span>
        <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
          {t("results.fullTime")}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-2 text-xs text-muted">
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-pitch" aria-hidden />
        <span className="truncate">
          {matchDate} · {result.kickoffTime} · {result.round}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
        {teamSide(result.homeTeamName, result.homeTeamLogo, homeWin, "left")}
        <div className="text-center">
          <div className="font-display text-2xl font-extrabold tabular-nums">
            <span className={homeWin ? "text-pitch" : undefined}>{homeScore ?? "-"}</span>
            <span className="mx-1.5 text-muted">-</span>
            <span className={awayWin ? "text-pitch" : undefined}>{awayScore ?? "-"}</span>
          </div>
          {hasHalfTime && (
            <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
              {t("results.ht")} {result.halfTimeHomeScore}-{result.halfTimeAwayScore}
            </div>
          )}
        </div>
        {teamSide(result.awayTeamName, result.awayTeamLogo, awayWin, "right")}
      </div>

      <p className="mt-3 text-center">
        <span className="inline-block rounded-full bg-pitch-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pitch">
          {resultLabel}
        </span>
      </p>

      <Link
        href={`/match/${result.fixtureId}`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-line bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted transition-colors hover:border-pitch hover:text-foreground"
      >
        {t("common.viewDetails")}
      </Link>
    </article>
  );
}
