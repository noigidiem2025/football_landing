"use client";

import { CalendarDays, Clock, MapPin, Trophy } from "lucide-react";
import type { PredictionArticle } from "@/lib/types";
import { useLanguage } from "@/i18n/useLanguage";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** Kickoff facts: date, time, venue, group. */
export function MatchTime({ article }: { article: PredictionArticle }) {
  const { t } = useLanguage();
  const items = [
    { icon: CalendarDays, label: t("prediction.date"), value: formatDate(article.kickoffISO) },
    { icon: Clock, label: t("prediction.kickoff"), value: formatTime(article.kickoffISO) },
    { icon: MapPin, label: t("prediction.venue"), value: article.venue || "TBD" },
    { icon: Trophy, label: t("prediction.stage"), value: article.group || "—" },
  ];

  return (
    <section aria-label={t("prediction.matchTime")}>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card flex flex-col gap-2 p-4">
            <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
              <Icon className="h-3.5 w-3.5 text-pitch" aria-hidden />
              {label}
            </dt>
            <dd className="text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
