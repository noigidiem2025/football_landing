import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MatchDetailError } from "@/components/match/MatchDetailError";
import { MatchDetailView } from "@/components/match/MatchDetailView";
import { HeadToHead } from "@/components/match/HeadToHead";
import { getMatchDetail } from "@/src/services/match-detail.service";
import { getHeadToHead } from "@/src/services/head-to-head.service";

interface Props {
  params: Promise<{ fixtureId: string }>;
}

export const revalidate = 60;

function parseFixtureId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { fixtureId } = await params;
  const id = parseFixtureId(fixtureId);
  if (!id) {
    return {
      title: "Match not found",
      description: "Match not found.",
    };
  }

  try {
    const match = await getMatchDetail(id);
    if (!match) {
      return {
        title: "Match not found",
        description: "Match not found.",
      };
    }

    const title = `${match.homeTeamName} vs ${match.awayTeamName} - ${match.leagueName}`;
    const description = `${match.round} · ${match.season} · ${match.venueName ?? "TBD"}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Match detail",
      description: "Unable to load match information.",
    };
  }
}

export default async function MatchDetailPage({ params }: Props) {
  const { fixtureId } = await params;
  const id = parseFixtureId(fixtureId);

  if (!id) {
    return (
      <Container className="py-8 sm:py-12">
        <MatchDetailError type="not-found" />
      </Container>
    );
  }

  try {
    const match = await getMatchDetail(id);

    if (!match) {
      return (
        <Container className="py-8 sm:py-12">
          <MatchDetailError type="not-found" />
        </Container>
      );
    }

    // H2H is resilient: the service returns an empty (safe) shape on failure,
    // so a head-to-head error never breaks the match detail page.
    const h2h = await getHeadToHead(match.homeTeamId, match.awayTeamId);

    return (
      <Container className="py-8 sm:py-12">
        <MatchDetailView match={match} />
        <HeadToHead
          data={h2h}
          homeTeamName={match.homeTeamName}
          awayTeamName={match.awayTeamName}
          className="mt-8 sm:mt-10"
        />
      </Container>
    );
  } catch {
    return (
      <Container className="py-8 sm:py-12">
        <MatchDetailError type="load-error" />
      </Container>
    );
  }
}
