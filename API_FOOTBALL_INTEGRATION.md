# API_FOOTBALL_INTEGRATION.md

> API-Football v3 integration uses a server-side file cache. User traffic reads
> local JSON only; API quota is consumed only by explicit sync jobs.

## Architecture

```text
API-Football
  ↓
src/sync/* jobs
  ↓
data/*.json cache files
  ↓
src/services/* readers
  ↓
NextJS UI
```

Never wire UI pages directly to `fetchFixtures()` or `fetchLeagues()`.

## Authentication

```bash
API_FOOTBALL_KEY=your_api_key_here
```

The key is server-only: no `NEXT_PUBLIC_` prefix. It is read by
`lib/api-football/client.ts` and imported only by sync scripts.

## Endpoints

| Integration | Endpoint | Sync job | UI route |
|-------------|----------|----------|----------|
| Fixtures | `GET /fixtures?date=...` | `npm run sync:fixtures` | `/fixtures` |
| Match Detail | `GET /fixtures?id={fixtureId}` | `npm run sync:match-detail -- --fixture=123456` | `/match/[fixtureId]` |
| Live Matches | `GET /fixtures?live=all` | `npm run sync:live` | Header + home live section |
| Results | `GET /fixtures?date=...` | `npm run sync:results` | `/results` |
| Leagues | `GET /leagues?current=true` | `npm run sync:leagues` | cache metadata |

All fixture calls send `timezone=Asia/Ho_Chi_Minh`.

## Cache Files

```text
data/
├── fixtures/
│   ├── today.json
│   ├── tomorrow.json
│   └── week.json
├── live/
│   └── matches.json
├── matches/
│   └── detail/
│       └── {fixtureId}.json
├── results/
│   ├── recent.json
│   └── {date}.json
├── leagues/
│   └── leagues.json
└── metadata/
    └── sync-status.json
```

Cache envelope:

```json
{
  "source": "api-football",
  "generatedAt": "2026-06-17T20:11:46.944Z",
  "ttlSeconds": 21600,
  "records": 192,
  "data": []
}
```

## Data Models

`FootballMatch` is used for schedules/live fixtures. `MatchDetail` is a flat,
dedicated detail type with `fixtureId`, league fields, fixture status, venue,
home/away team fields, goals, halftime score and fulltime score. `FootballResult`
extends that shape with `localDate` and `kickoffTime` for result filtering.

## Cache Strategy

| Data | Refresh target | TTL |
|------|----------------|-----|
| Fixtures | every 6 hours | `21600` |
| Live matches | every 1 minute | `60` |
| Match detail, live | every 1 minute | `60` |
| Match detail, upcoming | hourly | `3600` |
| Match detail, finished | daily | `86400` |
| Results recent | every 6 hours | `21600` |
| Leagues | weekly | `604800` |

If a sync job fails, it logs the failure and does not overwrite the previous
cache. Pages continue serving the last successful cache or an empty state.

## Sync Commands

```bash
npm run sync:fixtures
npm run sync:live
npm run sync:leagues
npm run sync:results
npm run sync:match-detail -- --fixture=1495495
npm run sync:all
```

`sync:all` refreshes leagues, fixtures, live matches and recent results. Match
detail is intentionally fixture-specific and should be run for selected IDs.

## Cron Examples

```cron
0 */6 * * * cd /app && npm run sync:fixtures
* * * * * cd /app && npm run sync:live
0 */6 * * * cd /app && npm run sync:results
0 0 * * 0 cd /app && npm run sync:leagues
```

Match details can be synced on demand from fixture links, admin tooling, or a
future queue:

```bash
npm run sync:match-detail -- --fixture=1495495
```

## Files

| File | Role |
|------|------|
| `lib/api-football/client.ts` | Centralized server-only API-Football client |
| `lib/api-football/mapper.ts` | Raw API-Football fixture mapping |
| `lib/api-football/types.ts` | Raw and normalized football types |
| `src/lib/cache/cache-writer.ts` | JSON read/write helpers |
| `src/lib/cache/cache-reader.ts` | Cache-only reader functions |
| `src/services/match-detail.service.ts` | Cache-only match detail service |
| `src/services/live-matches.service.ts` | Cache-only live service |
| `src/services/results.service.ts` | Cache-only results service |
| `src/sync/sync-fixtures.ts` | Fixtures sync job |
| `src/sync/sync-live.ts` | Live matches sync job |
| `src/sync/sync-leagues.ts` | Leagues sync job |
| `src/sync/sync-match-detail.ts` | Single fixture detail sync job |
| `src/sync/sync-results.ts` | Recent finished results sync job |
| `src/sync/sync-runner.ts` | Aggregate sync runner |
| `logs/sync.log` | Sync observability log |

## Quota Safety

With this architecture, 100,000 user visits produce zero API-Football requests.
Only sync jobs call API-Football; NextJS pages and client components read local
cache files through `src/services/*`.

## Head To Head (on-demand read-through)

Head-to-head is the one **read-through** integration (there is no sync job — team
pairs are unbounded, so it cannot be pre-synced).

| Item | Value |
|------|-------|
| Endpoint | `GET /fixtures/headtohead?h2h={homeTeamId}-{awayTeamId}` (sends `timezone=Asia/Ho_Chi_Minh`) |
| Service | `src/services/head-to-head.service.ts` → `getHeadToHead(homeTeamId, awayTeamId)` |
| Client | reuses `fetchHeadToHead()` in `lib/api-football/client.ts` (server-only key) |
| Cache path | `data/head-to-head/{homeTeamId}-{awayTeamId}.json` |
| TTL | `86400` (24 hours) |
| UI placement | `/match/[fixtureId]` — section **below** Match Info / Scoreboard (`components/match/HeadToHead.tsx`) |

**Cache rules**

1. Fresh cache (< 24h) → served directly, **no API call**.
2. Missing/stale → fetch once, normalize, write cache (best-effort), serve.
3. API fails + stale cache exists → serve stale.
4. API fails + no cache → safe **empty state** (`No head-to-head data available.`).

So user traffic for a given pair triggers **at most one upstream call per 24h**
(further protected by the Next fetch data cache, `revalidate: 86400`). The match
page is `revalidate = 60`, but H2H re-reads the 24h file/data cache, not the API.

**Normalized models:** `HeadToHeadData` (totals + `homeWins`/`awayWins`/`draws`)
and `HeadToHeadMatch` (last 5 meetings).

**Limitations**
- No fabricated data: wins/draws computed only from played meetings (goals present).
- Vietnamese team/league names come from the provider (English/local) — no VI overrides.
- Lineups / odds / standings are **not** part of this integration.
