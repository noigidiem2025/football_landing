"use client";

import { useState } from "react";
import type { LeagueTable } from "@/lib/types";
import { StandingsTable } from "./StandingsTable";
import { cn } from "@/lib/utils";

export function StandingsBrowser({ leagues }: { leagues: LeagueTable[] }) {
  const [activeId, setActiveId] = useState(leagues[0]?.id);
  const league = leagues.find((l) => l.id === activeId) ?? leagues[0];

  return (
    <div>
      {/* League selector */}
      <div
        role="tablist"
        aria-label="Select league"
        className="scrollbar-thin -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      >
        {leagues.map((l) => (
          <button
            key={l.id}
            role="tab"
            aria-selected={l.id === league.id}
            onClick={() => setActiveId(l.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
              l.id === league.id
                ? "bg-pitch text-[#04130a]"
                : "border border-line bg-white/5 text-muted hover:text-foreground",
            )}
          >
            {l.shortName}
          </button>
        ))}
      </div>

      <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide">{league.name}</h2>
      <StandingsTable league={league} />
    </div>
  );
}
