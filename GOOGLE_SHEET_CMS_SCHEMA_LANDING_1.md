# GOOGLE_SHEET_CMS_SCHEMA_LANDING_1.md

> Google Sheets CMS structure for **Landing Page 1 only** — a bilingual (VI/EN) football media portal for traffic acquisition: information, fixtures, results, standings, predictions and news.
>
> **Scope guards**
> - ✅ Landing 1 only.
> - ❌ No Landing 2 data — **no partner / affiliate / offer / betting-tip data** anywhere in this schema.
> - ❌ No backend, no database — Google Sheets is the only data source.
> - ❌ No invented real match results. ❌ No fabricated football analysis.
> - All sample rows are **SAMPLE ONLY** and use safe provenance flags.

**Status:** Schema design (no website code in this document).
**Last updated:** 2026-06-17

---

## 1. Overview

The CMS is a single Google Spreadsheet with one tab (sheet) per collection. The Next.js frontend reads each tab read-only (ISR-cached), maps rows to typed objects, and renders. There is no write path from the site — editors update the spreadsheet directly.

**Design principles**

1. **Bilingual by paired columns.** Content fields exist as `_vi` and `_en` pairs (e.g. `title_vi`, `title_en`). Pure UI strings live in the `translations` sheet. The frontend picks the column matching the active locale (default **VI**), falling back to the other locale if one is empty.
2. **Provenance is first-class.** Two flag families gate what users see:
   - `data_status` (factual data: matches, standings) → `real | placeholder | draft | needs_review`.
   - `content_status` (editorial: predictions, articles) → `draft | published | needs_review | updating`.
3. **Never invent.** Result/score/standings/analysis fields are blank until a verified value exists. The UI shows a localized "content is being updated" state instead of fabricated data.
4. **Stable IDs.** Every collection has an immutable `*_id` (and a URL `slug` where it has a page). IDs are referenced across sheets (foreign keys).
5. **Header row is the contract.** Row 1 holds the exact machine column names below. Editors must not rename headers or reorder-depend (the frontend maps by header name, not column index).

**Conventions**

| Thing | Rule |
|------|------|
| Booleans | `TRUE` / `FALSE` |
| Dates | `YYYY-MM-DD` (e.g. `2026-06-16`) |
| Times | `HH:mm` 24h (e.g. `20:00`) |
| Timezone | IANA name (e.g. `America/New_York`) or `UTC` |
| Timestamps | ISO 8601 (e.g. `2026-06-17T09:30:00Z`) for `last_updated` |
| Lists in a cell | pipe-separated: `a|b|c` |
| Slugs | lowercase kebab-case, unique per sheet, **immutable once published** |
| Empty optional | leave blank → frontend applies a default |
| Percentages | integer 0–100 |
| Form | up to 5 chars of `W`/`D`/`L`, most recent last, e.g. `WWDLW` |

---

## 2. Sheet list

| # | Sheet | Purpose | Update owner |
|---|-------|---------|--------------|
| 1 | `settings` | Global config (key/value) | Manual |
| 2 | `leagues` | Tournaments / leagues | Manual |
| 3 | `teams` | Teams | Manual |
| 4 | `matches` | Fixtures, live, finished | Manual + AI-assisted import (results verified) |
| 5 | `standings` | Group / league tables | Manual + AI-assisted import (verified) |
| 6 | `predictions` | Prediction cards + detail | Manual / model (never AI-fabricated) |
| 7 | `articles` | News & editorial | Manual (AI may draft → review) |
| 8 | `cta_banners` | Landing-1 CTAs | Manual |
| 9 | `seo` | Per-page SEO metadata | Manual |
| 10 | `translations` | UI strings (VI/EN) | Manual |
| 11 | `sync_log` | Update history | System-generated |
| **A1** | `venues` *(added)* | Normalized stadiums (city/timezone) | Manual |
| **A2** | `navigation` *(added)* | Header/footer menu | Manual |

> Sheets **A1–A2** are proactive additions — see §4.

---

## 3. Detailed schema

Legend: **R** = required, **O** = optional, **FK** = foreign key, *(added)* = beyond the original brief.

### 3.1 `settings`

Global key/value configuration consumed app-wide.

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `key` | string | R | unique, snake_case (e.g. `site_name`) |
| `value` | string | R | the value (string; parse as needed) |
| `description` | string | O | human note for editors |
| `group` *(added)* | string | O | grouping for editors (`brand`, `seo`, `analytics`, `feature_flag`) |
| `is_public` *(added)* | boolean | O | `FALSE` = server-only, never sent to client bundle |

**Sample (SAMPLE ONLY)**

| key | value | description | group | is_public |
|-----|-------|-------------|-------|-----------|
| site_name | WORLD CUP 2026 | Brand name | brand | TRUE |
| default_locale | vi | Default UI language | brand | TRUE |
| ga_measurement_id | G-XXXXXXX | Analytics id | analytics | TRUE |
| revalidate_seconds | 300 | ISR window | feature_flag | FALSE |
| news_enabled | TRUE | Show news section | feature_flag | TRUE |

---

### 3.2 `leagues`

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `league_id` | string | R | PK, immutable (e.g. `wc-2026`) |
| `league_name_vi` | string | R | |
| `league_name_en` | string | R | |
| `country` | string | O | host/region or `International` |
| `logo_url` | url | O | |
| `season` | string | O | e.g. `2026` |
| `active` | boolean | R | show in UI |
| `display_order` | number | R | sort ascending |
| `type` *(added)* | enum | O | `international \| club_league \| cup \| friendly` |
| `short_name_vi` / `short_name_en` *(added)* | string | O | compact labels for chips/tabs |

**Sample (SAMPLE ONLY)**

| league_id | league_name_vi | league_name_en | country | season | active | display_order | type |
|-----------|----------------|----------------|---------|--------|--------|---------------|------|
| wc-2026 | World Cup 2026 | World Cup 2026 | International | 2026 | TRUE | 1 | international |

---

### 3.3 `teams`

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `team_id` | string | R | PK, immutable (e.g. `brazil`) |
| `team_name_vi` | string | R | |
| `team_name_en` | string | R | |
| `short_name` | string | R | 3-letter display code (e.g. `BRA`) |
| `country` | string | O | |
| `flag_url` | url | O | national flag |
| `logo_url` | url | O | crest (clubs) |
| `league_id` | FK→leagues | O | primary competition |
| `active` | boolean | R | |
| `display_order` | number | R | |
| `team_code` *(added)* | string | O | ISO-2 (e.g. `br`) to resolve a flag CDN when `flag_url` blank |
| `is_national` *(added)* | boolean | O | national team vs club |

**Sample (SAMPLE ONLY)**

| team_id | team_name_vi | team_name_en | short_name | country | team_code | league_id | active | display_order |
|---------|--------------|--------------|------------|---------|-----------|-----------|--------|---------------|
| brazil | Brazil | Brazil | BRA | Brazil | br | wc-2026 | TRUE | 1 |
| germany | Đức | Germany | GER | Germany | de | wc-2026 | TRUE | 2 |

---

### 3.4 `matches`

Fixtures, live and completed matches. **The single most provenance-sensitive sheet.**

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `match_id` | string | R | PK, immutable |
| `league_id` | FK→leagues | R | |
| `round` | string | O | e.g. `Group Stage`, `Round of 32`, `Final` |
| `group_name` | string | O | e.g. `Group A` (group stage only) |
| `match_date` | date | R | `YYYY-MM-DD` (blank only if `tbd`) |
| `kickoff_time` | time | O | `HH:mm` |
| `timezone` | tz | O | IANA / `UTC` |
| `home_team_id` | FK→teams | O* | blank when `tbd` |
| `away_team_id` | FK→teams | O* | blank when `tbd` |
| `stadium` | string | O | display name |
| `city` | string | O | display city |
| `status` | enum | R | see below |
| `home_score` | number | O | **only if `finished`/`live` & verified** |
| `away_score` | number | O | same |
| `half_time_home_score` | number | O | same |
| `half_time_away_score` | number | O | same |
| `winner_team_id` | FK→teams | O | only if `finished`; blank on draw |
| `live_minute` | string | O | e.g. `72'` (only if `live`) |
| `is_featured` | boolean | O | hero/featured slot |
| `is_hot_match` | boolean | O | highlight rail |
| `display_order` | number | O | |
| `data_status` | enum | R | `real \| placeholder \| draft \| needs_review` |
| `last_updated` | timestamp | O | ISO 8601 |
| `venue_id` *(added)* | FK→venues | O | normalized venue (preferred over free-text stadium/city) |
| `match_slug` *(added)* | slug | O | for a future match-detail URL |
| `home_placeholder_vi` / `home_placeholder_en` *(added)* | string | O | label when `tbd` (e.g. `Nhất bảng A` / `Winner Group A`) |
| `away_placeholder_vi` / `away_placeholder_en` *(added)* | string | O | label when `tbd` (e.g. `Nhì bảng B` / `Runner-up Group B`) |

**Allowed `status`:** `scheduled` · `live` · `finished` · `postponed` · `cancelled` · `tbd`
**Allowed `data_status`:** `real` · `placeholder` · `draft` · `needs_review`

> **Knockout / unknown teams:** for ties where teams aren't decided, set `status = tbd`, leave `home_team_id`/`away_team_id` blank, and use `home_placeholder_*` / `away_placeholder_*` ("Winner Group A" / "Runner-up Group B"). Keep `round` and date/time if known.

**Sample (SAMPLE ONLY — no real results)**

| match_id | league_id | round | group_name | match_date | kickoff_time | timezone | home_team_id | away_team_id | venue_id | status | home_score | away_score | data_status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| m-sample-001 | wc-2026 | Group Stage | Group A | 2026-06-16 | 20:00 | America/New_York | brazil | germany | metlife | scheduled | _(blank)_ | _(blank)_ | placeholder |
| m-sample-002 | wc-2026 | Round of 32 | _(blank)_ | 2026-06-29 | 18:00 | America/Chicago | _(blank)_ | _(blank)_ | att | tbd | _(blank)_ | _(blank)_ | placeholder |

> `home_placeholder_vi/en` for `m-sample-002`: `Nhất bảng A` / `Winner Group A`, `Nhì bảng B` / `Runner-up Group B`.
> A `finished` row would additionally carry `home_score`, `away_score`, `half_time_*`, `winner_team_id`, `status=finished`, `data_status=real` — **only filled once the match is actually played and verified.**

---

### 3.5 `standings`

One row per team per group/table.

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `standing_id` | string | R | PK (e.g. `wc-2026-A-1`) |
| `league_id` | FK→leagues | R | |
| `group_name` | string | O | group/table label |
| `position` | number | R | rank |
| `team_id` | FK→teams | R | |
| `played` | number | R | |
| `won` | number | R | |
| `draw` | number | R | |
| `lost` | number | R | |
| `goals_for` | number | R | |
| `goals_against` | number | R | |
| `goal_difference` | number | R | may be derived (`gf - ga`) |
| `points` | number | R | |
| `form` | string | O | last-5 `W/D/L`, e.g. `WWDLW` |
| `data_status` | enum | R | `real \| placeholder \| draft \| needs_review` |
| `last_updated` | timestamp | O | |
| `qualified_zone_vi` / `qualified_zone_en` *(added)* | string | O | zone label (e.g. `Đi tiếp` / `Advances`, `Xuống hạng` / `Relegation`) |

**Sample (SAMPLE ONLY — placeholder, all zeros)**

| standing_id | league_id | group_name | position | team_id | played | won | draw | lost | goals_for | goals_against | goal_difference | points | form | data_status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s-sample-A-1 | wc-2026 | Group A | 1 | brazil | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | _(blank)_ | placeholder |

---

### 3.6 `predictions`

Prediction cards + detail page content. **No fabricated analysis** — `content_*` stays in the `updating` state until verified content exists.

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `prediction_id` | string | R | PK |
| `match_id` | FK→matches | R | the fixture |
| `slug` | slug | R | URL `/predictions/[slug]`, unique, immutable |
| `title_vi` / `title_en` | string | R | |
| `summary_vi` / `summary_en` | string | O | short card line (no claims/hype) |
| `home_win_rate` | number | O | 0–100 (from a model; blank if none) |
| `draw_rate` | number | O | 0–100 |
| `away_win_rate` | number | O | 0–100 (the three should sum ≈ 100) |
| `suggested_tip_vi` / `suggested_tip_en` | string | O | neutral tip; **not betting/affiliate copy** |
| `content_vi` / `content_en` | long text | O | markdown-ish (`## ` headings); blank → "updating" |
| `content_status` | enum | R | `draft \| published \| needs_review \| updating` |
| `published` | boolean | R | gate for production |
| `display_order` | number | O | |
| `last_updated` | timestamp | O | |
| `confidence` *(added)* | number | O | 0–100, only from a model — never invented |

**Allowed `content_status`:** `draft` · `published` · `needs_review` · `updating`

**Sample (SAMPLE ONLY — no fake analysis)**

| prediction_id | match_id | slug | title_vi | title_en | home_win_rate | draw_rate | away_win_rate | content_vi | content_en | content_status | published |
|---|---|---|---|---|---|---|---|---|---|---|---|
| p-sample-001 | m-sample-001 | brazil-vs-germany | Brazil vs Germany | Brazil vs Germany | _(blank)_ | _(blank)_ | _(blank)_ | Nội dung nhận định đang được cập nhật. | Prediction content is being updated. | updating | FALSE |

---

### 3.7 `articles`

Football news & editorial.

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `article_id` | string | R | PK |
| `slug` | slug | R | URL `/news/[slug]`, unique, immutable |
| `title_vi` / `title_en` | string | R | |
| `summary_vi` / `summary_en` | string | O | excerpt / meta description |
| `content_vi` / `content_en` | long text | O | markdown-ish body |
| `thumbnail_url` | url | O | cover image (whitelist host) |
| `category` | string | O | e.g. `Thể thức`, `Lịch thi đấu` |
| `league_id` | FK→leagues | O | related |
| `match_id` | FK→matches | O | related |
| `author` | string | O | |
| `published` | boolean | R | |
| `publish_date` | date | O | sort + JSON-LD |
| `display_order` | number | O | |
| `content_status` | enum | R | `draft \| published \| needs_review \| updating` |
| `last_updated` | timestamp | O | |
| `cover_alt_vi` / `cover_alt_en` *(added)* | string | O | image alt (a11y + SEO) |
| `tags` *(added)* | list | O | pipe-separated |
| `is_featured` *(added)* | boolean | O | homepage promotion |
| `reading_minutes` *(added)* | number | O | optional UX label |

**Sample (SAMPLE ONLY — factual/evergreen, mark draft)**

| article_id | slug | title_vi | title_en | summary_vi | thumbnail_url | category | published | content_status |
|---|---|---|---|---|---|---|---|---|
| a-sample-001 | world-cup-2026-48-doi | World Cup 2026: lần đầu 48 đội | World Cup 2026: first with 48 teams | Giải mở rộng từ 32 lên 48 đội, 12 bảng, 104 trận. | /images/news-stadium.jpg | Thể thức | TRUE | published |

> Body uses only **verifiable, evergreen tournament facts** (format, hosts, venues, schedule). No fabricated match reports, quotes or "expert" commentary.

---

### 3.8 `cta_banners`

Landing-1 CTAs only. **No affiliate/partner/offer/betting content** (that is Landing 2 and excluded).

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `banner_id` | string | R | PK |
| `location` | enum | R | placement (below) |
| `title_vi` / `title_en` | string | R | |
| `subtitle_vi` / `subtitle_en` | string | O | |
| `button_text_vi` / `button_text_en` | string | R | |
| `button_url` | string | R | internal path (`/news`) or vetted external |
| `image_url` | url | O | |
| `active` | boolean | R | |
| `display_order` | number | O | |
| `tracking_key` | string | O | analytics event key |
| `start_date` / `end_date` *(added)* | date | O | optional scheduling window |
| `target` *(added)* | enum | O | `_self \| _blank` (external → `_blank`) |

**Allowed `location`:** `home_hero` · `home_middle` · `home_bottom` · `prediction_detail_middle` · `prediction_detail_bottom` · `sticky_mobile` · `popup_exit`

**Sample (SAMPLE ONLY — content CTA, not affiliate)**

| banner_id | location | title_vi | title_en | button_text_vi | button_text_en | button_url | active |
|---|---|---|---|---|---|---|---|
| cta-sample-001 | home_bottom | Cập nhật tin World Cup mới nhất | Latest World Cup news | Xem tin tức | View news | /news | TRUE |

---

### 3.9 `seo`

Per-page SEO metadata; bilingual.

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `page_key` | string | R | PK (e.g. `home`, `fixtures`, `news`) |
| `title_vi` / `title_en` | string | R | `<title>` |
| `description_vi` / `description_en` | string | R | meta description |
| `og_image_url` | url | O | social share image |
| `canonical_url` | url | O | absolute canonical |
| `noindex` | boolean | O | `TRUE` → exclude from indexing |
| `keywords_vi` / `keywords_en` *(added)* | list | O | pipe-separated |
| `og_type` *(added)* | string | O | `website` / `article` |

**Sample (SAMPLE ONLY)**

| page_key | title_vi | title_en | description_vi | description_en | noindex |
|---|---|---|---|---|---|
| home | World Cup 2026 — Trung tâm trận đấu | World Cup 2026 — Match Center | Tỷ số, lịch đấu, nhận định và BXH World Cup 2026. | Scores, fixtures, predictions and standings. | FALSE |

---

### 3.10 `translations`

UI string catalog. Keys are namespaced (`area.key`) and mirror the frontend dictionary.

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `key` | string | R | unique, namespaced (e.g. `nav.fixtures`) |
| `vi` | string | R | Vietnamese (default) |
| `en` | string | O | English (falls back to `vi` if blank) |
| `description` | string | O | context for translators |

**Sample (SAMPLE ONLY)**

| key | vi | en | description |
|---|---|---|---|
| nav.fixtures | Lịch đấu | Fixtures | Header nav |
| status.live | Đang diễn ra | Live | Match status |
| common.contentUpdating | Nội dung đang được cập nhật. | Content is being updated. | Empty state |

---

### 3.11 `sync_log`

System-generated audit of data updates (never hand-edited content).

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `sync_id` | string | R | PK |
| `sync_type` | enum | R | `manual \| import \| ai_assist \| revalidate` |
| `source` | string | O | editor name / script / source |
| `status` | enum | R | `success \| partial \| failed` |
| `message` | string | O | summary |
| `records_updated` | number | O | |
| `started_at` | timestamp | R | ISO 8601 |
| `finished_at` | timestamp | O | ISO 8601 |

**Sample (SAMPLE ONLY)**

| sync_id | sync_type | source | status | message | records_updated | started_at | finished_at |
|---|---|---|---|---|---|---|---|
| log-0001 | manual | editor:lan | success | Seeded leagues/teams | 18 | 2026-06-17T09:00:00Z | 2026-06-17T09:05:00Z |

---

### A1. `venues` *(added)*

Normalized stadiums so `matches` can reference one source of truth for city/timezone (the frontend already has a venue registry).

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `venue_id` | string | R | PK (e.g. `metlife`) |
| `name` | string | R | stadium name |
| `city` | string | R | |
| `country` | string | R | |
| `timezone` | tz | R | IANA |
| `capacity` | number | O | |
| `image_url` | url | O | |

**Sample (SAMPLE ONLY — real public venue facts)**

| venue_id | name | city | country | timezone |
|---|---|---|---|---|
| metlife | MetLife Stadium | East Rutherford, NJ | USA | America/New_York |
| azteca | Estadio Azteca | Mexico City | Mexico | America/Mexico_City |

---

### A2. `navigation` *(added)*

Header/footer menu items (driven from CMS so menus are editable). Labels resolve via `translations` keys to stay bilingual.

| Column | Type | R/O | Notes |
|--------|------|-----|-------|
| `nav_id` | string | R | PK |
| `label_key` | FK→translations.key | R | bilingual label |
| `href` | string | R | route (e.g. `/fixtures`) |
| `location` | enum | R | `header \| footer \| both` |
| `display_order` | number | R | |
| `active` | boolean | R | |

**Sample (SAMPLE ONLY)**

| nav_id | label_key | href | location | display_order | active |
|---|---|---|---|---|---|
| nav-001 | nav.news | /news | header | 1 | TRUE |
| nav-002 | nav.fixtures | /fixtures | header | 2 | TRUE |

---

## 4. Proactive additions (beyond the brief)

| Addition | Why |
|----------|-----|
| `venues` sheet + `matches.venue_id` | Normalize stadium/city/timezone (avoids typos, powers correct kickoff timezones). `stadium`/`city` kept as free-text fallback. |
| `matches.home_placeholder_*` / `away_placeholder_*` | The brief allows `status=tbd` but had no way to label unknown knockout teams ("Winner Group A"). |
| `matches.match_slug` | Reserves a future match-detail URL without schema churn. |
| `articles.cover_alt_*`, `tags`, `is_featured`, `reading_minutes` | Accessibility/SEO (alt text), discovery (tags), homepage promotion. The frontend already uses cover + alt. |
| `seo.keywords_*`, `og_type` | Complete the metadata surface. |
| `settings.group`, `is_public` | Editor organization + **security**: keep server-only config out of the client. |
| `leagues.type/short_name_*`, `teams.team_code/is_national` | Filtering + flag resolution + compact labels. |
| `cta_banners.start_date/end_date/target` | Optional scheduling + safe external-link target. |
| `standings.qualified_zone_*` | Localized zone labels (advance/relegation) instead of hardcoding in code. |
| `navigation` sheet | Editable bilingual menus. |
| `predictions.confidence` | Model output slot (must be verified, never invented). |

---

## 5. Relationships

```
settings        (standalone)
translations    (standalone) ←─ navigation.label_key
seo             (standalone, keyed by page_key)
sync_log        (standalone, system)
venues  ─1──*─ matches.venue_id

leagues ─1──*─ teams.league_id
leagues ─1──*─ matches.league_id
leagues ─1──*─ standings.league_id
leagues ─0..1─ articles.league_id

teams   ─1──*─ matches.home_team_id / away_team_id / winner_team_id
teams   ─1──*─ standings.team_id

matches ─1──1─ predictions.match_id
matches ─0..1─ articles.match_id

cta_banners (standalone, placed by location)
```

**Referential integrity (checked at map time):** every FK must resolve to an existing row; rows with broken FKs are dropped with a build-time warning (never crash the page).

---

## 6. Validation rules

**Global**
- Row 1 must contain the exact header names; do not rename/reorder-depend.
- `*_id` and `slug`: unique within the sheet, non-empty, immutable once referenced/published.
- Booleans strictly `TRUE`/`FALSE`; enums strictly from the allowed set (else row treated as `needs_review` / skipped).
- `last_updated` set on every edit (or by script).
- Bilingual: `*_vi` required where marked R; `*_en` optional → frontend falls back to `*_vi`.

**Per-sheet**
- **leagues/teams:** `active` + `display_order` required; `team.short_name` ≤ 4 chars; `team_code` ISO-2 if present.
- **matches:**
  - `status ∈ {scheduled, live, finished, postponed, cancelled, tbd}`.
  - If `status = tbd` → team IDs may be blank but `home_placeholder_*`/`away_placeholder_*` should be set.
  - If `status = scheduled` → team IDs required; scores **must be blank**.
  - If `status = finished` → scores required, `home_score`/`away_score` integers ≥ 0; `winner_team_id` = side with higher score or blank on draw; `data_status` should be `real`.
  - If `status = live` → `live_minute` recommended; scores allowed.
  - `match_date` required unless `tbd`; `kickoff_time` `HH:mm`; `timezone` valid IANA.
  - `data_status ∈ {real, placeholder, draft, needs_review}`.
- **standings:** integers ≥ 0; `goal_difference = goals_for − goals_against`; `points` consistent with `won`/`draw` (3·W + D) — flag mismatch as `needs_review`; `position` unique within (`league_id`,`group_name`); `form` matches `^[WDL]{0,5}$`.
- **predictions:** `slug` unique; rates 0–100 and `home+draw+away ≈ 100` (±2) when all present; `content_status ∈ {draft, published, needs_review, updating}`; `published = TRUE` only when `content_status = published`.
- **articles:** `slug` unique; `thumbnail_url` valid https + whitelisted host; `content_status` enum; `published = TRUE` only when content verified.
- **cta_banners:** `location` in allowed set; `button_url` internal path or vetted https; **must not contain affiliate/partner/offer URLs**.
- **seo:** one row per `page_key`; `title`/`description` present; `canonical_url` absolute.
- **venues:** `timezone` valid IANA.
- **sync_log:** `status ∈ {success, partial, failed}`; timestamps ISO 8601.

---

## 7. Sample rows

Each sheet above includes a **SAMPLE ONLY** block. Rules honored throughout:
- ❌ No invented real results — sample matches are `scheduled`/`tbd` with blank scores; standings are `placeholder` zeros.
- ❌ No fabricated analysis — sample predictions are `content_status = updating` with the localized "being updated" text.
- ❌ No Landing-2/affiliate data — sample CTA points to `/news`.
- ✅ Sample articles use only verifiable evergreen tournament facts.

Delete all sample rows before launch (or keep clearly-flagged seed rows with `data_status = placeholder` / `content_status = draft`).

---

## 8. Update workflow

**`data_status` lifecycle (factual data):**
```
placeholder ──(editor enters real values)──▶ needs_review ──(verified)──▶ real
                                              │
                                              └──(import script)──▶ needs_review
```
**`content_status` lifecycle (editorial):**
```
updating ──▶ draft ──▶ needs_review ──▶ published
   ▲                                       │
   └───────────(unpublish / revise)────────┘
```

**Editor flow**
1. Open the spreadsheet (Viewer for devs, Editor for content team).
2. Add/update a row; fill required columns; set the right `status`/`data_status`/`content_status`.
3. Set `published`/`active = TRUE` only when verified.
4. Update `last_updated`.
5. Append a `sync_log` entry (or let a script do it).
6. Content appears at the next ISR window (≤ `revalidate_seconds`), or instantly if on-demand revalidation is wired (optional, secret-guarded).

**Who updates what**
- **Manual:** settings, leagues, teams, venues, navigation, translations, seo, cta_banners, predictions, articles.
- **Manual + AI-assisted import (verified):** matches schedule/metadata, standings — an import script may pre-fill from an official source, but lands in `needs_review` until a human verifies.
- **System:** sync_log.

---

## 9. AI update rules

**AI MAY** (always landing in `needs_review` / `draft`, never auto-published):
- Pre-fill **schedule/metadata** in `matches` (date, kickoff, venue, round, group) from an official source.
- Pre-fill **fixture skeletons** and `tbd` knockout placeholders.
- **Draft** article prose from verified facts (format/venues/schedule) → `content_status = draft`.
- Suggest `translations` for missing `en` strings.

**AI MUST NEVER generate without verification** (hard list):
- `matches.home_score`, `away_score`, `half_time_home_score`, `half_time_away_score`, `winner_team_id`, `live_minute`, and any `status = finished`/`live`.
- `standings.played/won/draw/lost/goals_for/goals_against/goal_difference/points/form`.
- `predictions.home_win_rate/draw_rate/away_win_rate/suggested_tip_*/content_*/confidence` (no fabricated analysis or odds-like claims).
- Any factual claim in `articles.content_*` not backed by a verifiable source (no fake quotes, fake stats, fake match reports).

If a value is unknown: **leave it blank** and set the appropriate `updating`/`placeholder` flag — the UI renders "content is being updated", never invented data.

---

## 10. Frontend consumption rules

**Transport & cache (no backend)**
- Server Components read each tab read-only via the Google Sheets API v4 values endpoint (read-only key) with ISR (`revalidate` from settings). `React.cache()` de-dupes per render.
- On fetch failure or unconfigured sheet → fall back to bundled fixtures so the site never blanks.
- Rows are mapped by header name → typed objects; invalid rows are skipped (defensive), never crash.

**Locale selection (bilingual)**
- UI chrome strings come from `translations` (or the bundled dictionary), chosen by the active language (default **VI**), switchable client-side without reload.
- Content fields pick `*_vi` or `*_en` by active locale; if the chosen one is blank, fall back to the other.

**Provenance filtering (production)**
- Show only `published = TRUE` (predictions/articles) and `data_status = real` (matches results/standings).
- `placeholder`/`draft`/`updating`/`needs_review` → render the localized **"content is being updated"** state or hide, depending on surface. Never display unverified values as fact.

**Page → sheet map**
| Page | Reads |
|------|-------|
| Home `/` | settings, seo(home), matches(featured/live/upcoming), predictions(cards), standings(preview), articles(latest), cta_banners(home_*) |
| Fixtures `/fixtures` | matches(scheduled/tbd), leagues, teams, venues, seo |
| Results `/results` | matches(finished), leagues, teams, venues, seo |
| Standings `/standings` | standings, leagues, teams, seo |
| Predictions `/predictions/[slug]` | predictions, matches, teams, articles(related), cta_banners(prediction_detail_*), seo |
| News `/news`, `/news/[slug]` | articles, leagues/matches(related), seo |
| Global chrome | translations, navigation, settings, cta_banners(sticky_mobile/popup_exit) |

---

## 11. Launch checklist

**Data**
- [ ] `settings` filled (site name, default_locale=`vi`, analytics, feature flags); `is_public` correct.
- [ ] `leagues`, `teams`, `venues` seeded with real, verified reference data.
- [ ] `matches`: real schedule entered as `scheduled`; knockout ties as `tbd` with placeholders; **no scores** until played.
- [ ] `standings`: `placeholder` until the competition starts; flip to `real` only when verified.
- [ ] `predictions`/`articles`: `updating`/`draft` until verified; no fabricated analysis.
- [ ] All sample rows removed or flagged `placeholder`/`draft`.

**Bilingual**
- [ ] `translations` complete (VI required, EN recommended).
- [ ] Every published content row has `*_vi` (and ideally `*_en`).
- [ ] `seo` rows for every page in both languages.

**Integrity**
- [ ] No broken FKs (every `*_id` resolves).
- [ ] Enum values valid; booleans `TRUE`/`FALSE`; dates/times/timezones valid.
- [ ] Slugs unique and final.

**Safety / scope**
- [ ] No partner / affiliate / offer / betting data anywhere (Landing-2 excluded).
- [ ] No unverified results/standings/analysis published.
- [ ] `cta_banners.button_url` are internal or vetted; external use `target=_blank`.

**Ops**
- [ ] Sheet shared "Anyone with link → Viewer"; read-only API key restricted to the Sheets API.
- [ ] Image hosts whitelisted in the frontend image config.
- [ ] `sync_log` seeded; revalidation window confirmed.
