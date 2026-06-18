"use client";

import type { Match, Team } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Flag } from "@/components/ui/Flag";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/i18n/useLanguage";

function TeamLine({
  team,
  score,
  leading,
  isLive,
}: {
  team: Team;
  score?: number;
  leading?: boolean;
  isLive: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Flag team={team} size="sm" />
        <span className="text-sm font-semibold">{team.code}</span>
      </div>
      {isLive ? (
        <span
          className={cn(
            "font-display text-lg font-bold tabular-nums",
            leading ? "text-pitch" : "text-foreground",
          )}
        >
          {score}
        </span>
      ) : null}
    </div>
  );
}

/** Compact fixture card used in the Live Matches rail. */
export function MatchCard({ match }: { match: Match }) {
  const { t } = useLanguage();
  const isLive = match.status === "live";
  const homeLeads = (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayLeads = (match.awayScore ?? 0) > (match.homeScore ?? 0);

  return (
    <article
      className={cn(
        "card flex h-full flex-col gap-4 p-4 transition-transform hover:-translate-y-1",
        isLive && "border-l-2 border-l-pitch",
      )}
    >
      <header className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted">
        <span>{match.group}</span>
        <StatusBadge status={match.status} />
      </header>

      <div className="space-y-3">
        <TeamLine team={match.home} score={match.homeScore} leading={homeLeads} isLive={isLive} />
        <TeamLine team={match.away} score={match.awayScore} leading={awayLeads} isLive={isLive} />
      </div>

      <footer className="border-t border-line pt-3 text-center text-xs font-medium text-muted">
        {isLive ? (
          <span className="text-pitch">{match.minute} · {t("status.inPlay")}</span>
        ) : (
          match.kickoff
        )}
      </footer>
    </article>
  );
}
