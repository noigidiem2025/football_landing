"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();
  useEffect(() => {
    // Surface for diagnostics; replace with a reporter when one is configured.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-container flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-live/15">
        <AlertTriangle className="h-7 w-7 text-live" aria-hidden />
      </span>
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        {t("error.title")}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">{t("error.desc")}</p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-pitch px-6 py-2.5 text-sm font-bold text-[#04130a] transition-colors hover:bg-pitch-dark"
        >
          {t("common.tryAgain")}
        </button>
        <Link
          href="/"
          className="rounded-full border border-line bg-white/5 px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
        >
          {t("common.backHome")}
        </Link>
      </div>
    </div>
  );
}
