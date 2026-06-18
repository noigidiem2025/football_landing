# TODO.md

Landing Page 1 — remaining work. **Last updated:** 2026-06-18

P0 and P1 from the audit are complete (see PROJECT_STATUS.md). Everything below is **P2** unless noted.

## Data — manual real-world updates (no code change; via Google Sheet)
See DATA_STATUS.md for the full breakdown. The portal currently runs on **demo/placeholder**
match data — there are **no verified real WC2026 results yet**.
- [ ] Enter the real **group draw** (A–L) and set team → group mapping + standings.
- [x] Replace raw football fixtures/results Sheet dependency with API-Football file cache.
- [ ] Update **standings** per matchday (`data_status = real`).
- [ ] Replace **knockout** placeholder labels with confirmed teams once known.
- [ ] Replace **draft** predictions/news with real editorial; set `content_status/status = published`.
- [ ] (Optional) Promote the `knockout` placeholder dataset to a CMS tab + UI once confirmed.

## P2 — improvements (post-launch acceptable)
- [ ] Hero: add a CTA that deep-links to a featured prediction detail (currently anchors to sections).
- [x] Results: add match-detail links backed by `/match/[fixtureId]`.
- [x] Fixtures: show real live/FT status from API-Football cache.
- [ ] Dynamic OG images (`opengraph-image.tsx`) for home, news and prediction detail.
- [ ] Replace the low-resolution hero image (`public/hero-stadium.jpg`, 512×286) with a higher-res asset.
- [ ] Hero "slider" (optional) — currently a single featured card + live rail (no carousel).

## Pre-deploy checklist (operational)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production origin (drives canonical/sitemap/robots).
- [ ] (Optional) Set `NEXT_PUBLIC_GA_ID` to enable GA4; verify `page_view`, `cta_click`, `outbound_click`, `scroll_depth` fire.
- [ ] Connect the Google Sheet (`SHEET_ID` + `GOOGLE_SHEETS_API_KEY`) and populate tabs: `news`, `predictions`, `cta`, `vip_tips`.
- [ ] Configure cron for `sync:fixtures`, `sync:live`, `sync:results` and `sync:leagues`.
- [ ] Decide which fixture IDs should run through `sync:match-detail` ahead of traffic.
- [ ] Run a Lighthouse pass on home, `/news`, a news article, `/standings` and confirm ≥ 90.

## Technical debt (track, non-blocking)
- [ ] Shadcn UI is specified in the stack but not used (custom primitives in `components/ui`). Decide: adopt Shadcn or formally accept the deviation.
- [ ] Conversion components are betting-themed with `example.com` placeholders. If real affiliate destinations are used, add age-gate / geo-restriction / responsible-gambling messaging (compliance) — out of Landing 1 scope but required before monetizing.
- [ ] Navigation mixes routes and anchors (`/#predictions`, `/#live-matches`); brittle if section IDs change.
- [ ] No schema validation on live Sheet rows beyond defensive mappers — consider Zod if the sheet grows.

## Done (this pass)
- [x] robots.ts + sitemap.ts
- [x] metadataBase + home canonical
- [x] News section + `/news` + `/news/[slug]` (CMS-backed, long-form, JSON-LD)
- [x] Analytics (page_view, scroll_depth, cta_click, outbound_click) + GA4 loader
- [x] loading.tsx / error.tsx / not-found.tsx
- [x] Fixed dead homepage CTA button (configurable destination)
- [x] Header search entry point + live indicator (+ mobile menu)
- [x] API-Football server cache for fixtures/live/leagues/results/match detail
- [x] `/match/[fixtureId]` detail page
- [x] `/results` reads API-Football cache instead of Google Sheet result rows
- [x] Head To Head on `/match/[fixtureId]` (read-through cache `data/head-to-head/*`, 24h TTL, empty/stale states)
- [x] Fixture card status-based buttons (Prediction / Follow Match / Details) → link to `/match/[fixtureId]`
