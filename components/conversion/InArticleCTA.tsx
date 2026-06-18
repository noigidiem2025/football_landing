import { ArrowRight, BadgePercent } from "lucide-react";
import type { Cta } from "@/lib/types";
import { CtaLink } from "./CtaLink";

/** In-article banner. Server-rendered; destination comes from the sheet. */
export function InArticleCTA({ cta }: { cta: Cta }) {
  return (
    <aside className="card pitch-backdrop relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-pitch-soft blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pitch-soft sm:flex">
            <BadgePercent className="h-5 w-5 text-pitch" aria-hidden />
          </span>
          <div>
            {cta.badge && (
              <span className="mb-1.5 inline-block rounded-full bg-pitch-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pitch">
                {cta.badge}
              </span>
            )}
            <h3 className="font-display text-base font-bold tracking-tight sm:text-lg">
              {cta.title}
            </h3>
            {cta.subtitle && <p className="mt-1 text-sm text-muted">{cta.subtitle}</p>}
          </div>
        </div>
        <CtaLink
          href={cta.href}
          placement="in_article"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-pitch px-6 py-3 text-sm font-bold text-[#04130a] transition-colors hover:bg-pitch-dark"
        >
          {cta.ctaLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </CtaLink>
      </div>
    </aside>
  );
}
