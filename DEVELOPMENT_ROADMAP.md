# DEVELOPMENT_ROADMAP.md

> Phased delivery plan. Each phase is independently shippable and ends with verification + doc updates.
> **Status:** Blueprint. **Last updated:** 2026-06-16

**Guiding rules**
- Do not break the existing World Cup Match Center UI at any phase.
- Every phase ends by updating `PROJECT_STATUS.md`, `ARCHITECTURE.md`, `TODO.md`.
- Every phase has an explicit **Definition of Done (DoD)** and a Lighthouse/perf gate.

---

## Phase 0 — Blueprint & sign-off ✅ (this deliverable)
**Goal:** agreed technical direction before any code.
- [x] Analyze current project structure
- [x] PROJECT_ARCHITECTURE.md, GOOGLE_SHEET_SCHEMA.md, COMPONENT_INVENTORY.md, IMPLEMENTATION_PLAN.md, DEVELOPMENT_ROADMAP.md
- [x] Conversion goal confirmed: **betting affiliate (FUN88 + JBO)** — Registration → FTD; two-LP model (LP1 info hub / LP2 conversion)
- [ ] Stakeholder sign-off on schema + compliance copy + affiliate tracking params
**DoD:** docs reviewed; partner affiliate IDs + allowed geos + min-age supplied; sheet shared.

---

## Phase 1 — Foundation & tooling
**Goal:** project scaffolding without changing visible UI.
- Add Shadcn UI (`components.json`, `cn`, CVA, `lucide-react`).
- Create target folder architecture (`components/{ui,layout,sections,cards,funnel,common}`, `lib/{cms,analytics,seo,utils}`).
- Migrate fonts to `next/font` (self-hosted); remove render-blocking `<link>`s.
- Replace Material Symbols font usage path with `lucide` `Icon` wrapper (keep old API shim).
- Set up env handling (`.env.local`, `env.ts` validation), `@next/bundle-analyzer`, Lighthouse CI config.
**DoD:** `build` + `lint` green; existing page renders **pixel-identical**; baseline Lighthouse recorded (target ≥ 90).
**Gate:** no visual diff vs current page.

---

## Phase 2 — CMS data layer (Google Sheets)
**Goal:** content fetched from Sheets, with fallback.
- Build `lib/cms/`: `sheets-client` (API v4 + ISR), `mappers`, Zod `schemas`, `repositories`, `config`.
- Migrate `lib/data.ts` → `lib/cms/fallback/*` fixtures.
- Create the live Google Sheet from GOOGLE_SHEET_SCHEMA.md; seed with current World Cup content.
- Wire **one** section (Standings) to the live sheet end-to-end as a vertical slice.
- Add `error.tsx` / `not-found.tsx` / `EmptyState`.
**DoD:** Standings renders from Sheets via ISR; kill-switch fallback verified; malformed-row handling tested.
**Gate:** TTFB from cache; no client-side Sheets calls; API key never in client bundle.

---

## Phase 3 — Component refactor to inventory
**Goal:** all existing sections sourced from CMS, split into reusable cards.
- Extract `MatchCard`, `NewsCard`, `PredictionCard`, `StandingRow`, `ProbabilityBar`, `SectionHeader`, `FlagImage`.
- Refactor Hero, MatchCenter, PredictionsBoard, NewsGrid to consume repositories.
- Convert images to `next/image` with locked dimensions.
- SiteHeader + MobileNav (Shadcn Sheet) + SiteFooter from `navigation` tab.
**DoD:** home page fully CMS-driven; UI unchanged; client-JS budget respected.
**Gate:** Lighthouse ≥ 90 mobile; CLS ≤ 0.05.

---

## Phase 4 — Routing & content pages (SEO / TOFU + MOFU)
**Goal:** the acquisition surface.
- Route group `(marketing)`: `/news` + `/news/[slug]`, `/matches` + `/matches/[id]`, `/predictions`, `/standings`, `/teams/[slug]`.
- `generateStaticParams` + ISR for detail routes; markdown body rendering (sanitized).
- `generateMetadata`, JSON-LD (`NewsArticle`, `SportsEvent`, `SportsTeam`, `Breadcrumb`), `sitemap.ts`, `robots.ts`, dynamic OG images.
- `RelatedRail` internal linking.
**DoD:** all routes statically generated, indexable, structured-data valid (Rich Results test).
**Gate:** Lighthouse SEO = 100; per-route JS ≤ budget.

---

## Phase 5 — Conversion funnel: betting affiliate (LP2 + BOFU)
**Goal:** turn LP1 traffic into Registrations & FTDs for FUN88 / JBO.
- `partners`, `offers`, `landing_pages`, `compliance` tabs live.
- **LP1 hooks:** `OfferRail`, `OddsWidget`, `CtaBanner`, `StickyCta` → hand off to LP2.
- **LP2 `/promo/[partner]`:** `PromoHero`, `BonusOffer`, `StepsToClaim`, `OddsComparison`, `RegistrationCta`, `TrustSignals`, `PartnerCard` (SSG+ISR per partner).
- **Compliance (mandatory):** `AgeGate`, `GeoGuard`, `ResponsibleGamblingBar`, `OfferDisclaimer`; responsible-gambling legal page.
- `/go/[offer]` 302 with affiliate ID + generated `click_id`/sub-IDs; `rel="sponsored nofollow noopener"`.
- `/api/postback` (secret-guarded) → GA4 Measurement Protocol + Sheet append for Registration/FTD attribution.
- `lib/analytics` events (`view_promo`, `click_register`, `age_gate_pass`, …) + GA4/Plausible + Web Vitals.
**DoD:** end-to-end funnel: LP1 view → CTA → LP2 → register click → `/go` redirect with sub-IDs → postback recorded; age-gate + geo-guard enforced.
**Gate:** added JS keeps Lighthouse ≥ 90; CTAs accessible; **no betting CTA shown to disallowed geos or pre-age-gate**; partner links correctly `rel`-tagged.
**Compliance gate:** 18+/21+ enforced per market; responsible-gambling messaging present on every betting surface; affiliate relationship disclosed.

---

## Phase 6 — Hardening, perf & launch
**Goal:** production readiness.
- On-demand revalidation route + Apps Script `onEdit` trigger (optional).
- Bundle-budget enforcement in CI; image/CDN tuning; cache headers.
- A11y audit (axe), cross-device QA, error-boundary coverage, 404/500 polish.
- Final Lighthouse run on all route types; SEO audit; security pass (secrets, untrusted-input, outbound rel).
**DoD:** all gates green on production build; runbook written.
**Gate:** Lighthouse ≥ 90 (Perf/A11y/BP/SEO) on home, list, detail, and a funnel page.

---

## Milestones & sequencing

```
M1 Foundation ready ........ end Phase 1   (no UI change, faster)
M2 Sheets-driven slice ..... end Phase 2   (Standings from CMS)
M3 Home fully CMS .......... end Phase 3
M4 SEO content portal ...... end Phase 4   (traffic acquisition live)
M5 Conversion funnel ....... end Phase 5   (monetization live)
M6 Production launch ....... end Phase 6
```

Phases are strictly ordered (each depends on the prior). Within a phase, tasks can parallelize.

---

## Cross-phase quality gates (every PR)
- `next build` + `next lint` + `tsc` clean.
- Lighthouse mobile ≥ 90 on affected routes.
- Per-route JS within budget (CI fails otherwise).
- No secret in client bundle; no `any`; CMS rows validated.
- Visual regression vs previous phase reviewed.

---

## Risks & mitigations
| Risk | Mitigation |
|------|------------|
| Sheets API rate limits / outage | ISR cache + static fallback fixtures; never fetch on client |
| Editors break header keys | Map by header name + Zod validation + clear schema doc + "don't rename" rule |
| Funnel JS hurts Lighthouse | Lazy/scroll-trigger islands; measure each addition against budget |
| Markdown from CMS = XSS | Sanitize; treat all cell content as untrusted |
| Slug changes break SEO | Slugs immutable once published (documented in schema) |
| Betting regulatory exposure (minors / banned geos) | Mandatory `AgeGate` + `GeoGuard` + responsible-gambling layer; betting CTAs gated by `partners.allowed_geos` & `min_age`; legal copy editor-owned in `compliance` tab |
| FTD not measurable without DB | Attribute via `click_id` sub-IDs in `/go`; reconcile with affiliate-network dashboard; optional `/api/postback` → GA4 MP + Sheet |
| Affiliate link quality (SEO penalty) | `rel="sponsored nofollow noopener"` on all partner links; LP2 isolated from SEO content |
