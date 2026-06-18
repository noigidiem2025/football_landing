"use client";

import { Trophy } from "lucide-react";
import type { LeagueTable, StandingsTeamRow } from "@/lib/types";
import { Flag } from "@/components/ui/Flag";
import { cn } from "@/lib/utils";
import { FormBadges } from "./FormBadges";
import { useLanguage } from "@/i18n/useLanguage";

type Zone = "promo" | "releg" | null;

function LeaderIcon() {
  const { t } = useLanguage();
  return <Trophy className="h-3.5 w-3.5 shrink-0 text-gold" aria-label={t("standings.leader")} />;
}

function StandingsRow({
  row,
  zone,
  isLeader,
}: {
  row: StandingsTeamRow;
  zone: Zone;
  isLeader: boolean;
}) {
  return (
    <tr
      className={cn(
        "border-b border-line/60 transition-colors last:border-0 hover:bg-white/5",
        zone === "promo" && "bg-pitch-soft/40",
        zone === "releg" && "bg-live/10",
      )}
    >
      {/* Position with zone accent bar */}
      <td className="py-3 pl-3 pr-1">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold tabular-nums",
            zone === "promo" && "bg-pitch text-[#04130a]",
            zone === "releg" && "bg-live/20 text-live",
            zone === null && "text-muted",
          )}
        >
          {row.pos}
        </span>
      </td>

      {/* Team */}
      <td className="py-3 pr-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <Flag team={row.team} size="sm" className="shrink-0" />
          <span className="truncate text-sm font-semibold">{row.team.name}</span>
          {isLeader && <LeaderIcon />}
        </div>
      </td>

      <td className="px-2 py-3 text-center text-sm tabular-nums text-muted">{row.played}</td>
      <td className="hidden px-2 py-3 text-center text-sm tabular-nums sm:table-cell">{row.won}</td>
      <td className="hidden px-2 py-3 text-center text-sm tabular-nums sm:table-cell">{row.drawn}</td>
      <td className="hidden px-2 py-3 text-center text-sm tabular-nums sm:table-cell">{row.lost}</td>
      <td className="hidden px-2 py-3 text-center text-sm tabular-nums text-muted lg:table-cell">{row.gf}</td>
      <td className="hidden px-2 py-3 text-center text-sm tabular-nums text-muted lg:table-cell">{row.ga}</td>
      <td className="hidden px-2 py-3 text-center text-sm tabular-nums sm:table-cell">
        {row.gd > 0 ? `+${row.gd}` : row.gd}
      </td>
      <td className="px-2 py-3 text-center font-display text-sm font-bold tabular-nums text-pitch">
        {row.points}
      </td>
      <td className="py-3 pl-2 pr-3">
        <FormBadges form={row.form} />
      </td>
    </tr>
  );
}

export function StandingsTable({ league }: { league: LeagueTable }) {
  const { t } = useLanguage();
  const total = league.rows.length;

  const zoneOf = (pos: number): Zone => {
    if (pos <= league.promotionZone) return "promo";
    if (pos > total - league.relegationZone) return "releg";
    return null;
  };

  const head = "px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted";

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[340px]">
          <caption className="sr-only">{league.name} standings</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-3 pl-3 pr-1 text-left text-[10px] font-semibold uppercase tracking-wider text-muted">
                {t("standings.colPos")}
              </th>
              <th scope="col" className="py-3 pr-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted">
                {t("standings.colTeam")}
              </th>
              <th scope="col" className={head}>{t("standings.colPlayed")}</th>
              <th scope="col" className={cn(head, "hidden sm:table-cell")}>{t("standings.colWon")}</th>
              <th scope="col" className={cn(head, "hidden sm:table-cell")}>{t("standings.colDrawn")}</th>
              <th scope="col" className={cn(head, "hidden sm:table-cell")}>{t("standings.colLost")}</th>
              <th scope="col" className={cn(head, "hidden lg:table-cell")}>{t("standings.colGf")}</th>
              <th scope="col" className={cn(head, "hidden lg:table-cell")}>{t("standings.colGa")}</th>
              <th scope="col" className={cn(head, "hidden sm:table-cell")}>{t("standings.colGd")}</th>
              <th scope="col" className={head}>{t("standings.colPoints")}</th>
              <th scope="col" className="py-3 pl-2 pr-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
                {t("standings.colForm")}
              </th>
            </tr>
          </thead>
          <tbody>
            {league.rows.map((row) => (
              <StandingsRow
                key={row.team.id}
                row={row}
                zone={zoneOf(row.pos)}
                isLeader={row.pos === 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Zone legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-4 py-3 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-pitch" />
          {league.promotionLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-live" />
          {league.relegationLabel}
        </span>
      </div>
    </div>
  );
}
