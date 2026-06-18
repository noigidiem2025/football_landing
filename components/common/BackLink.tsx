"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";
import type { TranslationKey } from "@/i18n/vi";

export function BackLink({
  href,
  labelKey,
}: {
  href: string;
  labelKey: TranslationKey;
}) {
  const { t } = useLanguage();
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-pitch"
    >
      <ChevronLeft className="h-4 w-4" aria-hidden />
      {t(labelKey)}
    </Link>
  );
}
