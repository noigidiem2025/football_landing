import type { CtaConfig, VipTip } from "@/lib/types";

/**
 * Offline fallback for the Google Sheet `cta` tab.
 * Every `href` (destination) is what editors configure in the sheet. Fallback
 * CTAs point at Landing Page 2 so local preview and same-origin deploys work.
 */
export const ctaConfig: CtaConfig = {
  sticky: {
    placement: "sticky",
    enabled: true,
    title: "100% Welcome Bonus up to $200",
    subtitle: "New players · 30s sign-up",
    ctaLabel: "Claim bonus",
    href: "/landing-2",
    badge: "Exclusive",
  },
  exit_intent: {
    placement: "exit_intent",
    enabled: true,
    title: "Wait — grab your free bet",
    subtitle:
      "Don't leave empty-handed. Claim a risk-free first bet before kickoff.",
    ctaLabel: "Get my free bet",
    href: "https://example.com/free-bet",
    badge: "Limited time",
  },
  in_article: {
    placement: "in_article",
    enabled: true,
    title: "Back your prediction with the best odds",
    subtitle: "Top bookmaker price on this fixture, boosted for new players.",
    ctaLabel: "Bet on this match",
    href: "https://example.com/odds",
    badge: "Boosted odds",
  },
  floating: {
    placement: "floating",
    enabled: true,
    title: "VIP Tips",
    ctaLabel: "VIP Tips",
    href: "/landing-2",
  },
  sidebar: {
    placement: "sidebar",
    enabled: true,
    title: "VIP Betting Tips",
    subtitle: "Unlock today's expert selections with proven ROI.",
    ctaLabel: "Unlock VIP tips",
    href: "https://example.com/vip",
    badge: "Premium",
  },
};

export const vipTips: VipTip[] = [
  { match: "Brazil vs Germany", market: "Brazil to win & BTTS", odds: "2.40", locked: false },
  { match: "Argentina vs France", market: "Over 2.5 goals", odds: "1.85", locked: true },
  { match: "Spain vs Italy", market: "Spain -1 handicap", odds: "2.10", locked: true },
  { match: "Portugal vs Netherlands", market: "Both teams to score", odds: "1.72", locked: true },
];
