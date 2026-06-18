"use client";

import Image from "next/image";
import { CalendarDays, Clock, MapPin, Trophy } from "lucide-react";
import { BackLink } from "@/components/common/BackLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { MatchDetail } from "@/lib/api-football/types";
import type { MatchStatus } from "@/lib/types";
import { useLanguage } from "@/i18n/useLanguage";

const LIVE = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "INT", "SUSP"];
const FINISHED = ["FT", "AET", "PEN"];

function toMatchStatus(short: string): MatchStatus {
  if (LIVE.includes(short)) return "live";
  if (FINISHED.includes(short)) return "finished";
  if (short === "PST" || short === "CANC" || short === "ABD" || short === "TBD") return "tbd";
  return "scheduled";
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line/70 py-3 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export function MatchDetailView({ match }: { match: MatchDetail }) {
  const { t, lang } = useLanguage();
  const status = toMatchStatus(match.statusShort);
  const kickoff = new Date(match.date);
  const locale = lang === "vi" ? "vi-VN" : "en-GB";
  const dateLabel = kickoff.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = kickoff.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const hasScore = match.homeScore !== null && match.awayScore !== null;
  const statusNote =
    status === "live" && match.elapsed != null
      ? `${t("match.currentMinute")}: ${match.elapsed}'`
      : status === "finished"
        ? t("match.completed")
        : t("match.countdownPlaceholder");

  return (
    <div>
      <BackLink href="/fixtures" labelKey="match.backToFixtures" />

      <section className="card overflow-hidden">
        <div className="border-b border-line bg-surface-muted/40 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-pitch">
                {match.leagueLogo && (
                  <Image
                    src={match.leagueLogo}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                )}
                {match.leagueName}
              </div>
              <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-4xl">
                {match.homeTeamName} vs {match.awayTeamName}
              </h1>
              <p className="mt-2 text-sm text-muted">{match.round}</p>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-pitch" aria-hidden />
              {dateLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-pitch" aria-hidden />
              {timeLabel} · {match.timezone}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-5 sm:gap-6 sm:p-8">
          <div className="flex min-w-0 flex-col items-center gap-3 text-center">
            <Image
              src={match.homeTeamLogo}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
            <h2 className="max-w-full truncate text-base font-bold sm:text-lg">
              {match.homeTeamName}
            </h2>
          </div>

          <div className="text-center">
            {hasScore && (status === "live" || status === "finished") ? (
              <>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  {status === "finished" ? t("match.finalScore") : t("match.scoreboard")}
                </p>
                <p className="mt-1 font-display text-4xl font-extrabold tabular-nums text-pitch sm:text-5xl">
                  {match.homeScore} - {match.awayScore}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  {t("common.vs")}
                </p>
                <p className="mt-1 font-display text-xl font-extrabold text-pitch">
                  {timeLabel}
                </p>
              </>
            )}
            <p className="mt-2 max-w-36 text-xs text-muted">{statusNote}</p>
          </div>

          <div className="flex min-w-0 flex-col items-center gap-3 text-center">
            <Image
              src={match.awayTeamLogo}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
            <h2 className="max-w-full truncate text-base font-bold sm:text-lg">
              {match.awayTeamName}
            </h2>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold uppercase">
            <MapPin className="h-5 w-5 text-pitch" aria-hidden />
            {t("match.venue")}
          </h2>
          <dl>
            <DetailRow label={t("prediction.venue")} value={match.venueName ?? "TBD"} />
            <DetailRow label={t("match.city")} value={match.venueCity ?? "TBD"} />
          </dl>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold uppercase">
            <Trophy className="h-5 w-5 text-pitch" aria-hidden />
            {t("match.metadata")}
          </h2>
          <dl>
            <DetailRow label={t("match.league")} value={match.leagueName} />
            <DetailRow label={t("match.season")} value={match.season} />
            <DetailRow label={t("match.round")} value={match.round} />
            <DetailRow
              label={t("match.kickoff")}
              value={`${dateLabel} · ${timeLabel}`}
            />
          </dl>
        </section>
      </div>
    </div>
  );
}
