"use client";

import { Swords } from "lucide-react";
import { LogoBadge } from "@/components/ui/LogoBadge";
import type { HeadToHeadData, HeadToHeadMatch } from "@/lib/api-football/types";
import { useLanguage } from "@/i18n/useLanguage";
import { cn } from "@/lib/utils";

const TZ = "Asia/Ho_Chi_Minh";

function Stat({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className="px-3 py-5 text-center">
      <span className={cn("block font-display text-3xl font-extrabold tabular-nums", tone)}>
        {value}
      </span>
      <span className="mt-1 block truncate text-[11px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
    </div>
  );
}

function RecentRow({ match, lang }: { match: HeadToHeadMatch; lang: string }) {
  const date = new Date(match.date).toLocaleDateString(
    lang === "vi" ? "vi-VN" : "en-GB",
    { day: "numeric", month: "short", year: "numeric", timeZone: TZ },
  );
  const score =
    match.homeScore !== null && match.awayScore !== null
      ? `${match.homeScore} - ${match.awayScore}`
      : "–";

  return (
    <li className="flex items-center gap-3 px-4 py-3 text-sm">
      <span className="w-20 shrink-0 text-[11px] text-muted">{date}</span>

      <span className="flex min-w-0 flex-1 items-center justify-center gap-2">
        <span className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
          <span className="truncate text-right">{match.homeTeamName}</span>
          <LogoBadge src={match.homeTeamLogo} label={match.homeTeamName} size="xs" />
        </span>
        <span className="shrink-0 font-display font-bold tabular-nums">{score}</span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <LogoBadge src={match.awayTeamLogo} label={match.awayTeamName} size="xs" />
          <span className="truncate">{match.awayTeamName}</span>
        </span>
      </span>

      <span className="hidden w-28 shrink-0 truncate text-right text-[11px] text-muted sm:block">
        {match.leagueName}
      </span>
    </li>
  );
}

export function HeadToHead({
  data,
  homeTeamName,
  awayTeamName,
  className,
}: {
  data: HeadToHeadData;
  homeTeamName: string;
  awayTeamName: string;
  className?: string;
}) {
  const { t, lang } = useLanguage();
  const isEmpty = data.totalMatches === 0 && data.recentMatches.length === 0;

  return (
    <section aria-labelledby="h2h-heading" className={className}>
      <div className="mb-4 flex items-center gap-2">
        <Swords className="h-5 w-5 text-pitch" aria-hidden />
        <h2
          id="h2h-heading"
          className="font-display text-xl font-extrabold uppercase tracking-tight"
        >
          {t("h2h.title")}
        </h2>
      </div>

      {isEmpty ? (
        <div className="card px-6 py-12 text-center text-sm text-muted">{t("h2h.empty")}</div>
      ) : (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="card grid grid-cols-3 divide-x divide-line">
            <Stat value={data.homeWins} label={`${homeTeamName} ${t("h2h.wins")}`} tone="text-pitch" />
            <Stat value={data.draws} label={t("h2h.draws")} tone="text-muted" />
            <Stat value={data.awayWins} label={`${awayTeamName} ${t("h2h.wins")}`} tone="text-gold" />
          </div>

          {/* Recent meetings */}
          {data.recentMatches.length > 0 && (
            <div className="card overflow-hidden">
              <h3 className="border-b border-line px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted">
                {t("h2h.recent")}
              </h3>
              <ul className="divide-y divide-line/60">
                {data.recentMatches.map((match) => (
                  <RecentRow key={match.fixtureId} match={match} lang={lang} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
