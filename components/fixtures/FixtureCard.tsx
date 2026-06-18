"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, TrendingUp, Bell, Radio, ArrowRight } from "lucide-react";
import type { FootballMatch } from "@/lib/api-football/types";
import type { MatchStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/i18n/useLanguage";

const LIVE = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "INT", "SUSP"];
const FINISHED = ["FT", "AET", "PEN"];

function toMatchStatus(short: string): MatchStatus {
  if (LIVE.includes(short)) return "live";
  if (FINISHED.includes(short)) return "finished";
  if (short === "PST" || short === "CANC" || short === "ABD" || short === "TBD") return "tbd";
  return "upcoming";
}

export function FixtureCard({ match }: { match: FootballMatch }) {
  const { t } = useLanguage();
  const status = toMatchStatus(match.statusShort);
  const detailHref = `/match/${match.matchId}`;

  // Primary action + reminder visibility depend on status.
  const primary =
    status === "live"
      ? { label: t("cta.followMatch"), Icon: Radio, variant: "primary" as const }
      : status === "finished"
        ? { label: t("common.details"), Icon: ArrowRight, variant: "primary" as const }
        : { label: t("cta.prediction"), Icon: TrendingUp, variant: "outline" as const };
  const showReminder = status === "upcoming";
  const isLive = status === "live";
  const hasScore = match.homeScore !== null && match.awayScore !== null;

  return (
    <article className="card relative p-4 sm:p-5">
      <Link
        href={`/match/${match.matchId}`}
        aria-label={`${t("common.viewDetails")}: ${match.homeTeamName} vs ${match.awayTeamName}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />

      <div className="pointer-events-none relative z-10">
        {/* League + status */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            {match.leagueLogo && (
              <Image
                src={match.leagueLogo}
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px] shrink-0 object-contain"
              />
            )}
            <span className="truncate text-[11px] font-bold uppercase tracking-wider text-muted">
              {match.leagueName}
            </span>
          </span>
          <StatusBadge status={status} />
        </div>

        {/* Round */}
        {match.round && (
          <p className="mb-3 truncate text-[11px] text-muted">{match.round}</p>
        )}

        {/* Teams + score/time */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Image
              src={match.homeTeamLogo}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 object-contain"
            />
            <span className="truncate text-sm font-semibold">{match.homeTeamName}</span>
          </div>

          <div className="text-center">
            {hasScore ? (
              <span className="font-display text-lg font-bold tabular-nums">
                {match.homeScore} - {match.awayScore}
              </span>
            ) : (
              <span className="font-display text-sm font-bold tabular-nums text-pitch">
                {match.kickoffTime}
              </span>
            )}
            {isLive && match.elapsed != null && (
              <span className="block text-[10px] font-bold text-live">{match.elapsed}&apos;</span>
            )}
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2.5">
            <span className="truncate text-right text-sm font-semibold">{match.awayTeamName}</span>
            <Image
              src={match.awayTeamLogo}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 object-contain"
            />
          </div>
        </div>

        {/* Venue */}
        {(match.venueName || match.venueCity) && (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-pitch" aria-hidden />
            <span className="truncate">
              {[match.venueName, match.venueCity].filter(Boolean).join(" · ")}
            </span>
          </p>
        )}
      </div>

      {/* Actions — primary links to the match detail; reminder only when scheduled */}
      <div
        className={`relative z-10 mt-4 grid gap-2 ${showReminder ? "grid-cols-2" : "grid-cols-1"}`}
      >
        <Button href={detailHref} variant={primary.variant} size="sm" className="w-full">
          <primary.Icon className="h-4 w-4" aria-hidden />
          {primary.label}
        </Button>
        {showReminder && (
          <Button size="sm" className="w-full">
            <Bell className="h-4 w-4" aria-hidden />
            {t("cta.reminder")}
          </Button>
        )}
      </div>
    </article>
  );
}
