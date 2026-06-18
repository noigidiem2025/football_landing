# GOOGLE_SHEET_SCHEMA.md

> The Google Spreadsheet **is the CMS**. One spreadsheet, many tabs. Each tab = one content collection.
> Row 1 is always a **header row** with the exact machine keys below (lowercase, snake_case). Editors edit values; they must not rename header keys.

**Status:** Blueprint. **Last updated:** 2026-06-16
**Spreadsheet ID:** stored in env as `SHEET_ID` (not committed).
**Access:** "Anyone with link → Viewer". Read-only via Sheets API v4 + API key.

---

## 0. Conventions (apply to every tab)

| Rule | Detail |
|------|--------|
| Header row | Row 1, exact keys as documented. Never reorder-dependent (we map by header name, not column index). |
| Booleans | `TRUE` / `FALSE` (Sheets native) or `1`/`0`. |
| Dates/times | ISO 8601 UTC: `2026-06-16T20:00:00Z`. Display formatting happens in the app. |
| Lists in a cell | Pipe-separated: `brazil|germany`. |
| Slugs | lowercase, kebab-case, unique within a tab. Used in URLs — **immutable once published**. |
| Empty/optional | Blank cell = unset. App applies defaults. |
| Publish flag | `status` column: `draft` rows are ignored in production builds. |
| Order | `order` column (number) controls display order where relevant; ties broken by date. |
| Validation | Every row is Zod-validated. Invalid rows are skipped + logged, never crash the build. |

---

## 1. Tab: `site_config` (key/value singleton)

Global settings. Two columns: `key`, `value`.

| key | example value | used for |
|-----|---------------|----------|
| `site_name` | World Cup 2026 Match Center | header, metadata |
| `site_tagline` | The world's biggest stage | hero/meta |
| `default_meta_description` | Real-time match info… | SEO fallback |
| `primary_cta_label` | Get Tickets | header CTA |
| `primary_cta_offer_id` | tickets-main | links to `offers.id` |
| `social_twitter` / `social_instagram` | url | footer |
| `ga_measurement_id` | G-XXXX | analytics |
| `announcement_text` | (optional) sticky banner copy | promo bar |

---

## 2. Tab: `navigation`

| key | type | required | notes |
|-----|------|----------|-------|
| `label` | string | ✓ | e.g. "Match Center" |
| `href` | string | ✓ | `/matches` |
| `order` | number | ✓ | sort |
| `location` | enum `header\|footer\|both` | ✓ | placement |
| `status` | enum `draft\|published` | ✓ | |

---

## 3. Tab: `teams`

| key | type | required | notes |
|-----|------|----------|-------|
| `id` | string | ✓ | stable key, e.g. `brazil` |
| `slug` | string | ✓ | URL: `/teams/brazil` |
| `name` | string | ✓ | "Brazil" |
| `short_code` | string | ✓ | "BRA" (3-letter) |
| `flag_url` | url | ✓ | flag image |
| `group` | string | – | "Group A" |
| `country` | string | – | |
| `status` | enum | ✓ | |

---

## 4. Tab: `matches`

Drives Hero featured match, MatchCenter scroller, and `/matches/[id]`.

| key | type | required | notes |
|-----|------|----------|-------|
| `id` | string | ✓ | URL key, e.g. `bra-ger-2026-06-16` |
| `group` | string | ✓ | "Group A" |
| `home_team_id` | ref→teams.id | ✓ | |
| `away_team_id` | ref→teams.id | ✓ | |
| `home_score` | number | – | blank if not started |
| `away_score` | number | – | |
| `status` | enum `scheduled\|live\|finished` | ✓ | |
| `kickoff` | datetime | ✓ | ISO UTC |
| `clock` | string | – | "72:35" when live |
| `venue` | string | – | |
| `is_featured` | boolean | – | promotes to Hero card |
| `order` | number | – | scroller order |

> Derived in-app: `Today • 20:00`, `LIVE` pill, `VS` placeholder, score colors. The sheet stores facts, the app stores presentation.

---

## 5. Tab: `standings`

| key | type | required | notes |
|-----|------|----------|-------|
| `group` | string | ✓ | tab filter: "Group A" |
| `position` | number | ✓ | rank |
| `team_id` | ref→teams.id | ✓ | |
| `played` | number | ✓ | P |
| `won` | number | ✓ | W |
| `drawn` | number | ✓ | D |
| `lost` | number | – | L |
| `goal_difference` | string | ✓ | "+3" / "-1" |
| `points` | number | ✓ | PTS |
| `highlight` | boolean | – | green-row emphasis (qualifying) |

---

## 6. Tab: `predictions`

| key | type | required | notes |
|-----|------|----------|-------|
| `id` | string | ✓ | |
| `match_id` | ref→matches.id | ✓ | links the fixture |
| `title` | string | ✓ | "Brazil vs Germany" |
| `meta` | string | ✓ | "Group A • Today 20:00" |
| `home_win_pct` | number | ✓ | 62 |
| `draw_pct` | number | ✓ | 21 |
| `away_win_pct` | number | ✓ | 17 (three should sum ~100) |
| `analysis_url` | string | – | internal/article link |
| `featured` | boolean | – | full bar card vs compact card |
| `order` | number | – | |

---

## 7. Tab: `news` (articles)

Primary SEO/TOFU surface.

| key | type | required | notes |
|-----|------|----------|-------|
| `id` | string | ✓ | |
| `slug` | string | ✓ | `/news/brazil-edge-germany` |
| `title` | string | ✓ | H1 + card title |
| `excerpt` | string | ✓ | card + meta description |
| `body` | long markdown | – | article detail (sanitized on render) |
| `cover_url` | url | ✓ | hero/thumbnail image |
| `cover_alt` | string | ✓ | a11y + SEO |
| `category` | string | – | "Match Report" |
| `author` | string | – | |
| `published_at` | datetime | ✓ | sort + `NewsArticle` JSON-LD |
| `team_ids` | list | – | related-content rails |
| `featured` | boolean | – | home promotion |
| `status` | enum | ✓ | |

---

## 8. Tab: `partners` (betting operators)

Source of truth for the betting affiliates (FUN88, JBO). Drives LP2 pages and compliance gating.

| key | type | required | notes |
|-----|------|----------|-------|
| `id` | string | ✓ | `fun88`, `jbo` → `/promo/[id]` |
| `name` | string | ✓ | "FUN88" |
| `logo_url` | url | ✓ | |
| `register_url` | url | ✓ | base affiliate registration URL (302 target) |
| `affiliate_id` | string | ✓ | appended as affiliate param |
| `tracker_param_map` | string | ✓ | how to attach sub-ids, e.g. `aff_id={affiliate_id}&sub1={click_id}&sub2={placement}` |
| `bonus_headline` | string | ✓ | "100% up to ₹10,000" |
| `bonus_terms` | string | ✓ | T&Cs summary (rendered near CTA) |
| `allowed_geos` | list | ✓ | ISO country codes; LP2 + CTAs hidden elsewhere |
| `min_age` | number | ✓ | 18 / 21 (age-gate threshold) |
| `rating` | number | – | star rating for comparison |
| `priority` | number | ✓ | which partner leads |
| `status` | enum | ✓ | |

## 9. Tab: `offers` (CTA placements → partners)

Powers OfferRail, OfferGrid, StickyCta, RegistrationCta and `/go/[offer]` redirects. Each offer points at a partner.

| key | type | required | notes |
|-----|------|----------|-------|
| `id` | string | ✓ | `/go/[id]`, e.g. `fun88-sticky` |
| `partner_id` | ref→partners.id | ✓ | which operator |
| `title` | string | ✓ | "Bet on Brazil vs Germany" |
| `subtitle` | string | – | supporting copy |
| `cta_label` | string | ✓ | "Claim Bonus" / "Register" |
| `badge` | string | – | "Exclusive", "100% Bonus" |
| `icon` | string | – | lucide icon name |
| `placement` | list | ✓ | `hero\|sticky\|rail\|grid\|promo\|footer` |
| `campaign` | string | – | sub-id for attribution (`sub3`) |
| `priority` | number | – | ordering |
| `status` | enum | ✓ | |

> The `/go/[id]` route reads the offer → its partner → builds the destination from `register_url` + `tracker_param_map`, injecting a generated `click_id`, the `placement`, and `campaign` as sub-IDs for Registration/FTD attribution.

## 10. Tab: `landing_pages` (LP2 conversion config)

One row per `/promo/[partner]` page (and optional campaign variants).

| key | type | required | notes |
|-----|------|----------|-------|
| `slug` | string | ✓ | matches `partners.id` (or `partner-campaign`) |
| `partner_id` | ref→partners.id | ✓ | |
| `hero_headline` | string | ✓ | "Bet on the World Cup with FUN88" |
| `hero_subcopy` | string | – | |
| `hero_image_url` | url | – | |
| `steps_to_claim` | list | – | "Register\|Deposit\|Bet" |
| `trust_signals` | list | – | "Licensed\|Fast Payouts\|24/7 Support" |
| `primary_offer_id` | ref→offers.id | ✓ | main CTA |
| `seo_title` / `seo_description` | string | – | metadata |
| `status` | enum | ✓ | |

## 11. Tab: `cta_blocks` (reusable marketing copy)

| key | type | required | notes |
|-----|------|----------|-------|
| `id` | string | ✓ | |
| `heading` | string | ✓ | "UNLOCK EXCLUSIVE…" |
| `subheading` | string | – | |
| `bullets` | list | – | "Expert Analysis\|Real-time Insights\|Rewards" |
| `offer_id` | ref→offers.id | ✓ | button target (→ partner) |
| `variant` | enum `banner\|inline\|hero\|promo` | ✓ | which section renders it |
| `status` | enum | ✓ | |

## 12. Tab: `compliance` (per-market legal copy)

Powers AgeGate, ResponsibleGamblingBar, and disclaimers. One row per market.

| key | type | required | notes |
|-----|------|----------|-------|
| `geo` | string | ✓ | ISO country code or `default` |
| `min_age` | number | ✓ | 18 / 21 |
| `age_gate_text` | string | ✓ | "You must be 18+ to enter" |
| `responsible_text` | string | ✓ | responsible-gambling line |
| `helpline_label` / `helpline_url` | string | – | per-market support |
| `disclaimer` | string | ✓ | "T&Cs apply. Play responsibly." |
| `is_allowed` | boolean | ✓ | `FALSE` → betting CTAs hidden, LP1 content only |

> `site_config` also gains keys: `age_gate_enabled`, `default_min_age`, `geo_strategy` (`header`/`off`).

---

## 13. Entity relationships

```
teams ──< matches >── teams          (home/away)
matches ──1:1── predictions
teams >──< news (team_ids)
standings >── teams
partners ──< offers ──< cta_blocks
partners ──< landing_pages (LP2)
landing_pages ──1── offers (primary_offer_id)
partners ──< compliance (allowed_geos ↔ geo)
```

---

## 14. Validation & safety contract

- Each tab maps to a Zod schema in `lib/cms/schemas.ts`; the TS type is `z.infer`red (single source of truth).
- Referential integrity (e.g. `home_team_id` exists in `teams`) is checked in the repository layer; orphaned rows are dropped with a build-time warning.
- `body`/`analysis` markdown is sanitized before render (no raw HTML injection from a cell — sheets are untrusted input).
- `draft` rows excluded in production; included in preview deployments.
- Percentages and scores are coerced to numbers; non-numeric → row skipped.

---

## 15. Editor workflow (for the content team)

1. Open the spreadsheet (Viewer link for devs, Editor for content team).
2. Add a row to the relevant tab; fill required columns; set `status = published`.
3. (If on-demand revalidation enabled) the Apps Script `onEdit` trigger pings `/api/revalidate` → live within seconds.
4. Otherwise content appears at the next ISR window (≤ 5 min) — no redeploy needed.

---

# AS-BUILT SCHEMA (Landing 1, implemented)

> The section above is the original blueprint. **This section reflects the tabs the
> app actually reads today** (via `lib/cms/*`), including the columns added in the
> 2026-06-17 data pass. Each tab falls back to a local fixture file when `SHEET_ID`
> is not configured. New columns are **optional** — missing values are handled safely.
> Env tab-name overrides: `SHEET_PREDICTIONS_TAB`, `SHEET_RESULTS_TAB`, `SHEET_NEWS_TAB`,
> `SHEET_CTA_TAB`, `SHEET_VIP_TIPS_TAB`.

## Tab: `predictions` → `lib/cms/articles.ts` (fallback `mocks/articles.ts`)
| key | type | notes |
|-----|------|-------|
| `slug` | string ✓ | URL key `/predictions/[slug]` |
| `match_id` | string | **NEW** — cross-entity match key (e.g. `wc26-bra-ger`) |
| `title`, `excerpt` | string ✓ | |
| `home_team_id`, `away_team_id` | ref→teams | |
| `group`, `tournament`, `round` | string | **`tournament`/`round` NEW** |
| `kickoff_iso`, `kickoff_label`, `venue` | string | |
| `venue_city`, `timezone` | string | **NEW** (real, from venues ref) |
| `status` | enum | `live\|upcoming\|scheduled\|finished\|tbd` (**`scheduled`/`tbd` NEW**) |
| `content_status` | enum | **NEW** `draft\|published` |
| `outcomes`,`stats`,`home_form`,`away_form`,`h2h` | JSON | |
| `predicted_score`,`confidence`,`summary`,`body`,`author`,`published_at`,`related` | string | |

## Tab: `results` → `lib/cms/results.ts` (fallback `mocks/results.ts`)
| key | type | notes |
|-----|------|-------|
| `id` | string ✓ | |
| `match_id` | string | **NEW** — links to a prediction/article |
| `league`, `tournament`, `round` | string | **`tournament`/`round` NEW** |
| `home_team_id`, `away_team_id` | ref→teams | |
| `kickoff_iso`, `venue` | string | |
| `venue_city`, `timezone` | string | **NEW** |
| `ft_home`, `ft_away`, `ht_home`, `ht_away` | number | |
| `winner` | enum | **NEW** `home\|away\|draw` (derived) |
| `result_label` | string | **NEW** e.g. "Brazil win" |
| `events` | JSON | goal/card/sub timeline |
| `data_status` | enum | **NEW** `real\|placeholder\|demo` (fixtures = `demo`) |

> **Only add a `results` row when the final score is real.** Demo rows are flagged `demo`.

## Tab: `news` → `lib/cms/news.ts` (fallback `mocks/news.ts`)
| key | type | notes |
|-----|------|-------|
| `slug`,`title`,`excerpt`,`category`,`author`,`published_at`,`body` | string ✓ | |
| `tags` | pipe-list | |
| `featured` | boolean | |
| `match_id` | string | **NEW**, optional |
| `status` | enum | **NEW** `draft\|published` |
| `cover_url` | url | **NEW**, optional — cover image (else themed gradient). Whitelist host in `next.config`. |
| `cover_alt` | string | **NEW**, optional — alt text |

## Tab: `cta` → `lib/cms/cta.ts` (fallback `mocks/cta.ts`)
Columns: `placement | enabled | title | subtitle | cta_label | href | badge`
(`placement` ∈ `sticky|exit_intent|in_article|floating|sidebar`). Unchanged this pass.

## Tab: `vip_tips` → `lib/cms/cta.ts`
Columns: `match | market | odds | locked`. Unchanged this pass.

## Local-only reference data (no sheet tab)
- **`mocks/venues.ts`** — REAL: 16 official WC2026 stadiums → `city`, `country`, `timezone`.
- **`mocks/knockout.ts`** — PLACEHOLDER knockout bracket. `KnockoutTie` columns:
  `id | round | match_day | date_iso | home_label | away_label | venue | venue_city | status(tbd) | data_status(placeholder)`.
  Teams unconfirmed → label strings ("Winner Group A", "Runner-up Group B", "TBD").
  > A `knockout` sheet tab is **not yet wired**; promote to CMS when the bracket is confirmed.
