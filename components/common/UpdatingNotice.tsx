"use client";

import { FileText } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";
import type { TranslationKey } from "@/i18n/vi";

/** Localized "content is being updated" placeholder (no fake content). */
export function UpdatingNotice({
  messageKey = "common.contentUpdating",
  className,
}: {
  messageKey?: TranslationKey;
  className?: string;
}) {
  const { t } = useLanguage();
  return (
    <div
      className={`card flex flex-col items-center gap-2 px-6 py-12 text-center ${className ?? ""}`}
    >
      <FileText className="h-7 w-7 text-muted" aria-hidden />
      <p className="text-sm text-muted">{t(messageKey)}</p>
    </div>
  );
}
