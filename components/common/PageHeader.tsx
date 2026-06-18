"use client";

import { useLanguage } from "@/i18n/useLanguage";
import type { TranslationKey } from "@/i18n/vi";

export function PageHeader({
  eyebrowKey,
  titleKey,
  descKey,
}: {
  eyebrowKey?: TranslationKey;
  titleKey: TranslationKey;
  descKey?: TranslationKey;
}) {
  const { t } = useLanguage();
  return (
    <header className="mb-6 sm:mb-8">
      {eyebrowKey && (
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-pitch">
          {t(eyebrowKey)}
        </span>
      )}
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
        {t(titleKey)}
      </h1>
      {descKey && <p className="mt-2 text-sm text-muted">{t(descKey)}</p>}
    </header>
  );
}
