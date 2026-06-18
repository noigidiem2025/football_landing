# PROJECT_ARCHITECTURE.md

> Football media portal — traffic acquisition + conversion funnel.
> Next.js 15 · App Router · TypeScript · TailwindCSS · Shadcn UI · Google Sheets CMS · No backend / no DB.

**Status:** Blueprint (pre-implementation). No application code has been written for this architecture yet.
**Last updated:** 2026-06-16

---

## 1. Architectural goals & non-negotiables

| Goal | Constraint it creates |
|------|------------------------|
| No backend, no database | All dynamic content comes from Google Sheets, read at build/ISR time. Any "write" (lead capture) goes to a Google-hosted endpoint (Google Forms / Apps Script), never to our own server. |
| Google Sheets as CMS | A typed **adapter layer** isolates the rest of the app from the Sheets transport. Sheets can later be swapped for a headless CMS without touching UI. |
| Performance critical, Lighthouse ≥ 90 | **Server Components by default**, static/ISR rendering, near-zero client JS on content routes, image + font optimization, strict performance budgets. |
| Reusable components | Atomic design + Shadcn primitives. Presentational components never fetch data; data is injected via props from server components. |
| Mobile-first | Base styles target ~360px; enhancements layer up via Tailwind breakpoints. |
| Conversion funnel | Explicit TOFU/MOFU/BOFU component tiers, tracked outbound redirects, and no-backend lead capture. |
| Do not break existing functionality | The current World Cup Match Center UI is preserved and refactored into the new component inventory; `lib/data.ts` becomes a fallback fixture, not the source of truth. |

---

## 2. System context (C4 — Level 1)

```
        Organic search / social
                  │
                  ▼
        ┌───────────────────┐      build / ISR fetch      ┌──────────────────────┐
        │  Next.js 15 app    │ ───────────────────────────▶│  Google Sheets (CMS) │
        │  (Vercel/edge CDN) │ ◀───────────── JSON ────────│  published, read-only │
        └───────────────────┘                              └──────────────────────┘
            │            │
   outbound │            │ lead capture (POST)
   redirect │            ▼
            │      ┌───────────────────────┐
            │      │ Google Form / Apps     │   (no backend of ours)
            │      │ Script Web App         │
            ▼      └───────────────────────┘
   ┌──────────────────┐
   │ Affiliate/partner │  (tickets, betting, merch, newsletter)
   └──────────────────┘

   Telemetry: GA4 / Plausible (client beacon) — funnel + Web Vitals
```

The Next.js app is the only thing we deploy. Everything else is a Google-hosted or third-party endpoint.

---

## 3. Rendering & data-flow strategy

### 3.1 Rendering model (per route type)

| Route | Strategy | Why |
|-------|----------|-----|
| `/` (home hub) | **Static + ISR** (`revalidate: 300`) | Content changes only as often as the sheet; cache aggressively. |
| `/news`, `/matches`, `/predictions`, `/standings` (lists) | Static + ISR | Same as above; lists rebuilt on revalidation. |
| `/news/[slug]`, `/matches/[id]`, `/teams/[slug]` (detail) | **SSG via `generateStaticParams`** + ISR fallback (`dynamicParams: true`) | Known slugs pre-rendered at build; new sheet rows render on first request then cache. |
| `/promo/[partner]` (LP2 conversion) | **SSG + ISR** per partner | Conversion-optimized betting landing page (FUN88/JBO), compliance-gated. |
| `/go/[offer]` (conversion redirect) | **Route Handler**, dynamic, 302 | Server-side outbound redirect; attaches affiliate + `click_id` sub-IDs; no HTML payload. |
| `/api/postback` (S2S intake) | **Route Handler**, secret-guarded | Receives partner Registration/FTD postbacks → GA4 MP + Sheet append. |
| Legal/static | Static | Pure static. |

**Default = React Server Components.** Client Components are opt-in (`"use client"`) and limited to the interactivity islands listed in COMPONENT_INVENTORY.md.

### 3.2 Data flow (read path)

```
Google Sheet tab
   → CMS adapter (lib/cms/sheets-client)        // transport: fetch + ISR cache
   → row mapper (lib/cms/mappers)               // raw string[][] → objects
   → Zod schema validation (lib/cms/schemas)    // reject/repair malformed rows
   → repository function (lib/cms/repositories) // getArticles(), getMatches()...
   → Server Component (page / section)          // receives typed, safe data
   → Presentational component (props only)      // renders UI
```

Key rule: **untrusted-input discipline.** Sheet content is third-party data. Every row is validated; malformed rows are skipped and logged, never thrown. HTML/markup in cells is sanitized or rendered as plain text. No cell value is ever passed to `dangerouslySetInnerHTML` without sanitization.

### 3.3 Caching layers

1. **Request memoization** — `React.cache()` wraps repository reads so one render fetches each tab at most once.
2. **Data cache (ISR)** — `fetch(url, { next: { revalidate: 300, tags: ['cms:news'] } })`. Time-based + tag-based.
3. **Full-route cache / CDN** — static HTML served from the edge.
4. **On-demand revalidation (optional)** — a Google Apps Script `onEdit` trigger calls `/api/revalidate?tag=cms:news&secret=…`, a Route Handler calling `revalidateTag`. Lets editors publish instantly without a redeploy. Secret-guarded.

---

## 4. CMS access: chosen approach + alternatives

**Chosen (default): Google Sheets API v4 via REST + API key (read-only).**
- Endpoint: `GET https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{TAB}?key={GOOGLE_SHEETS_API_KEY}`
- Sheet shared as **"Anyone with the link → Viewer"**; API key restricted to the Sheets API + HTTP referrers.
- Returns clean JSON (`values: string[][]`), stable, documented, rate-limit friendly with ISR.

**Documented alternatives (ADR-002 trade-offs):**
| Option | Pro | Con |
|--------|-----|-----|
| `gviz/tq?tqx=out:json` | No API key | Wrapped/JSONP-ish payload, fragile parsing, undocumented |
| Published CSV (`/pub?output=csv`) | Simplest | Requires CSV parsing, "publish to web" exposes whole sheet, no per-tab control |
| `opensheet`-style proxy | JSON, easy | Third-party dependency in the critical path |

The adapter pattern means switching among these is a one-file change (`sheets-client.ts`).

**Secrets:** `GOOGLE_SHEETS_API_KEY`, `SHEET_ID`, `REVALIDATE_SECRET` live in environment variables only (`.env.local`, Vercel env). Never committed. The API key is read-only against a public sheet, so blast radius is minimal even if leaked, but it is still treated as a secret.

---

## 5. Target folder architecture

```
app/
  layout.tsx                  # root: fonts, metadata base, analytics, providers
  page.tsx                    # home hub (server component, composes sections)
  globals.css
  (marketing)/                # route group: content/SEO funnel
    news/
      page.tsx                # list
      [slug]/page.tsx         # article detail (SSG)
    matches/
      page.tsx
      [id]/page.tsx
    predictions/page.tsx
    standings/page.tsx
    teams/[slug]/page.tsx
  promo/
    [partner]/page.tsx        # LP2 conversion layer (fun88 / jbo), compliance-gated
  legal/
    privacy/page.tsx
    terms/page.tsx
    responsible-gambling/page.tsx
  api/
    revalidate/route.ts       # on-demand ISR (secret-guarded)
    postback/route.ts         # partner S2S Registration/FTD intake → GA4 MP + Sheet
  go/[offer]/route.ts         # tracked outbound redirect (affiliate + click_id sub-IDs)
  sitemap.ts                  # dynamic sitemap from CMS
  robots.ts
  opengraph-image.tsx         # dynamic OG images

components/
  ui/                         # Shadcn primitives (button, card, tabs, sheet, badge…)
  layout/                     # SiteHeader, SiteFooter, Container, MobileNav
  sections/                   # Hero, MatchCenter, Standings, NewsGrid, PredictionsBoard, CtaBanner
  cards/                      # MatchCard, NewsCard, PredictionCard, TeamCard, OfferCard
  funnel/                     # StickyCta, OfferRail, OfferGrid, RegistrationCta, PromoHero,
                              # BonusOffer, OddsComparison, OddsWidget, TrustSignals, StepsToClaim,
                              # PartnerCard, AgeGate, ResponsibleGamblingBar, NewsletterInline
  common/                     # SectionHeader, Pill, FlagImage, EmptyState, Skeletons

lib/
  cms/
    sheets-client.ts          # transport + ISR cache
    mappers.ts                # string[][] → raw objects
    schemas.ts                # Zod schemas per entity
    repositories.ts           # getArticles/getMatches/getStandings/getOffers...
    config.ts                 # tab names, ranges, revalidate windows
    fallback/                 # static fixtures (migrated from old lib/data.ts)
  analytics/
    events.ts                 # typed funnel events
    track.ts                  # GA4/Plausible beacon wrapper
  seo/
    metadata.ts               # buildMetadata(), JSON-LD builders
  utils/
    cn.ts                     # Shadcn class merge
    format.ts                 # dates, scores, slugs

content/                      # MDX or static legal copy (optional)
docs/                         # the 5 blueprint docs + PROJECT_STATUS/ARCHITECTURE/TODO
public/                       # static assets, fallback images
```

> Migration note: existing `components/*.tsx` (Hero, MatchCenter, Standings, News, CTA, Footer, TopNavBar, MaterialIcon) are **moved and refactored** into `sections/`, `layout/`, and `cards/`. Existing `lib/data.ts` becomes `lib/cms/fallback/*`. Nothing is deleted until its replacement is verified — preserving current functionality.

---

## 6. Conversion funnel architecture — betting affiliate, two-landing-page model

**Primary goal (confirmed):** drive qualified traffic to betting partners **FUN88** and **JBO**, optimizing for **New User Acquisition → Account Registration → First-Time Deposit (FTD)**.
**Success metrics:** Registration Volume, FTD Volume, **CPA-FTD**, Registration→FTD conversion rate.

### 6.1 Two-surface architecture

| Surface | Role | Routes | Funnel stage |
|---------|------|--------|--------------|
| **LP1 — Information Hub** | Win organic football traffic; build trust & intent; soft hand-off | `/`, `/news/*`, `/matches/*`, `/predictions`, `/standings`, `/teams/*` | TOFU + MOFU |
| **LP2 — Conversion Layer** | Single-minded registration/FTD push per partner: bonus, odds, registration CTA, social proof | `/promo/[partner]` (e.g. `/promo/fun88`, `/promo/jbo`), partner-specific variants | BOFU |

LP1 never hard-sells; its CTAs (StickyCta, contextual offer rails, prediction/odds widgets) route users into the matched **LP2** for that partner/market. LP2 is conversion-optimized: minimal navigation, one primary action, bonus framing, trust signals, fast load.

### 6.2 Conversion path & attribution (no backend)

```
LP1 content → CTA (tracked) → LP2 partner page → "Register" → /go/[offer]
   → 302 to partner registration URL WITH affiliate + sub-id (click_id) params
   → user registers (partner side) → user makes FTD (partner side)
   → partner/network S2S postback → /api/postback (route handler)
   → forward to GA4 Measurement Protocol + append row to a Google Sheet (via Apps Script)
```

- **Click attribution:** every outbound link carries the affiliate ID and a generated **`click_id` / sub-IDs** (partner, placement, campaign, page) so the network can attribute registration & FTD back to the exact source. Generated in `/go/[offer]`.
- **Registration & FTD are tracked partner-side.** We cannot see deposits directly (no DB), so FTD/CPA come from the **affiliate network dashboard**, reconciled by `click_id`.
- **Optional S2S postback intake:** `/api/postback` (secret-guarded route handler) receives partner postbacks and (a) sends a GA4 Measurement-Protocol event and/or (b) appends to a Sheet via Apps Script — giving us first-party Registration/FTD visibility **without owning a backend or DB**.
- **Outbound semantics:** all partner links `rel="sponsored nofollow noopener"`, `target="_blank"`.

### 6.3 Funnel components by stage

| Stage | Components | Source |
|-------|-----------|--------|
| TOFU (LP1) | Hero, NewsGrid, MatchCenter, PredictionsBoard, Standings, SEO/JSON-LD | content tabs |
| MOFU (LP1) | OddsWidget, PredictionCard (with partner odds), StickyCta, contextual `OfferRail`, RelatedRail | `predictions`, `offers`, `partners` |
| BOFU (LP2) | `PromoHero`, `BonusOffer`, `OddsComparison`, `RegistrationCta`, `TrustSignals`, `StepsToClaim`, `PartnerCard` | `partners`, `offers`, `landing_pages` |
| Compliance (all) | `AgeGate` (18+/21+), `ResponsibleGamblingBar`, geo-targeting | `site_config`, `partners` |

### 6.4 Regulatory & compliance guardrails (mandatory for betting)

Betting affiliate marketing is regulated and **must not target minors or prohibited jurisdictions**. The architecture bakes in:
- **Age gate** (18+/21+ per market) before LP2 content, persisted via cookie; configurable threshold in `site_config`.
- **Geo-targeting** — partner offers and LP2 availability gated by allowed markets in `partners.allowed_geos` (edge `geo` from request headers; no IP storage). Disallowed regions see content-only LP1, no betting CTAs.
- **Responsible-gambling** messaging + helpline links (per market) always present near CTAs; "T&Cs apply", odds disclaimers, no guaranteed-win language.
- **No targeting of minors / vulnerable users**; honest odds; affiliate relationship disclosed (`sponsored`).
- These are **content-configurable** so each market's legal copy lives in the Sheet, reviewed by the operator — not hardcoded.

### 6.5 Measurement

`lib/analytics/events.ts` defines typed funnel events: `view_promo`, `view_offer`, `click_cta` (LP1→LP2), `click_register` (→ `/go`), `age_gate_pass`, `scroll_depth`. GA4/Plausible client beacon + `useReportWebVitals`. `click_id` is propagated into events for full-funnel stitching with partner postbacks.

---

## 7. Performance architecture (Lighthouse ≥ 90)

**Budgets (mobile, 4× CPU throttle, Slow 4G):**
| Metric | Budget |
|--------|--------|
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.05 |
| INP | ≤ 200 ms |
| TBT | ≤ 200 ms |
| Initial JS (route) | ≤ 120 KB gzip |
| Total page weight (above fold) | ≤ 500 KB |

**Tactics:**
- Server Components ship **zero JS** for content; client islands are small and lazy (`next/dynamic`, `loading="lazy"`).
- `next/image` for all remote images (flags, news, stadium) with explicit `sizes`, `width/height` to lock CLS; remote hosts whitelisted in `next.config`.
- `next/font` (self-hosted Sora / Hanken Grotesk / JetBrains Mono) with `display: swap` and preconnect — replaces render-blocking Google Font `<link>`s currently in `layout.tsx`.
- **Replace the Material Symbols icon font with `lucide-react`** (tree-shakeable SVGs) — kills a render-blocking font request and ~hundreds of KB.
- ISR + edge caching → TTFB from CDN, not from Sheets.
- Streaming with `<Suspense>` + skeletons so the shell paints before CMS data resolves.
- Tailwind JIT purge → minimal CSS; no runtime CSS-in-JS.
- Per-route bundle analysis in CI (`@next/bundle-analyzer`) gating merges against the budget.

---

## 8. SEO architecture

- Per-route `generateMetadata()` from CMS (title, description, canonical, OG/Twitter).
- **Structured data (JSON-LD):** `NewsArticle`, `SportsEvent`, `SportsTeam`, `BreadcrumbList`, `Organization`.
- Dynamic `app/sitemap.ts` and `app/robots.ts` enumerating CMS slugs.
- Dynamic OG images via `opengraph-image.tsx` (edge runtime).
- Semantic HTML, single `<h1>` per page, descriptive alt text from the CMS, internal-link rails between related entities.

---

## 9. Cross-cutting concerns

| Concern | Approach |
|---------|----------|
| Error handling | `error.tsx` + `not-found.tsx` per segment; repositories return empty arrays + `EmptyState`, never crash on bad CMS data. |
| Resilience | If Sheets fetch fails, serve last-good ISR cache; if cold, serve `lib/cms/fallback/*` fixtures. The site is never blank. |
| Type safety | Zod schemas are the single source of truth; entity TS types are `z.infer`red. `strict: true`, no `any`. |
| Security | Env-only secrets; sheet content treated as untrusted (validated, sanitized); outbound links `rel="sponsored nofollow noopener"`; `/api/revalidate` secret-guarded; no eval of cell content. |
| Accessibility | Shadcn/Radix a11y primitives, focus management in MobileNav/Sheet, color-contrast verified against the existing dark palette. |
| i18n (future) | Folder structure leaves room for `[locale]` route group; out of scope for v1. |

---

## 10. Architecture Decision Records (summary)

- **ADR-001** — Server Components + ISR over client fetching. *Chosen:* SC+ISR for SEO, performance, and to keep the API key server-side.
- **ADR-002** — Sheets API v4 + API key over gviz/CSV. *Chosen:* documented payload, stability; alternatives isolated behind adapter.
- **ADR-003** — `lucide-react` over Material Symbols font. *Chosen:* performance (no render-blocking icon font), tree-shaking, Shadcn alignment.
- **ADR-004** — Betting-affiliate conversion via tracked `/go` redirects + partner S2S postback into GA4/Sheets. *Chosen:* attributes Registration/FTD by `click_id` while satisfying "no backend/DB". Lead/newsletter capture (where used) posts to Google Forms.
- **ADR-007** — Two-landing-page split (LP1 info hub / LP2 conversion). *Chosen:* keeps SEO content clean for organic acquisition while isolating a conversion-optimized, compliance-gated betting surface per partner.
- **ADR-008** — Mandatory age-gate + geo-targeting + responsible-gambling layer. *Chosen:* legal requirement for betting promotion; content-configurable per market via the Sheet.
- **ADR-005** — Tailwind v3 + Shadcn (not Tailwind v4) for v1. *Chosen:* Shadcn maturity and 1:1 reuse of the existing token config.
- **ADR-006** — Repository/adapter pattern for CMS. *Chosen:* swappable data source, testable mappers, untrusted-input boundary.

> Full ADR write-ups are tracked in `docs/adr/` during implementation.

---

## 11. Relationship to companion docs

- **DEVELOPMENT_ROADMAP.md** — phased delivery plan & milestones.
- **GOOGLE_SHEET_SCHEMA.md** — exact CMS tabs, columns, types.
- **COMPONENT_INVENTORY.md** — every component, props, tier, reusability.
- **IMPLEMENTATION_PLAN.md** — ordered, verifiable build steps.
- Living trackers (created at implementation start): `PROJECT_STATUS.md`, `ARCHITECTURE.md`, `TODO.md`.
