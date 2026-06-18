"use client";

import { useEffect, useState } from "react";
import { X, Gift } from "lucide-react";
import type { Cta } from "@/lib/types";
import { CtaLink } from "./CtaLink";

const KEY = "cta:sticky:dismissed";

/** Bottom sticky bar, appears after scrolling, dismissible for the session. */
export function StickyCTA({ cta }: { cta: Cta }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-fade-up border-t border-line bg-surface/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-container items-center gap-3 px-4 py-3 sm:px-6">
        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pitch-soft sm:flex">
          <Gift className="h-5 w-5 text-pitch" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{cta.title}</p>
          {cta.subtitle && (
            <p className="truncate text-xs text-muted">{cta.subtitle}</p>
          )}
        </div>
        <CtaLink
          href={cta.href}
          placement="sticky"
          className="shrink-0 rounded-full bg-pitch px-5 py-2.5 text-sm font-bold text-[#04130a] transition-colors hover:bg-pitch-dark"
        >
          {cta.ctaLabel}
        </CtaLink>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem(KEY, "1");
            setVisible(false);
          }}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1.5 text-muted transition-colors hover:bg-white/10 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
