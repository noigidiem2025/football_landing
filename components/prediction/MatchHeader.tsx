"use client";

import type { PredictionArticle, Team } from "@/lib/types";
import { Flag } from "@/components/ui/Flag";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/i18n/useLanguage";

function TeamBlock({ team }: { team: Team }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3 text-center">
      <Flag team={team} size="lg" className="h-14 w-20 sm:h-16 sm:w-24" />
      <span className="font-display text-base font-bold uppercase tracking-tight sm:text-xl">
        {team.name}
      </span>
    </div>
  );
}

/** Page hero: team logos, status, kickoff and the predicted scoreline. */
export function MatchHeader({ article }: { article: PredictionArticle }) {
  const { t } = useLanguage();
  const isLive = article.status === "live";
  const hasScore = article.predictedScore.trim().length > 0;

  return (
    <header className="card relative overflow-hidden p-6 sm:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-pitch-soft blur-3xl" />

      <div className="relative">
        <div className="mb-8 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted">
          <span>{article.group}</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <StatusBadge status={article.status} />
        </div>

        <div className="flex items-center justify-between gap-3 sm:gap-8">
          <TeamBlock team={article.home} />

          <div className="flex flex-col items-center gap-2">
            {isLive ? (
              <span className="font-display text-4xl font-extrabold tabular-nums sm:text-5xl">
                {article.homeScore} - {article.awayScore}
              </span>
            ) : (
              <span className="font-display text-sm font-bold uppercase text-muted">{t("common.vs")}</span>
            )}
            {hasScore && (
              <span className="rounded-full bg-pitch-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pitch">
                {article.predictedScore}
              </span>
            )}
          </div>

          <TeamBlock team={article.away} />
        </div>

        <p className="mt-8 text-center text-sm text-muted">{article.kickoffLabel}</p>
      </div>
    </header>
  );
}
