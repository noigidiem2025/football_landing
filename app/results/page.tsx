import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ResultsBrowser } from "@/components/results/ResultsBrowser";
import { getRecentResults } from "@/src/services/results.service";

export const metadata: Metadata = {
  title: "Results",
  description:
    "World Cup 2026 results — full-time and half-time scores, goal scorers, cards and full match events. Filter results by league and date.",
  alternates: { canonical: "/results" },
  openGraph: {
    title: "Results | WORLD CUP 2026",
    description:
      "Full-time & half-time scores, goal scorers, cards and match events. Filter by league and date.",
    type: "website",
  },
};

// UI reads local cache only. API-Football quota is consumed exclusively by sync jobs.
export const revalidate = 600;

export default async function ResultsPage() {
  const results = await getRecentResults();

  return (
    <Container className="py-8 sm:py-12">
      <PageHeader
        eyebrowKey="page.results.eyebrow"
        titleKey="page.results.title"
        descKey="page.results.desc"
      />

      <ResultsBrowser results={results} />
    </Container>
  );
}
