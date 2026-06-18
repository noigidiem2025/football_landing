import { Crown } from "lucide-react";
import type { Cta } from "@/lib/types";
import { CtaLink } from "./CtaLink";

/**
 * Floating right-edge tab. Sits vertically centred so it never collides with
 * the bottom sticky bar. Server-rendered (it's just a link).
 */
export function FloatingCTA({ cta }: { cta: Cta }) {
  return (
    <div className="fixed right-0 top-1/2 z-30 -translate-y-1/2">
      <CtaLink
        href={cta.href}
        placement="floating"
        className="flex flex-col items-center gap-2 rounded-l-xl bg-pitch py-3 pl-2.5 pr-2 text-[#04130a] shadow-glow transition-colors hover:bg-pitch-dark"
      >
        <Crown className="h-5 w-5" aria-hidden />
        <span className="text-xs font-bold uppercase tracking-wider [writing-mode:vertical-rl] rotate-180">
          {cta.ctaLabel}
        </span>
      </CtaLink>
    </div>
  );
}
