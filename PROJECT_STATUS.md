# PROJECT_STATUS.md

**Project:** World Cup 2026 — Landing Page 1 (football media portal, traffic acquisition)
**Stack:** Next.js 15 · App Router · TypeScript · TailwindCSS · API-Football cache · Google Sheets CMS (editorial only, no DB)
**Last updated:** 2026-06-18

---

## Current phase: API-Football cache integration

Fixtures, match detail, live matches and recent results now use a server-side
API-Football sync/cache layer. User traffic reads local JSON cache files only.

### Verification gates (all green)
- `tsc --noEmit` → 0 errors
- `next lint` → no warnings or errors
- `next build` → success; routes render with cache-backed fixtures/results/detail

### Routes
`/` · `/news` · `/news/[slug]` · `/fixtures` · `/match/[fixtureId]` · `/results` · `/standings` · `/predictions/[slug]` · `/search` · `/robots.txt` · `/sitemap.xml`

---

## What changed in this pass

### API-Football cache layer (DONE)
- **Sync jobs:** `sync:fixtures`, `sync:live`, `sync:leagues`, `sync:results`, `sync:match-detail`, `sync:all`.
- **Cache files:** fixtures, live matches, leagues, match detail, recent results and sync status under `data/`.
- **Match detail:** `/match/[fixtureId]` reads `data/matches/detail/{fixtureId}.json` first and falls back to existing fixture/live cache.
- **Live matches:** homepage live section and header live indicator read `data/live/matches.json`.
- **Results:** `/results` now reads API-Football cache, not Google Sheet result rows.
- **Observability:** sync runs append status to `logs/sync.log` and `data/metadata/sync-status.json`.

### P0 — launch blockers (DONE)
- **SEO plumbing:** added `app/robots.ts` and dynamic `app/sitemap.ts` (enumerates static routes + all prediction & news slugs).
- **`metadataBase` + canonical:** set `metadataBase` from `NEXT_PUBLIC_SITE_URL` in the root layout; added a home canonical. All canonical/OG URLs now resolve absolutely. (`lib/seo.ts`)
- **News pillar (built, not descoped):** new `news` CMS model + Sheets repository (`lib/cms/news.ts`) with fixture fallback (`mocks/news.ts`); homepage **Latest News** section; `/news` listing; `/news/[slug]` long-form detail with dynamic metadata, canonical, OG and `NewsArticle` JSON-LD. Added News to nav.

### P1 — should-fix (DONE)
- **Tracking:** provider-agnostic `lib/analytics.ts` (`track()` → dataLayer + gtag). `Analytics` component fires `page_view` on route change and loads GA4 when `NEXT_PUBLIC_GA_ID` is set; `ScrollDepthTracker` fires 25/50/75/100% `scroll_depth`. `CtaLink` now emits `cta_click` + `outbound_click`.
- **Resilience UI:** `app/loading.tsx`, `app/error.tsx` (retry boundary), `app/not-found.tsx`.
- **Dead CTA fixed:** homepage `CTABanner` button now links to a configurable destination (`site.cta.href`).
- **Header search + live indicator:** search entry point (`/search` with client-side filtering over news/predictions/fixtures) and a Live indicator pill; both added to the mobile menu.

---

## Checklist status (post-fix)

| Area | Before | After |
|------|--------|-------|
| Header (search, live indicator) | PARTIAL | COMPLETE (cache-backed live indicator) |
| Hero | PARTIAL | PARTIAL (P2: hero→prediction CTA) |
| Match Schedule | PARTIAL | COMPLETE (cache-backed fixtures + detail links) |
| Predictions | COMPLETE | COMPLETE |
| Results | PARTIAL | COMPLETE (cache-backed API-Football results + detail links) |
| Standings | COMPLETE | COMPLETE |
| News / Articles | MISSING | **COMPLETE** |
| Google Sheets CMS (loading/error) | PARTIAL | COMPLETE |
| Conversion components | COMPLETE | COMPLETE |
| SEO (sitemap/robots/canonical) | PARTIAL | **COMPLETE** |
| Mobile UX | COMPLETE | COMPLETE |
| Performance | COMPLETE | COMPLETE |
| Tracking readiness | PARTIAL | COMPLETE |

**Launch readiness:** cache architecture is ready for cron-backed production operation.

---

## Notes / constraints honored
- No database introduced. Google Sheets remains the CMS for editorial/conversion content, not raw football fixtures/results.
- Landing Page 2 not built; conversion CTAs remain configurable placeholders.
- No visual redesign — additions reuse existing components, tokens and patterns.
- Set real values for `NEXT_PUBLIC_SITE_URL` (and optionally `NEXT_PUBLIC_GA_ID`) before production deploy.

---

## Latest: Head To Head (API-Football)

- **Head-to-head** integrated on `/match/[fixtureId]` (section below Match Info / Scoreboard).
- Endpoint `GET /fixtures/headtohead?h2h={home}-{away}` via the existing server-only client.
- On-demand **read-through cache** at `data/head-to-head/{home}-{away}.json`, TTL 24h, stale-on-error, safe empty state (≤ 1 upstream call per pair per day).
- **Fixture card behavior** improved (no redesign): primary button now links to `/match/[fixtureId]` and adapts by status — `Nhận định/Prediction` (scheduled, + reminder), `Theo dõi trận đấu/Follow Match` (live, no reminder), `Chi tiết/Details` (finished, no reminder).
- Bilingual VI/EN labels added; lint + typecheck + build green.
