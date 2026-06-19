# i18n — Bilingual (VI/EN) module

Self-contained bilingual system used by Landing 1. **Reusable for Landing 2** (or any
new page/app). Default language **Vietnamese**; switch is instant (no reload),
persisted to cookie + localStorage.

## What's in here

| File | Role |
|------|------|
| `LanguageProvider.tsx` | Client context: `lang`, `setLang`, `t`. Hydrates from cookie/localStorage, updates `<html lang>`. |
| `useLanguage.ts` | `useLanguage()` hook → `{ lang, setLang, t }`. |
| `vi.ts` | **Source of truth** dictionary (flat keys). `TranslationKey = keyof typeof vi`. |
| `en.ts` | English dictionary, typed `Record<TranslationKey, string>` → must define every key in `vi` (compile-time enforced). |
| `LanguageSwitcher.tsx` | VI/EN toggle button. |

---

## Scenario A — Landing 2 lives in THIS repo (e.g. a `/promo` route)

The provider already wraps the whole app in `app/layout.tsx`, so **any new route
is already bilingual-ready**. Three steps:

**1. Add keys** to `i18n/vi.ts` then `i18n/en.ts` (same keys, or TS fails):

```ts
// i18n/vi.ts
"landing2.heroTitle": "Tiêu đề Landing 2",
"landing2.cta": "Tham gia ngay",

// i18n/en.ts
"landing2.heroTitle": "Landing 2 headline",
"landing2.cta": "Join now",
```

**2. Use `t()` in a client component:**

```tsx
"use client";
import { useLanguage } from "@/i18n/useLanguage";

export function Landing2Hero() {
  const { t } = useLanguage();
  return (
    <section>
      <h1>{t("landing2.heroTitle")}</h1>
      <button>{t("landing2.cta")}</button>
    </section>
  );
}
```

**3. (Optional) add the switcher** if Landing 2 has its own header:

```tsx
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
// ...
<LanguageSwitcher />
```

> Server Components can't use `t()` (it's a client context). Fetch data on the
> server, pass it to a small client component that renders the labels — exactly
> how `PageHeader`, `FixturesBrowser`, `HeadToHead` etc. do it.

---

## Scenario B — Landing 2 is a SEPARATE Next.js project

1. **Copy** the `i18n/` folder and `lib/utils.ts` (the `cn` helper) into the new project.
2. **Wrap** the root layout and set the default lang:

```tsx
// app/layout.tsx
import { LanguageProvider } from "@/i18n/LanguageProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
```

3. **Add** `<LanguageSwitcher />` to the header.
4. **Translate** text via `t()` in client components; add keys to `vi.ts`/`en.ts`.
5. If the project uses **Tailwind**, keep the `pitch`/`muted`/`line` tokens used by
   `LanguageSwitcher` (or restyle it to the new theme).

---

## Adding a new key (rule)

1. Add to `vi.ts` (source of truth).
2. Add the **same key** to `en.ts` — TypeScript fails the build if a key is missing,
   so the two dictionaries can never drift.
3. Use `t("your.key")`. Unknown keys fall back to VI, then to the key string.

## Data-driven content (important)

`t()` is for **UI labels**. Content that comes from a data source (CMS / API —
e.g. CTA copy, article bodies, team names) is **not** translated by `t()`. For
those, store paired columns/fields `*_vi` / `*_en` and pick by `lang`:

```tsx
const { lang } = useLanguage();
const title = lang === "vi" ? row.title_vi : row.title_en;
```

(API-Football data is English/local only — needs VI overrides if you want VI names.)

## Notes for a conversion / betting Landing 2

Bilingual is orthogonal to compliance. If Landing 2 promotes betting, it still
needs an age-gate, geo-restriction and responsible-gambling messaging — those are
separate from i18n and must be added regardless of language.
