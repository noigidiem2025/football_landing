"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/i18n/useLanguage";

export interface SearchItem {
  title: string;
  href: string;
  type: string;
  meta?: string;
}

export function SearchView({ items }: { items: SearchItem[] }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  // Best-effort search event (debounced).
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const id = window.setTimeout(() => track("search", { query: q }), 600);
    return () => clearTimeout(id);
  }, [query]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter((item) => {
      const haystack = `${item.title} ${item.meta ?? ""} ${item.type}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">{t("header.search")}</span>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="h-12 w-full rounded-full border border-line bg-surface py-3.5 pl-12 pr-4 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-pitch"
        />
      </label>

      <div className="mt-6">
        {!hasQuery ? (
          <p className="py-12 text-center text-sm text-muted">{t("search.prompt")}</p>
        ) : results.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            {t("search.noResults")} &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              {results.length} {results.length === 1 ? t("filter.result") : t("filter.results")}
            </p>
            <ul className="space-y-2">
              {results.map((item) => (
                <li key={`${item.type}-${item.href}-${item.title}`}>
                  <Link
                    href={item.href}
                    className="card group flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <span className="rounded-full bg-pitch-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pitch">
                      {item.type === "News"
                        ? t("search.typeNews")
                        : item.type === "Prediction"
                          ? t("search.typePrediction")
                          : t("search.typeFixture")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{item.title}</span>
                      {item.meta && (
                        <span className="block truncate text-xs text-muted">{item.meta}</span>
                      )}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-pitch" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
