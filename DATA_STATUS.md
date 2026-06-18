# DATA_STATUS.md

**Project:** World Cup 2026 portal (Landing 1) · **Last updated:** 2026-06-17

> **Important honesty note.** This maintainer does **not** have access to verified
> real-world WC2026 match results, the group draw, or live standings (knowledge
> cutoff predates the tournament; no live data source is connected — Sheets/local
> only). Per the data rules, **no results, draws or standings were invented.**
> Real outcomes must be entered manually via the Google Sheet as matches are played.

---

## ✅ Real data (verifiable, added/kept)
| Data | Where | Notes |
|------|-------|-------|
| 16 host stadiums → city / country / timezone | `mocks/venues.ts` | Official WC2026 venues (announced). |
| Tournament name & structure | types + fixtures/results metadata | "FIFA World Cup 2026", Group Stage → Final. |
| Knockout round names & key venues/dates | `mocks/knockout.ts` | Round of 32 → Final; Final = MetLife, 2026-07-19; 3rd place = Miami, 2026-07-18. |
| Real national teams (identities) | `mocks/teams.ts` | Team names/codes/flags are real nations. Their **group assignment is NOT** (unknown). |

## 🟡 Placeholder data (structurally valid, not real)
| Data | Where | Flag |
|------|-------|------|
| Group-stage fixtures (pairings & dates) | `mocks/fixtures.ts` | `dataStatus: "placeholder"`, `status: "scheduled"` |
| Group standings (home page) | `mocks/standings.ts` | `dataStatus: "placeholder"` |
| League tables (Standings page) | `mocks/leagues.ts` | `dataStatus: "placeholder"` |
| Knockout bracket ties | `mocks/knockout.ts` | `status: "tbd"`, `dataStatus: "placeholder"` |
| Team → group mapping | n/a | left unset (`Team.group?` undefined) |

## 🟠 Demo data (illustrative — must be replaced before claiming "real")
| Data | Where | Flag |
|------|-------|------|
| Finished match scores + scorers/cards/events | `mocks/results.ts` | `dataStatus: "demo"` |
| Home page live/featured match scores | `mocks/matches.ts` | `dataStatus: "demo"` |

## ✍️ Draft content (placeholder copy, not expert claims)
| Data | Where | Flag |
|------|-------|------|
| Prediction listings | `mocks/predictions.ts` | `contentStatus: "draft"` |
| Prediction articles | `mocks/articles.ts` | `contentStatus: "draft"` |
| News articles | `mocks/news.ts` | `status: "draft"` |
| CTA destinations | `mocks/cta.ts` | `example.com` placeholders (configurable) |

---

## 🏆 Knockout matches — all TBD
Every tie in `mocks/knockout.ts` is `status: "tbd"` with placeholder labels
("Winner Group A", "Runner-up Group B", "TBD", "Winner R32-1", "Loser SF-1"…).
Round names, and the Final/Third-place dates & venues, are real; **the teams are not**.

## ✔️ Matches with finished results
**None are real.** All `results.ts` rows are `demo`. There are currently **zero verified
WC2026 finished results** in the data set. Enter real results (with known final scores)
into the `results` sheet tab as matches conclude.

---

## 🔧 Needs manual update (via Google Sheet — no code change required)
1. **Group draw** — real 12-group (A–L) composition; set `Team.group` + standings rows.
2. **Real fixtures** — official schedule (teams, dates, kickoff, venue, match_day) → `predictions`/results inputs.
3. **Real results** — only finished matches with known scores → `results` tab (`data_status = real`).
4. **Real standings** — per group after matchdays → standings (`data_status = real`).
5. **Knockout teams** — replace placeholder labels once the bracket is confirmed.
6. **Editorial content** — real predictions/news; flip `content_status`/`status` to `published`.

## Reference integrity (validated this pass)
- `predictions.slug` == `articles.slug` == `fixtures.predictionSlug` ✅
- `matchId` aligned across predictions ↔ articles (`wc26-bra-ger`, `wc26-arg-fra`, `wc26-esp-ita`) ✅
- `results.matchId` defaults to result `id`; demo results map to predictions where a fixture exists ✅
- Standings rows reference valid `Team` objects; groups/leagues carry `dataStatus` ✅
- All new fields optional → UI does not crash when null (typecheck + build verified) ✅
