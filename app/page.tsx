import { Hero } from "@/components/sections/Hero";
import { FeaturedMatch } from "@/components/sections/FeaturedMatch";
import { LiveMatches } from "@/components/sections/LiveMatches";
import { MatchPredictions } from "@/components/sections/MatchPredictions";
import { Standings } from "@/components/sections/Standings";
import { NewsSection } from "@/components/sections/NewsSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { getLiveMatches } from "@/src/services/live-matches.service";
import { site } from "@/mocks";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: site.name,
  description: site.description,
  sport: "Soccer",
};

export default async function HomePage() {
  const liveMatches = await getLiveMatches();

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD is static, app-controlled content (no user input).
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <FeaturedMatch />
      <LiveMatches matches={liveMatches} />
      <MatchPredictions />
      <Standings />
      <NewsSection />
      <CTABanner />
    </>
  );
}
