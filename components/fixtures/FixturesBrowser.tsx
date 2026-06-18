"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import type { FootballMatch } from "@/lib/api-football/types";
import type { MatchStatus } from "@/lib/types";
import { FixtureCard } from "./FixtureCard";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/useLanguage";
import type { TranslationKey } from "@/i18n/vi";

type Tab = "today" | "tomorrow" | "week";
type StatusFilter = "all" | MatchStatus;

const TABS: { id: Tab; labelKey: TranslationKey }[] = [
  { id: "today", labelKey: "filter.today" },
  { id: "tomorrow", labelKey: "filter.tomorrow" },
  { id: "week", labelKey: "filter.thisWeek" },
];

const PAGE_SIZE = 12;
const LIVE = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "INT", "SUSP"];
const FINISHED = ["FT", "AET", "PEN"];
const STATUS_OPTIONS: { id: StatusFilter; labelKey: TranslationKey }[] = [
  { id: "all", labelKey: "filter.allStatuses" },
  { id: "upcoming", labelKey: "status.upcoming" },
  { id: "live", labelKey: "status.live" },
  { id: "finished", labelKey: "status.finished" },
  { id: "tbd", labelKey: "status.tbd" },
];

function toMatchStatus(short: string): MatchStatus {
  if (LIVE.includes(short)) return "live";
  if (FINISHED.includes(short)) return "finished";
  if (short === "PST" || short === "CANC" || short === "ABD" || short === "TBD") return "tbd";
  return "upcoming";
}

interface Props {
  today: FootballMatch[];
  week: FootballMatch[];
  todayDate: string;
  tomorrowDate: string;
}

export function FixturesBrowser({ today, week, todayDate, tomorrowDate }: Props) {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<Tab>("today");
  const [league, setLeague] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const leagues = useMemo(
    () => Array.from(new Set([...today, ...week].map((m) => m.leagueName))).sort(),
    [today, week],
  );

  const dayLabel = (key: string): string => {
    if (key === todayDate) return t("filter.today");
    if (key === tomorrowDate) return t("filter.tomorrow");
    return new Date(`${key}T00:00:00`).toLocaleDateString(
      lang === "vi" ? "vi-VN" : "en-GB",
      { weekday: "short", day: "numeric", month: "short" },
    );
  };

  const byLeague = (m: FootballMatch) => league === "all" || m.leagueName === league;
  const byStatus = (m: FootballMatch) =>
    statusFilter === "all" || toMatchStatus(m.statusShort) === statusFilter;

  const counts = useMemo(
    () => ({
      today: today.filter(byLeague).filter(byStatus).length,
      tomorrow: week.filter((m) => m.date === tomorrowDate).filter(byLeague).filter(byStatus).length,
      week: week.filter(byLeague).filter(byStatus).length,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [today, week, league, statusFilter, tomorrowDate],
  );

  const filtered = useMemo(() => {
    let list: FootballMatch[];
    if (date) list = week.filter((m) => m.date === date);
    else if (tab === "today") list = today;
    else if (tab === "tomorrow") list = week.filter((m) => m.date === tomorrowDate);
    else list = week;
    return list.filter(byLeague).filter(byStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, week, tab, date, league, statusFilter, tomorrowDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [tab, league, statusFilter, date]);

  const groups = useMemo(() => {
    const map = new Map<string, FootballMatch[]>();
    for (const m of paged) {
      const bucket = map.get(m.date);
      if (bucket) bucket.push(m);
      else map.set(m.date, [m]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [paged]);

  const minDate = todayDate;
  const maxDate = week.length ? week[week.length - 1].date : todayDate;

  return (
    <div>
      {/* Day tabs */}
      <div
        role="tablist"
        aria-label={t("page.fixtures.title")}
        className="grid grid-cols-3 gap-1 rounded-full border border-line bg-surface/60 p-1"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={tab === item.id && !date}
            onClick={() => {
              setTab(item.id);
              setDate("");
            }}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-full px-2 py-2 text-xs font-bold uppercase tracking-wide transition-colors sm:text-sm",
              tab === item.id && !date
                ? "bg-pitch text-[#04130a]"
                : "text-muted hover:text-foreground",
            )}
          >
            {t(item.labelKey)}
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px] tabular-nums",
                tab === item.id && !date ? "bg-black/15" : "bg-white/10",
              )}
            >
              {counts[item.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">{t("filter.status")}</span>
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="h-11 w-full appearance-none rounded-xl border border-line bg-surface px-9 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-pitch"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
        </label>

        <label className="relative flex-1">
          <span className="sr-only">{t("filter.league")}</span>
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <select
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-line bg-surface px-9 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-pitch"
          >
            <option value="all">{t("filter.allLeagues")}</option>
            {leagues.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="relative flex-1">
          <span className="sr-only">{t("filter.date")}</span>
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 w-full rounded-xl border border-line bg-surface px-9 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-pitch [color-scheme:dark]"
          />
        </label>

        {(date || league !== "all" || statusFilter !== "all") && (
          <button
            onClick={() => {
              setDate("");
              setLeague("all");
              setStatusFilter("all");
            }}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-white/5 px-4 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
            {t("filter.clear")}
          </button>
        )}
      </div>

      {/* Results */}
      <div className="mt-8 space-y-8">
        {groups.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
            <CalendarDays className="h-8 w-8 text-muted" aria-hidden />
            <p className="font-semibold">{t("fixtures.noMatches")}</p>
            <p className="max-w-xs text-sm text-muted">{t("fixtures.noMatchesHint")}</p>
          </div>
        ) : (
          groups.map(([key, items]) => (
            <section key={key} aria-label={dayLabel(key)}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                {dayLabel(key)}
                <span className="text-xs font-medium normal-case text-muted">
                  {items.length} {items.length === 1 ? t("filter.match") : t("filter.matches")}
                </span>
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {items.map((m) => (
                  <FixtureCard key={m.matchId} match={m} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {filtered.length > PAGE_SIZE && (
        <nav
          className="mt-8 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"
          aria-label={`${t("page.fixtures.title")} ${t("fixtures.page")}`}
        >
          <p className="text-sm text-muted">
            {t("fixtures.showing")}{" "}
            <span className="font-semibold text-foreground">
              {pageStart + 1}-{Math.min(pageStart + PAGE_SIZE, filtered.length)}
            </span>{" "}
            / {filtered.length} {t("filter.matches")}
          </p>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white/5 px-3 text-sm font-bold text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              {t("fixtures.prevPage")}
            </button>

            <span className="min-w-[6rem] text-center text-sm font-semibold text-foreground">
              {t("fixtures.page")} {currentPage} {t("fixtures.of")} {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white/5 px-3 text-sm font-bold text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("fixtures.nextPage")}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
