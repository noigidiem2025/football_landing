import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { StandingsBrowser } from "@/components/standings/StandingsBrowser";
import { leagues } from "@/mocks/leagues";

export const metadata: Metadata = {
  title: "Standings",
  description:
    "Live league standings — ranking table with played, won, drawn, lost, goal difference, points and recent team form. Leaders and relegation zones highlighted.",
  alternates: { canonical: "/standings" },
  openGraph: {
    title: "Standings | WORLD CUP 2026",
    description:
      "League tables with team form, leaders and relegation zones highlighted.",
    type: "website",
  },
};

export default function StandingsPage() {
  return (
    <Container className="py-8 sm:py-12">
      <PageHeader
        eyebrowKey="page.standings.eyebrow"
        titleKey="page.standings.title"
        descKey="page.standings.desc"
      />

      <StandingsBrowser leagues={leagues} />
    </Container>
  );
}
