"use client";

import { useLanguage } from "@/i18n/useLanguage";

export function NewsByline({
  author,
  dateISO,
}: {
  author: string;
  dateISO: string;
}) {
  const { t, lang } = useLanguage();
  const date = dateISO
    ? new Date(dateISO).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  return (
    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
      {t("news.by")} {author}
      {date ? ` · ${date}` : ""}
    </p>
  );
}
