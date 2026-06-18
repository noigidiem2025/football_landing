"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { vi, type TranslationKey } from "./vi";
import { en } from "./en";

export type Lang = "vi" | "en";

const DICTS: Record<Lang, Record<TranslationKey, string>> = { vi, en };
const STORAGE_KEY = "lang";

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStored(): Lang | null {
  if (typeof document === "undefined") return null;
  try {
    const ls = window.localStorage.getItem(STORAGE_KEY);
    if (ls === "vi" || ls === "en") return ls;
    const m = document.cookie.match(/(?:^|;\s*)lang=(vi|en)/);
    if (m) return m[1] as Lang;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Client-side bilingual provider. Default is Vietnamese (matches SSR output);
 * the stored choice is applied on mount, so EN visitors switch without a reload.
 * Persists to both localStorage and a cookie.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  // Apply the stored preference after hydration (avoids SSR mismatch).
  useEffect(() => {
    const stored = readStored();
    if (stored && stored !== lang) setLangState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `lang=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => DICTS[lang][key] ?? vi[key] ?? key,
    [lang],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}
