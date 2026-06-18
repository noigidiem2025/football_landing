"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "./useLanguage";
import type { Lang } from "./LanguageProvider";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Lang; code: string; flag: string; label: string }[] = [
  { value: "vi", code: "VI", flag: "🇻🇳", label: "Tiếng Việt" },
  { value: "en", code: "EN", flag: "🇬🇧", label: "English" },
];

/**
 * Single inline language toggle (globe + VI/EN flag pills). One control for all
 * breakpoints — no responsive duplicate render.
 */
export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-line bg-white/5 p-1">
      <Globe className="ml-1 hidden h-4 w-4 text-muted sm:block" aria-hidden />
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLang(o.value)}
          aria-pressed={lang === o.value}
          aria-label={o.label}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-bold transition-colors",
            lang === o.value
              ? "bg-pitch text-[#04130a]"
              : "text-muted hover:text-foreground",
          )}
        >
          <span aria-hidden>{o.flag}</span>
          {o.code}
        </button>
      ))}
    </div>
  );
}
