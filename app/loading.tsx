"use client";

import { useLanguage } from "@/i18n/useLanguage";

export default function Loading() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label={t("common.loading")}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-pitch" />
      <span className="sr-only">{t("common.loading")}</span>
    </div>
  );
}
