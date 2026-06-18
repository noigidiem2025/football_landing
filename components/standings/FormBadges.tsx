"use client";

import type { FormResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/useLanguage";
import type { TranslationKey } from "@/i18n/vi";

const style: Record<FormResult, string> = {
  W: "bg-pitch-soft text-pitch",
  D: "bg-white/10 text-muted",
  L: "bg-live/15 text-live",
};

const labelKey: Record<FormResult, TranslationKey> = {
  W: "standings.win",
  D: "standings.draw",
  L: "standings.loss",
};

/**
 * Recent form as small chips. On mobile the letter is hidden (color only, with
 * an accessible label); from `sm` up the W/D/L letter shows.
 */
export function FormBadges({ form }: { form: FormResult[] }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center gap-1">
      {form.map((r, i) => (
        <span
          key={i}
          title={t(labelKey[r])}
          aria-label={t(labelKey[r])}
          className={cn(
            "flex h-3.5 w-3.5 items-center justify-center rounded-[3px] text-[0px] font-bold sm:h-5 sm:w-6 sm:text-[10px]",
            style[r],
          )}
        >
          {r}
        </span>
      ))}
    </div>
  );
}
