# IMPLEMENTATION_PLAN.md

> Ordered, verifiable build steps that realize the roadmap. Each step lists files touched, the approach, and how it's verified.
> **No code is written until this plan is approved.**
> **Status:** Blueprint. **Last updated:** 2026-06-16

Legend: 🟦 RSC · 🟨 CC · 🔧 config · 🧪 verify

---

## Step 0 — Pre-work (confirmed direction + inputs needed before Phase 1)
- ✅ **Conversion vertical:** betting affiliate (FUN88 + JBO), Registration → FTD, two-LP model.
- ✅ **Sheets access:** API v4 + read-only API key (default; gviz/CSV remain swappable).
1. Obtain per-partner inputs: `affiliate_id`, `register_url`, `tracker_param_map`, allowed geos, min age, bonus copy + T&Cs, responsible-gambling/helpline copy per market.
2. Create the Google Spreadsheet, add tabs per GOOGLE_SHEET_SCHEMA.md (incl. `partners`, `offers`, `landing_pages`, `compliance`), set "Anyone with link → Viewer".
3. Provision a **read-only API key** restricted to the Sheets API → `SHEET_ID`, `GOOGLE_SHEETS_API_KEY` in `.env.local`. Add `REVALIDATE_SECRET`, `POSTBACK_SECRET`, `GA4_API_SECRET`/`GA4_MEASUREMENT_ID`.
🧪 Verify: `curl` the values endpoint returns JSON for one tab.

---

## Phase 1 — Foundation

### 1.1 🔧 Install Shadcn + deps
- `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `zod`, `@radix-ui/*` (via Shadcn CLI).
- `npx shadcn@latest init` → generates `components.json`, `lib/utils/cn.ts`. Point aliases at `@/components/ui`.
- Keep existing `tailwind.config.ts` tokens; extend with Shadcn CSS variables mapping to current palette.
🧪 `tsc`/`build` green; existing page unchanged.

### 1.2 🔧 Create folder architecture
- Make empty dirs + index barrels: `components/{ui,layout,sections,cards,funnel,common}`, `lib/{cms,analytics,seo,utils}`, `docs/`.
🧪 No import breakage.

### 1.3 🔧 Fonts → `next/font`
- Replace Google Font `<link>`s in `app/layout.tsx` with `next/font` (Sora, Hanken Grotesk, JetBrains Mono), CSS variables, `display: swap`.
🧪 Visual diff = none; no render-blocking font request in network panel.

### 1.4 🟦 `common/Icon.tsx` (lucide) replacing `MaterialIcon`
- Same prop surface (`name`, `className`); map current icon names → lucide equivalents (trophy→Trophy, search→Search, etc.).
- Keep `MaterialIcon` as a thin re-export shim during migration, then remove.
🧪 Icons render; remove Material Symbols `<link>`.

### 1.5 🔧 Env validation + analyzers
- `lib/env.ts` (zod-validated `process.env`), `@next/bundle-analyzer`, Lighthouse CI config + script.
🧪 Build fails fast on missing env; baseline Lighthouse recorded.

**Phase-end:** update PROJECT_STATUS / ARCHITECTURE / TODO.

---

## Phase 2 — CMS data layer

### 2.1 🟦 `lib/cms/config.ts`
- Tab names, ranges, per-entity `revalidate` windows, `SHEET_ID` from env.

### 2.2 🟦 `lib/cms/sheets-client.ts`
- `fetchTab(tab): Promise<string[][]>` using Sheets API v4 + `fetch(..., { next: { revalidate, tags } })`.
- Throw-safe: on network error return `null` so callers fall back.

### 2.3 🟦 `lib/cms/mappers.ts`
- `rowsToObjects(headers, rows)` → map by header key (order-independent), pipe-split lists, coerce booleans/numbers.

### 2.4 🟦 `lib/cms/schemas.ts`
- Zod schema per tab (Section 1–9 of schema doc); export `z.infer` types. `safeParse` per row; drop invalid, collect warnings.

### 2.5 🟦 `lib/cms/repositories.ts`
- `getSiteConfig`, `getNavigation`, `getTeams`, `getMatches`, `getStandings`, `getPredictions`, `getNews`, `getArticleBySlug`, `getOffers`, `getCtaBlocks`.
- Wrap each in `React.cache()`; resolve refs (team_id→team); apply `status=published` filter; fall back to fixtures on `null`.

### 2.6 🟦 `lib/cms/fallback/*`
- Move current `lib/data.ts` content here as typed fixtures (resilience + local dev without network).

### 2.7 Vertical slice: Standings from live sheet
- Seed `teams` + `standings` tabs; point `sections/Standings` at `getStandings()`.
🧪 Standings renders from Sheets; disable network → fallback renders; corrupt a row → skipped, page still builds.

**Phase-end:** doc updates.

---

## Phase 3 — Component refactor

### 3.1 🟦 `common/` atoms
- `SectionHeader`, `Pill`, `FlagImage` (`next/image`, fixed dims), `ProbabilityBar`, `EmptyState`, `*Skeleton`.

### 3.2 🟦 `cards/` molecules
- `MatchCard` (variant scroller|featured), `NewsCard` (list|rail), `PredictionCard` (featured|compact), `StandingRow`.
- Pure props; no fetching.

### 3.3 🟦/🟨 Refactor sections to consume repositories
- `Hero`, `MatchCenter` (CC `ScrollArea` island), `PredictionsBoard`, `Standings` (CC Shadcn `Tabs`), `NewsGrid`.
- Delete old monolithic markup once parity confirmed.

### 3.4 🟦/🟨 Layout chrome
- `Container`, `SiteHeader` (RSC shell + small CC nav island), `MobileNav` (Shadcn `Sheet`), `SiteFooter` from `navigation`.

### 3.5 Images
- All remote images → `next/image`; whitelist hosts in `next.config`; add `sizes`.
🧪 Lighthouse ≥ 90; CLS ≤ 0.05; home fully CMS-driven; visual parity.

**Phase-end:** doc updates.

---

## Phase 4 — Routing & SEO content

### 4.1 🔧 Route group `(marketing)` + segment files
- `news/page.tsx`, `news/[slug]/page.tsx`, `matches/`, `predictions/`, `standings/`, `teams/[slug]/`.
- `generateStaticParams` from repositories; `dynamicParams: true`; ISR.

### 4.2 🟦 Article rendering
- Markdown → sanitized HTML (e.g. `react-markdown` + safe schema). No raw cell HTML.

### 4.3 🟦 SEO
- `lib/seo/metadata.ts`: `buildMetadata()` + JSON-LD builders.
- `app/sitemap.ts`, `app/robots.ts`, `opengraph-image.tsx`.
- `RelatedRail` (internal links by `team_ids`).
🧪 Rich Results valid; SEO score 100; all detail routes prerender.

**Phase-end:** doc updates.

---

## Phase 5 — Conversion funnel: betting affiliate (FUN88 / JBO)

### 5.1 🟦 CMS: partners & offers
- Seed `partners` (fun88, jbo: affiliate_id, register_url, tracker_param_map, bonus, allowed_geos, min_age), `offers`, `landing_pages`, `compliance` tabs.
- Repositories: `getPartners`, `getPartner(slug)`, `getOffers(placement)`, `getLandingPage(slug)`, `getCompliance(geo)`.

### 5.2 🟦 LP1 hooks (info hub → LP2)
- `funnel/OfferRail`, `OddsWidget`, `CtaBanner` (from `cta_blocks`+`offers`), `OfferLink` (wraps `/go/[id]`, `rel="sponsored nofollow noopener"`).
- 🟨 `StickyCta`: mobile bottom bar, IntersectionObserver, dismissible.

### 5.3 🟦 LP2 `app/promo/[partner]/page.tsx` (SSG + ISR)
- `generateStaticParams` from `partners`; compose `PromoHero`, `BonusOffer`, `StepsToClaim`, `OddsComparison`, `RegistrationCta`, `TrustSignals`, `PartnerCard`.
- `generateMetadata` from `landing_pages`; minimal nav (conversion-focused).

### 5.4 🟦/🟨 Compliance layer (mandatory)
- 🟨 `AgeGate` (cookie-persisted, min_age per market), 🟦 `GeoGuard` (edge `geo` header → hide CTAs in disallowed markets), 🟦 `ResponsibleGamblingBar`, `OfferDisclaimer`.
- `app/legal/responsible-gambling/page.tsx`; helpline links from `compliance`.

### 5.5 🟦 `app/go/[offer]/route.ts` (tracked redirect + attribution)
- Resolve `offers.id` → `partner` → build destination from `register_url` + `tracker_param_map`; generate `click_id` (uuid) and inject `placement`/`campaign` sub-IDs; set tracking cookie; `302`. Unknown/blocked geo → `/`.

### 5.6 🟦 `app/api/postback/route.ts` (no-backend FTD/registration intake)
- Secret-guarded; receive partner S2S postback (`click_id`, event=registration|ftd, amount); forward to **GA4 Measurement Protocol** and append a row to a Sheet via Apps Script. Idempotent on `click_id`+event.

### 5.7 🟨 Analytics
- `lib/analytics/{events,track}.ts`; GA4/Plausible loader (deferred); `useReportWebVitals`.
- Fire `view_promo`/`view_offer`/`click_cta`/`click_register`/`age_gate_pass`/`scroll_depth`, carrying `click_id`.
🧪 Funnel end-to-end: LP1 → LP2 → `/go` (sub-IDs present in destination) → `/api/postback` records; age-gate + geo-guard enforced; partner links `rel`-tagged; Lighthouse still ≥ 90.

**Phase-end:** doc updates.

---

## Phase 6 — Hardening & launch

### 6.1 🔧 On-demand revalidation
- `app/api/revalidate/route.ts` (secret-guarded `revalidateTag`); Apps Script `onEdit` snippet documented for content team.

### 6.2 🔧 Perf & CI gates
- Bundle-budget check in CI; cache headers; image optimization review.

### 6.3 🧪 Audits
- axe a11y, cross-device QA, error-boundary coverage, security pass (env secrets, untrusted-input, outbound rel, redirect allow-list).

### 6.4 📦 Launch
- Final Lighthouse on home/list/detail/funnel; runbook; rollback notes.

---

## Definition of Done (project-level)
- All content from Google Sheets; site degrades gracefully to fallback.
- Reusable component inventory implemented; client-JS limited to declared islands.
- Lighthouse ≥ 90 (Perf/A11y/BP/SEO) across route types; SEO = 100 on content pages.
- Conversion funnel instrumented end-to-end with no backend of our own.
- Existing World Cup UI preserved throughout; `PROJECT_STATUS.md`, `ARCHITECTURE.md`, `TODO.md` kept current.

---

## Tracking cadence
After **each** phase: append to `PROJECT_STATUS.md` (what shipped + Lighthouse numbers), reconcile `ARCHITECTURE.md` (any deviation from blueprint), check off `TODO.md`. These three files are created at the start of Phase 1.
