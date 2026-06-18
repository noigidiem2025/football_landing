import type { FootballMatch, FootballResult, MatchDetail, RawFixtureItem } from "./types";
import { FIXTURES_TZ, hcmDate, hcmTime } from "./datetime";

/** Map one raw API-Football fixture → the internal `FootballMatch` model. */
export function mapFixture(item: RawFixtureItem): FootballMatch {
  const d = new Date(item.fixture.date);
  return {
    matchId: item.fixture.id,
    leagueId: item.league.id,
    leagueName: item.league.name,
    leagueLogo: item.league.logo,
    season: item.league.season,
    round: item.league.round,
    isoDate: item.fixture.date,
    timestamp: item.fixture.timestamp,
    date: hcmDate(d),
    kickoffTime: hcmTime(d),
    timezone: item.fixture.timezone || FIXTURES_TZ,
    status: item.fixture.status.long,
    statusShort: item.fixture.status.short,
    elapsed: item.fixture.status.elapsed,
    venueName: item.fixture.venue?.name ?? null,
    venueCity: item.fixture.venue?.city ?? null,
    homeTeamId: item.teams.home.id,
    homeTeamName: item.teams.home.name,
    homeTeamLogo: item.teams.home.logo,
    homeWinner: item.teams.home.winner ?? null,
    awayTeamId: item.teams.away.id,
    awayTeamName: item.teams.away.name,
    awayTeamLogo: item.teams.away.logo,
    awayWinner: item.teams.away.winner ?? null,
    homeScore: item.goals.home,
    awayScore: item.goals.away,
    score: {
      halftime: {
        home: item.score?.halftime?.home ?? null,
        away: item.score?.halftime?.away ?? null,
      },
      fulltime: {
        home: item.score?.fulltime?.home ?? null,
        away: item.score?.fulltime?.away ?? null,
      },
    },
  };
}

/** Chronological sort key (`YYYY-MM-DDTHH:mm`). */
export function kickoffKey(m: FootballMatch): string {
  return `${m.date}T${m.kickoffTime}`;
}

export function footballMatchToMatchDetail(match: FootballMatch): MatchDetail {
  return {
    fixtureId: match.matchId,
    leagueId: match.leagueId,
    leagueName: match.leagueName,
    leagueLogo: match.leagueLogo,
    season: match.season,
    round: match.round,
    date: match.isoDate,
    timestamp: match.timestamp,
    timezone: match.timezone,
    status: match.status,
    statusShort: match.statusShort,
    elapsed: match.elapsed,
    venueName: match.venueName,
    venueCity: match.venueCity,
    homeTeamId: match.homeTeamId,
    homeTeamName: match.homeTeamName,
    homeTeamLogo: match.homeTeamLogo,
    homeWinner: match.homeWinner,
    awayTeamId: match.awayTeamId,
    awayTeamName: match.awayTeamName,
    awayTeamLogo: match.awayTeamLogo,
    awayWinner: match.awayWinner,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    halfTimeHomeScore: match.score.halftime.home,
    halfTimeAwayScore: match.score.halftime.away,
    fullTimeHomeScore: match.score.fulltime.home,
    fullTimeAwayScore: match.score.fulltime.away,
  };
}

export function mapFixtureToMatchDetail(item: RawFixtureItem): MatchDetail {
  return footballMatchToMatchDetail(mapFixture(item));
}

export function footballMatchToResult(match: FootballMatch): FootballResult {
  return {
    ...footballMatchToMatchDetail(match),
    localDate: match.date,
    kickoffTime: match.kickoffTime,
  };
}
