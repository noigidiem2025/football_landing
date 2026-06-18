import { Goal, ArrowRightLeft } from "lucide-react";
import type { MatchEvent, MatchResult } from "@/lib/types";
import { cn } from "@/lib/utils";

function minuteLabel(e: MatchEvent): string {
  return `${e.minute}${e.extra ? `+${e.extra}` : ""}'`;
}

function EventIcon({ type }: { type: MatchEvent["type"] }) {
  if (type === "goal" || type === "penalty" || type === "own_goal") {
    return <Goal className="h-4 w-4 text-pitch" aria-hidden />;
  }
  if (type === "yellow") {
    return <span className="block h-3.5 w-2.5 rounded-[2px] bg-gold" aria-hidden />;
  }
  if (type === "red") {
    return <span className="block h-3.5 w-2.5 rounded-[2px] bg-live" aria-hidden />;
  }
  return <ArrowRightLeft className="h-4 w-4 text-muted" aria-hidden />;
}

function eventNote(type: MatchEvent["type"]): string {
  if (type === "penalty") return " (pen)";
  if (type === "own_goal") return " (OG)";
  if (type === "sub") return " (sub)";
  return "";
}

/** Full chronological match-events timeline. Home events align left, away right. */
export function EventTimeline({ result }: { result: MatchResult }) {
  const events = [...result.events].sort(
    (a, b) => a.minute + (a.extra ?? 0) / 100 - (b.minute + (b.extra ?? 0) / 100),
  );

  if (events.length === 0) {
    return <p className="py-3 text-center text-sm text-muted">No events recorded.</p>;
  }

  return (
    <ul className="space-y-2.5">
      {events.map((e, i) => {
        const isHome = e.side === "home";
        return (
          <li
            key={i}
            className={cn(
              "flex items-center gap-2 text-sm",
              isHome ? "flex-row" : "flex-row-reverse text-right",
            )}
          >
            <span className="w-9 shrink-0 font-display text-xs font-bold tabular-nums text-muted">
              {minuteLabel(e)}
            </span>
            <span className="shrink-0">
              <EventIcon type={e.type} />
            </span>
            <span className="min-w-0 truncate">
              <span className="font-medium">{e.player}</span>
              <span className="text-muted">{eventNote(e.type)}</span>
              {e.assist && <span className="text-xs text-muted"> · {e.assist}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
