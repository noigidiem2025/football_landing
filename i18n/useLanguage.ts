"use client";

import { useContext } from "react";
import { LanguageContext, type LanguageContextValue } from "./LanguageProvider";

/** Access the current language, switcher and translator `t()`. */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
