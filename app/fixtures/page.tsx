import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { FixturesBrowser } from "@/components/fixtures/FixturesBrowser";
import { FixturesError } from "@/components/fixtures/FixturesError";
import {
  getTodayFixtures,
  getWeekFixtures,
} from "@/src/lib/cache/cache-reader";
import type { FootballMatch } from "@/lib/api-football/types";
import { hcmDate, addDays } from "@/lib/api-football/datetime";

export const metadata: Metadata = {
  title: "Fixtures",
  description:
    "Football fixtures — today, tomorrow and this week. Live schedule from API-Football, times in Asia/Ho_Chi_Minh.",
  alternates: { canonical: "/fixtures" },
  openGraph: {
    title: "Fixtures | WORLD CUP 2026",
    description: "Today, tomorrow and this week's football fixtures.",
    type: "website",
  },
};

// UI reads local cache only. API-Football quota is consumed exclusively by sync jobs.
export const revalidate = 300;

export default async function FixturesPage() {
  let today: FootballMatch[] = [];
  let week: FootballMatch[] = [];
  let failed = false;

  try {
    [today, week] = await Promise.all([getTodayFixtures(), getWeekFixtures()]);
  } catch {
    failed = true;
  }

  const now = new Date();
  const todayDate = hcmDate(now);
  const tomorrowDate = hcmDate(addDays(now, 1));

  return (
    <Container className="py-8 sm:py-12">
      <PageHeader
        eyebrowKey="page.fixtures.eyebrow"
        titleKey="page.fixtures.title"
        descKey="page.fixtures.desc"
      />

      {failed ? (
        <FixturesError />
      ) : (
        <FixturesBrowser
          today={today}
          week={week}
          todayDate={todayDate}
          tomorrowDate={tomorrowDate}
        />
      )}
    </Container>
  );
}
