# COMPONENT_INVENTORY.md

> Every component, its tier, render type, data source, and reusability. Atomic-design layering on top of Shadcn UI.
> **Rule:** presentational components are pure (props in, UI out) and never fetch. Server Components fetch via repositories and pass typed props down.

**Status:** Blueprint. **Last updated:** 2026-06-16
RSC = React Server Component · CC = Client Component (`"use client"`)

---

## 1. Layering model

```
ui/        Shadcn primitives (atoms)            → button, card, tabs, badge, sheet…
common/    cross-cutting atoms/molecules        → SectionHeader, Pill, FlagImage, Skeletons
cards/     entity molecules                     → MatchCard, NewsCard, PredictionCard…
sections/  page organisms (compose cards)       → Hero, MatchCenter, Standings…
funnel/    conversion organisms                 → CtaBanner, StickyCta, OfferGrid, LeadCaptureForm
layout/    chrome                               → SiteHeader, SiteFooter, Container, MobileNav
```

---

## 2. `ui/` — Shadcn primitives (install via CLI)

| Component | Render | Used by | Notes |
|-----------|--------|---------|-------|
| `Button` | RSC/CC | everywhere | CVA variants: primary (pitch-green), ghost, outline — maps existing button styles |
| `Card` | RSC | cards/sections | base for glass-card variant |
| `Tabs` | CC | Standings (groups) | replaces manual tab buttons |
| `Badge` | RSC | LIVE pill, offer badge | |
| `Sheet` | CC | MobileNav drawer | a11y mobile menu |
| `Skeleton` | RSC | loading states | |
| `ScrollArea` | CC | MatchCenter scroller | styled scrollbar |
| `Separator`, `AspectRatio`, `Avatar` | RSC | misc | |

> A `glass-card` variant is added to `Card` via CVA, preserving the current visual (`bg white/3 + blur + border`, hover lift).

---

## 3. `common/` — shared atoms & molecules

| Component | Render | Props (shape) | Reuse |
|-----------|--------|---------------|-------|
| `SectionHeader` | RSC | `{ title, action?: {label, href} }` | every section heading + "View All" link |
| `Pill` | RSC | `{ tone: 'live'\|'muted'\|'green', children }` | LIVE, group labels, badges |
| `FlagImage` | RSC | `{ src, alt, size }` | wraps `next/image` for flags (fixed dims → no CLS) |
| `Icon` | RSC | `{ name, className }` | thin wrapper over `lucide-react` (replaces `MaterialIcon`) |
| `EmptyState` | RSC | `{ title, hint? }` | when a CMS collection is empty |
| `*Skeleton` | RSC | — | per-section loading placeholders |
| `ProbabilityBar` | RSC | `{ segments: {pct, colorClass}[] }` | prediction bar (reusable) |

---

## 4. `cards/` — entity molecules

| Component | Render | Props | Source tab | Replaces |
|-----------|--------|-------|------------|----------|
| `MatchCard` | RSC | `{ match, variant: 'scroller'\|'featured' }` | `matches` | inline markup in MatchCenter/Hero |
| `NewsCard` | RSC | `{ article, variant: 'list'\|'rail' }` | `news` | News item markup |
| `PredictionCard` | RSC | `{ prediction, variant: 'featured'\|'compact' }` | `predictions` | MatchPrediction cards |
| `StandingRow` | RSC | `{ row, isLast }` | `standings` | table row |
| `TeamCard` | RSC | `{ team }` | `teams` | new |
| `OfferCard` | RSC | `{ offer }` | `offers` | new (funnel) |

All cards are **link-wrapped** to their detail route or tracked `/go/[offer]` where applicable.

---

## 5. `sections/` — page organisms

| Component | Render | Composes | Source | Maps existing file |
|-----------|--------|----------|--------|--------------------|
| `Hero` | RSC | Button, MatchCard(featured), Pill | `site_config`, featured `matches` | `components/Hero.tsx` |
| `MatchCenter` | RSC (+CC scroll island) | SectionHeader, MatchCard×N, ScrollArea | `matches` | `components/MatchCenter.tsx` |
| `PredictionsBoard` | RSC | SectionHeader, PredictionCard×N | `predictions` | `components/MatchPrediction.tsx` |
| `Standings` | RSC (+CC Tabs) | SectionHeader, Tabs, StandingRow×N | `standings` | `components/Standings.tsx` |
| `NewsGrid` | RSC | SectionHeader, NewsCard×N | `news` | `components/News.tsx` |
| `RelatedRail` | RSC | NewsCard(rail) | `news` by `team_ids` | new (internal linking/SEO) |

---

## 6. `funnel/` — conversion organisms (betting affiliate, two-LP model)

**LP1 (info hub) — soft hand-off to LP2:**
| Component | Render | Props | Source | Stage |
|-----------|--------|-------|--------|-------|
| `OfferRail` | RSC | `{ offers, context }` | `offers` (placement=rail) | MOFU — contextual in-content CTA |
| `OddsWidget` | RSC | `{ match, partner }` | `partners`+`matches` | MOFU — odds hook → LP2 |
| `CtaBanner` | RSC | `{ block }` | `cta_blocks`+`offers` | BOFU — maps `components/CTA.tsx` |
| `StickyCta` | CC | `{ offer }` | `offers` (placement=sticky) | BOFU — mobile scroll-triggered bar |
| `OfferLink` | RSC | `{ offerId, children }` | wraps `/go/[id]`, `rel="sponsored nofollow noopener"` | all CTAs |

**LP2 (`/promo/[partner]`) — conversion layer:**
| Component | Render | Props | Source | Stage |
|-----------|--------|-------|--------|-------|
| `PromoHero` | RSC | `{ landingPage, partner }` | `landing_pages` | BOFU — headline + primary CTA |
| `BonusOffer` | RSC | `{ partner }` | `partners` | BOFU — bonus headline + terms |
| `StepsToClaim` | RSC | `{ steps }` | `landing_pages` | BOFU — Register→Deposit→Bet |
| `OddsComparison` | RSC | `{ partners }` | `partners` | BOFU — FUN88 vs JBO table |
| `RegistrationCta` | RSC | `{ offer }` | `offers` | BOFU — primary register button (→ `/go`) |
| `TrustSignals` | RSC | `{ signals }` | `landing_pages` | BOFU — licensed/payouts/support |
| `PartnerCard` | RSC | `{ partner }` | `partners` | BOFU — logo/rating/bonus |
| `NewsletterInline` | CC | `{ offer }` | Google Form | Retention |

**Compliance (all surfaces) — mandatory for betting:**
| Component | Render | Props | Source | Notes |
|-----------|--------|-------|--------|-------|
| `AgeGate` | CC | `{ minAge, copy }` | `compliance`/`site_config` | cookie-persisted 18+/21+ interstitial before LP2 |
| `ResponsibleGamblingBar` | RSC | `{ copy, helpline }` | `compliance` | persistent near CTAs |
| `GeoGuard` | RSC | `{ allowedGeos, children }` | `partners`/`compliance` | hides betting CTAs in disallowed markets (edge `geo`) |
| `OfferDisclaimer` | RSC | `{ text }` | `compliance` | "T&Cs apply. Play responsibly." |

Conversion events (`view_promo`, `view_offer`, `click_cta`, `click_register`, `age_gate_pass`, `scroll_depth`) fire via `lib/analytics`. `click_id` sub-IDs are generated in `/go/[offer]` for partner-side Registration/FTD attribution (see PROJECT_ARCHITECTURE §6.2).

---

## 7. `layout/` — chrome

| Component | Render | Composes | Maps existing |
|-----------|--------|----------|---------------|
| `SiteHeader` | RSC shell + CC nav island | logo, nav, search, primary CTA | `components/TopNavBar.tsx` |
| `MobileNav` | CC | Shadcn `Sheet` drawer | new (mobile-first) |
| `SiteFooter` | RSC | nav links, legal, social | `components/Footer.tsx` |
| `Container` | RSC | max-width 1280 wrapper | new (DRYs `max-w-container-max mx-auto px-…`) |
| `PromoBar` | RSC | `site_config.announcement_text` | new (optional TOFU/BOFU strip) |

---

## 8. Existing → target mapping (migration table)

| Current file | Becomes | Action |
|--------------|---------|--------|
| `components/Hero.tsx` | `sections/Hero.tsx` + `cards/MatchCard` | refactor, data via props |
| `components/MatchCenter.tsx` | `sections/MatchCenter.tsx` + `cards/MatchCard` | extract card |
| `components/MatchPrediction.tsx` | `sections/PredictionsBoard.tsx` + `cards/PredictionCard` | extract card + `ProbabilityBar` |
| `components/Standings.tsx` | `sections/Standings.tsx` + `cards/StandingRow` | Tabs → Shadcn |
| `components/News.tsx` | `sections/NewsGrid.tsx` + `cards/NewsCard` | extract card |
| `components/CTA.tsx` | `funnel/CtaBanner.tsx` | wire to `offers`/`cta_blocks` |
| `components/Footer.tsx` | `layout/SiteFooter.tsx` | data via `navigation` |
| `components/TopNavBar.tsx` | `layout/SiteHeader.tsx` + `MobileNav` | add mobile drawer |
| `components/MaterialIcon.tsx` | `common/Icon.tsx` (lucide) | **deprecate font**, keep API |
| `lib/data.ts` | `lib/cms/fallback/*` | becomes resilience fallback |

> Nothing is deleted until its replacement renders identically — preserves current functionality.

---

## 9. Client-component budget (interactivity islands only)

Only these ship JS: `MobileNav`, `SiteHeader` nav island, `Standings` Tabs, `MatchCenter` ScrollArea, `StickyCta`, `LeadCaptureForm`, `NewsletterInline`, analytics reporter. **Everything else is RSC.** This is the core of the Lighthouse ≥ 90 strategy.

---

## 10. Reusability principles

1. **Variant-driven, not duplicate** — cards expose a `variant` prop instead of forking components.
2. **Data-agnostic** — a card accepts a typed entity; it doesn't know about Sheets.
3. **Composition over config** — sections compose cards; pages compose sections.
4. **One token system** — existing Tailwind theme (colors/spacing/fonts) is the shared design language; Shadcn variants reference it.
5. **A11y by default** — interactive components inherit Radix semantics.
