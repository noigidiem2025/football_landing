"use client";

import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";

/** Bilingual fixtures error fallback (shown when the API call fails). */
export function FixturesError() {
  const { t } = useLanguage();
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-live/15">
        <AlertTriangle className="h-6 w-6 text-live" aria-hidden />
      </span>
      <p className="max-w-sm text-sm text-muted">{t("fixtures.loadError")}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-1 rounded-full bg-pitch px-5 py-2.5 text-sm font-bold text-[#04130a] transition-colors hover:bg-pitch-dark"
      >
        {t("common.tryAgain")}
      </button>
    </div>
  );
}
