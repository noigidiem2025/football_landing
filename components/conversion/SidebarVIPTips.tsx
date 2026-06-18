import { Crown, Lock, TrendingUp } from "lucide-react";
import type { Cta, VipTip } from "@/lib/types";
import { CtaLink } from "./CtaLink";
import { cn } from "@/lib/utils";

function TipRow({ tip }: { tip: VipTip }) {
  return (
    <li className="relative rounded-xl border border-line bg-white/[0.03] p-3">
      <div className={cn(tip.locked && "select-none blur-[5px]")} aria-hidden={tip.locked}>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold">{tip.match}</span>
          <span className="shrink-0 rounded-md bg-pitch-soft px-2 py-0.5 text-xs font-bold text-pitch">
            {tip.odds}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
          <TrendingUp className="h-3 w-3 text-pitch" aria-hidden />
          {tip.market}
        </p>
      </div>
      {tip.locked && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Lock className="h-4 w-4 text-muted" aria-label="Locked tip" />
        </span>
      )}
    </li>
  );
}

/** Sidebar VIP tips widget — teases locked premium tips behind a CTA. */
export function SidebarVIPTips({ cta, tips }: { cta: Cta; tips: VipTip[] }) {
  return (
    <section aria-labelledby="vip-heading" className="card overflow-hidden">
      <header className="flex items-center gap-2 border-b border-line bg-pitch-soft/40 px-4 py-3">
        <Crown className="h-4 w-4 text-gold" aria-hidden />
        <h2 id="vip-heading" className="text-sm font-bold uppercase tracking-wide">
          {cta.title}
        </h2>
        {cta.badge && (
          <span className="ml-auto rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
            {cta.badge}
          </span>
        )}
      </header>

      <div className="space-y-2.5 p-4">
        <ul className="space-y-2.5">
          {tips.map((tip, i) => (
            <TipRow key={i} tip={tip} />
          ))}
        </ul>

        {cta.subtitle && <p className="pt-1 text-xs text-muted">{cta.subtitle}</p>}

        <CtaLink
          href={cta.href}
          placement="sidebar"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-pitch px-5 py-3 text-sm font-bold text-[#04130a] transition-colors hover:bg-pitch-dark"
        >
          <Lock className="h-4 w-4" aria-hidden />
          {cta.ctaLabel}
        </CtaLink>
      </div>
    </section>
  );
}
