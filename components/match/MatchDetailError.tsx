"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/i18n/useLanguage";

export function MatchDetailError({ type }: { type: "not-found" | "load-error" }) {
  const { t } = useLanguage();
  const message =
    type === "not-found" ? t("match.notFound") : t("match.loadError");

  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-live/15">
        <AlertTriangle className="h-6 w-6 text-live" aria-hidden />
      </span>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      <Button href="/fixtures" size="sm">
        {t("match.backToFixtures")}
      </Button>
    </div>
  );
}
