"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Flag } from "@/components/ui/Flag";
import { cn } from "@/lib/utils";
import { standings } from "@/mocks";
import { useLanguage } from "@/i18n/useLanguage";
import type { TranslationKey } from "@/i18n/vi";

const COLS: { key: string; labelKey: TranslationKey }[] = [
  { key: "P", labelKey: "standings.colPlayed" },
  { key: "W", labelKey: "standings.colWon" },
  { key: "D", labelKey: "standings.colDrawn" },
  { key: "GD", labelKey: "standings.colGd" },
  { key: "PTS", labelKey: "standings.colPoints" },
];

export function Standings() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const group = standings[active];

  return (
    <section
      id="standings"
      aria-labelledby="standings-heading"
      className="scroll-mt-24 border-y border-line bg-surface-muted/40 py-12 sm:py-16"
    >
      <Container>
        <SectionHeading
          id="standings-heading"
          eyebrow={t("section.standings.eyebrow")}
          title={t("section.standings.title")}
        />

        {/* Group tabs */}
        <div
          role="tablist"
          aria-label="Standings groups"
          className="scrollbar-thin mb-4 flex gap-2 overflow-x-auto pb-1"
        >
          {standings.map((g, i) => (
            <button
              key={g.name}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                i === active
                  ? "bg-pitch text-[#04130a]"
                  : "border border-line bg-white/5 text-muted hover:text-foreground",
              )}
            >
              {g.name}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-muted">
                  <th scope="col" className="px-4 py-3 text-left font-semibold">
                    {t("standings.colPos")}
                  </th>
                  <th scope="col" className="px-2 py-3 text-left font-semibold">
                    {t("standings.colTeam")}
                  </th>
                  {COLS.map((c) => (
                    <th
                      key={c.key}
                      scope="col"
                      className={cn(
                        "px-2 py-3 text-center font-semibold tabular-nums",
                        c.key === "PTS" && "pr-4 text-right",
                      )}
                    >
                      {t(c.labelKey)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row) => {
                  const qualifies = row.pos <= 2;
                  return (
                    <tr
                      key={row.team.id}
                      className="border-b border-line/60 transition-colors last:border-0 hover:bg-white/5"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold tabular-nums",
                            qualifies ? "bg-pitch-soft text-pitch" : "text-muted",
                          )}
                        >
                          {row.pos}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2.5">
                          <Flag team={row.team} size="sm" />
                          <span className="font-semibold">{row.team.name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-center tabular-nums text-muted">{row.played}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{row.won}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{row.drawn}</td>
                      <td className="px-2 py-3 text-center tabular-nums text-muted">{row.gd}</td>
                      <td className="px-2 py-3 pr-4 text-right font-display font-bold tabular-nums text-pitch">
                        {row.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-4 py-3 text-[11px] text-muted">
            <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-pitch align-middle" />
            {t("standings.topTwo")}
          </p>
        </div>
      </Container>
    </section>
  );
}
