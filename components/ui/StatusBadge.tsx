"use client";

import type { MatchStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/useLanguage";

/** LIVE / UPCOMING / FT pill. Live variant has an animated pulse dot. */
export function StatusBadge({
  status,
  className,
}: {
  status: MatchStatus;
  className?: string;
}) {
  const { t } = useLanguage();

  if (status === "live") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-live",
          className,
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse-dot" />
        {t("status.live")}
      </span>
    );
  }

  const label =
    status === "finished"
      ? t("status.fullTime")
      : status === "tbd"
        ? t("status.tbd")
        : status === "scheduled"
          ? t("status.scheduled")
          : t("status.upcoming");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted",
        className,
      )}
    >
      {label}
    </span>
  );
}
