import type { PredictionOutcome, OutcomeTone } from "@/lib/types";

const toneText: Record<OutcomeTone, string> = {
  home: "text-pitch",
  draw: "text-muted",
  away: "text-gold",
};

const toneBar: Record<OutcomeTone, string> = {
  home: "bg-pitch",
  draw: "bg-white/25",
  away: "bg-gold",
};

/** Stacked win/draw/win probability bar with labels. */
export function PredictionBar({ outcomes }: { outcomes: PredictionOutcome[] }) {
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between text-xs font-semibold">
        {outcomes.map((o) => (
          <span key={o.label} className={toneText[o.tone]}>
            {o.label} {o.pct}%
          </span>
        ))}
      </div>
      <div
        className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-elevated"
        role="img"
        aria-label={outcomes.map((o) => `${o.label} ${o.pct}%`).join(", ")}
      >
        {outcomes.map((o) => (
          <div key={o.label} className={toneBar[o.tone]} style={{ width: `${o.pct}%` }} />
        ))}
      </div>
    </div>
  );
}
