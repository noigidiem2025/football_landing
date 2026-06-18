"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Gift } from "lucide-react";
import type { Cta } from "@/lib/types";
import { CtaLink } from "./CtaLink";

const KEY = "cta:exit:shown";

/**
 * Exit-intent modal. Desktop: triggers when the cursor leaves the top of the
 * viewport. Touch/mobile: a time-based fallback. Shows once per session.
 */
export function ExitIntentPopup({ cta }: { cta: Cta }) {
  const [open, setOpen] = useState(false);

  const trigger = useCallback(() => {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
    setOpen(true);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;

    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) trigger();
    };
    document.addEventListener("mouseout", onMouseOut);

    // Mobile fallback — no hover, so trigger after dwell time.
    const isTouch = window.matchMedia("(hover: none)").matches;
    const timer = isTouch ? window.setTimeout(trigger, 25_000) : undefined;

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      if (timer) clearTimeout(timer);
    };
  }, [trigger]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div className="relative w-full max-w-md animate-fade-up rounded-2xl border border-line bg-surface p-6 text-center shadow-card sm:p-8">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted transition-colors hover:bg-white/10 hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pitch-soft">
          <Gift className="h-7 w-7 text-pitch" aria-hidden />
        </span>

        {cta.badge && (
          <span className="mb-3 inline-block rounded-full bg-live/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-live">
            {cta.badge}
          </span>
        )}

        <h2 id="exit-title" className="font-display text-2xl font-extrabold tracking-tight">
          {cta.title}
        </h2>
        {cta.subtitle && <p className="mt-2 text-sm text-muted">{cta.subtitle}</p>}

        <CtaLink
          href={cta.href}
          placement="exit_intent"
          className="mt-6 flex w-full items-center justify-center rounded-full bg-pitch px-6 py-3.5 text-sm font-bold text-[#04130a] transition-colors hover:bg-pitch-dark"
          onClick={() => setOpen(false)}
        >
          {cta.ctaLabel}
        </CtaLink>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 text-xs text-muted underline-offset-2 hover:underline"
        >
          No thanks, I&apos;ll pass
        </button>
      </div>
    </div>
  );
}
