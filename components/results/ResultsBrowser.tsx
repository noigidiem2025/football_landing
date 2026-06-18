"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { FootballResult } from "@/lib/api-football/types";
import { ResultCard } from "./ResultCard";
import { formatFullDateUTC } from "@/lib/date";
import { useLanguage } from "@/i18n/useLanguage";

const PAGE_SIZE = 12;

export function ResultsBrowser({ results }: { results: FootballResult[] }) {
  const { t } = useLanguage();
  const [league, setLeague] = useState("all");
  const [date, setDate] = useState("all");
  const [page, setPage] = useState(1);

  const leagues = useMemo(
    () => Array.from(new Set(results.map((r) => r.leagueName))),
    [results],
  );

  // Distinct match dates, most recent first.
  const dates = useMemo(() => {
    const keys = Array.from(new Set(results.map((r) => r.localDate)));
    return keys.sort((a, b) => b.localeCompare(a));
  }, [results]);

  const filtered = useMemo(() => {
    return results
      .filter((r) => league === "all" || r.leagueName === league)
      .filter((r) => date === "all" || r.localDate === date)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [results, league, date]);

  // Pagination (over the flat, filtered list).
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // Reset to page 1 whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [league, date]);

  // Group the current page by day (descending).
  const groups = useMemo(() => {
    const map = new Map<string, FootballResult[]>();
    for (const r of paged) {
      const bucket = map.get(r.localDate);
      if (bucket) bucket.push(r);
      else map.set(r.localDate, [r]);
    }
    return Array.from(map.entries());
  }, [paged]);

  const isFiltered = league !== "all" || date !== "all";

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-line bg-surface px-9 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-pitch"
          >
            <option value="all">{t("filter.allDates")}</option>
            {dates.map((d) => (
              <option key={d} value={d}>
                {formatFullDateUTC(`${d}T00:00:00Z`)}
              </option>
            ))}
          </select>
        </label>

        {isFiltered && (
          <button
            onClick={() => {
              setLeague("all");
              setDate("all");
            }}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-white/5 px-4 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
            {t("filter.clear")}
          </button>
        )}
      </div>

      {/* Results grouped by day */}
      <div className="mt-8 space-y-8">
        {groups.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
            <CalendarDays className="h-8 w-8 text-muted" aria-hidden />
            <p className="font-semibold">{t("results.noResults")}</p>
            <p className="max-w-xs text-sm text-muted">{t("results.noResultsHint")}</p>
          </div>
        ) : (
          groups.map(([key, items]) => (
            <section key={key} aria-label={formatFullDateUTC(`${key}T00:00:00Z`)}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                {formatFullDateUTC(`${key}T00:00:00Z`)}
                <span className="text-xs font-medium normal-case text-muted">
                  {items.length} {items.length === 1 ? t("filter.result") : t("filter.results")}
                </span>
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {items.map((r) => (
                  <ResultCard key={r.fixtureId} result={r} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <nav
          className="mt-8 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"
          aria-label={`${t("page.results.title")} ${t("fixtures.page")}`}
        >
          <p className="text-sm text-muted">
            {t("fixtures.showing")}{" "}
            <span className="font-semibold text-foreground">
              {pageStart + 1}-{Math.min(pageStart + PAGE_SIZE, filtered.length)}
            </span>{" "}
            / {filtered.length} {t("filter.results")}
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
