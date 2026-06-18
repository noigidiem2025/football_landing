import type { PredictionArticle } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function HeadToHead({ article }: { article: PredictionArticle }) {
  if (article.h2h.length === 0) return null;

  // Tally results from the home team's perspective.
  const homeCode = article.home.code;
  const tally = article.h2h.reduce(
    (acc, m) => {
      const homeIsArticleHome = m.homeCode === homeCode;
      if (m.winner === "draw") acc.draws += 1;
      else if (
        (m.winner === "home" && homeIsArticleHome) ||
        (m.winner === "away" && !homeIsArticleHome)
      )
        acc.homeWins += 1;
      else acc.awayWins += 1;
      return acc;
    },
    { homeWins: 0, draws: 0, awayWins: 0 },
  );

  const summary = [
    { value: tally.homeWins, label: `${article.home.code} wins`, tone: "text-pitch" },
    { value: tally.draws, label: "Draws", tone: "text-muted" },
    { value: tally.awayWins, label: `${article.away.code} wins`, tone: "text-gold" },
  ];

  return (
    <section id="h2h" aria-labelledby="h2h-heading" className="scroll-mt-24">
      <SectionHeading id="h2h-heading" eyebrow="Previous meetings" title="Head to Head" />

      <div className="card overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
          {summary.map((s) => (
            <div key={s.label} className="px-4 py-5 text-center">
              <span className={cn("block font-display text-3xl font-extrabold tabular-nums", s.tone)}>
                {s.value}
              </span>
              <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wider text-muted">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <ul className="divide-y divide-line/60">
          {article.h2h.map((m, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span className="w-24 shrink-0 text-[11px] text-muted">{formatDate(m.date)}</span>
              <span className="flex-1 text-center font-semibold tabular-nums">
                {m.homeCode} <span className="text-pitch">{m.score}</span> {m.awayCode}
              </span>
              <span className="w-24 shrink-0 truncate text-right text-[11px] text-muted">
                {m.competition}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
