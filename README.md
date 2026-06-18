# World Cup 2026 — Match Center

A production-ready, mobile-first **Next.js 15 (App Router)** football portal with a dark
World-Cup theme. Fully static, **no backend** — all content comes from local mock files.

## Stack
- Next.js 15 · App Router · React 19
- TypeScript (strict)
- TailwindCSS 3 (custom dark sports theme)
- `lucide-react` icons · `next/font` · `next/image`

## Sections (all componentized)
1. **Header** — sticky, mobile hamburger menu (`components/layout/Header.tsx`)
2. **Hero** — gradient/pitch backdrop, text LCP (`components/sections/Hero.tsx`)
3. **Featured Match** — highlighted live fixture (`components/sections/FeaturedMatch.tsx`)
4. **Live Matches** — snap rail → responsive grid (`components/sections/LiveMatches.tsx`)
5. **Match Predictions** — probability bars (`components/sections/MatchPredictions.tsx`)
6. **Tournament Standings** — group tabs (`components/sections/Standings.tsx`)
7. **CTA Banner** — conversion block (`components/sections/CTABanner.tsx`)
8. **Footer** — link columns + socials (`components/layout/Footer.tsx`)

## Data (mock, local)
```
mocks/
  teams.ts        # team registry (name, code, flag ISO)
  matches.ts      # featured + live/upcoming fixtures
  predictions.ts  # win/draw/win probabilities
  standings.ts    # groups A–D
  site.ts         # brand, nav, hero, CTA, footer copy
  index.ts        # barrel
lib/types.ts      # shared domain types
```
Swap any mock file for a real source later without touching components.

## Structure
```
app/            layout (Header/Footer/fonts/SEO), page (composes sections), globals.css
components/
  layout/       Header, Footer
  sections/     the 8 content sections
  cards/        MatchCard, PredictionCard, PredictionBar
  ui/           Container, Button, Flag, StatusBadge, SectionHeading
```

## Performance (Lighthouse ≥ 90)
- Server Components by default; only `Header` and `Standings` (tabs) ship client JS.
- Home route ≈ 115 KB First Load JS, statically prerendered.
- No render-blocking icon/font requests (`lucide-react` SVGs + `next/font`).
- Hero LCP is text on a CSS gradient — no large hero image.
- Flags via `next/image` (flagcdn), fixed dimensions → no CLS, lazy-loaded.

## Scripts
```bash
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```
