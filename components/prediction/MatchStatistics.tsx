import type { MatchStat, PredictionArticle } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

function StatRow({ stat }: { stat: MatchStat }) {
  const total = stat.home + stat.away || 1;
  const homeShare = (stat.home / total) * 100;
  const homeLeads = stat.home >= stat.away;
  const fmt = (n: number) => `${n}${stat.unit ?? ""}`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm font-semibold tabular-nums">
        <span className={homeLeads ? "text-pitch" : "text-foreground"}>{fmt(stat.home)}</span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
          {stat.label}
        </span>
        <span className={!homeLeads ? "text-gold" : "text-foreground"}>{fmt(stat.away)}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-surface-elevated">
        <div className="bg-pitch" style={{ width: `${homeShare}%` }} />
        <div className="bg-gold/70" style={{ width: `${100 - homeShare}%` }} />
      </div>
    </div>
  );
}

export function MatchStatistics({ article }: { article: PredictionArticle }) {
  if (article.stats.length === 0) return null;

  return (
    <section id="statistics" aria-labelledby="stats-heading" className="scroll-mt-24">
      <SectionHeading id="stats-heading" eyebrow="Head to head form" title="Match Statistics" />
      <div className="card space-y-5 p-5 sm:p-6">
        {article.stats.map((stat) => (
          <StatRow key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
