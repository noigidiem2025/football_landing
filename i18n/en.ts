import type { Dictionary } from "./vi";

/** English dictionary. Must define every key in `vi` (enforced by `Dictionary`). */
export const en: Dictionary = {
  // Navigation
  "nav.home": "Home",
  "nav.predictions": "Predictions",
  "nav.fixtures": "Fixtures",
  "nav.results": "Results",
  "nav.standings": "Standings",
  "nav.news": "News",

  // Header
  "header.search": "Search",
  "header.live": "Live",
  "header.liveScores": "Live scores",
  "header.openMenu": "Open menu",
  "header.closeMenu": "Close menu",
  "header.home": "Home",

  // Status
  "status.live": "Live",
  "status.upcoming": "Upcoming",
  "status.scheduled": "Scheduled",
  "status.finished": "Finished",
  "status.tbd": "TBD",
  "status.fullTime": "Full time",
  "status.inPlay": "In play",

  // Common
  "common.vs": "vs",
  "common.viewAll": "View all",
  "common.viewPrediction": "View Prediction",
  "common.viewDetails": "View Details",
  "common.readPrediction": "Read prediction",
  "common.read": "Read",
  "common.details": "Details",
  "common.backHome": "Back home",
  "common.tryAgain": "Try again",
  "common.loading": "Loading…",
  "common.contentUpdating": "Content is being updated.",
  "common.predictionUpdating": "Prediction content is being updated.",

  // Buttons / CTA
  "cta.getFreeVipTips": "Get Free VIP Tips",
  "cta.openMatchCenter": "Open Match Center",
  "cta.viewLiveMatches": "View Live Matches",
  "cta.tournamentStandings": "Tournament Standings",
  "cta.getStarted": "Get Started",
  "cta.reminder": "Reminder",
  "cta.prediction": "Prediction",
  "cta.followMatch": "Follow Match",
  "cta.claimNow": "Claim now",

  // Filters
  "filter.today": "Today",
  "filter.tomorrow": "Tomorrow",
  "filter.thisWeek": "This Week",
  "filter.allLeagues": "All leagues",
  "filter.allStatuses": "All statuses",
  "filter.allDates": "All dates",
  "filter.clear": "Clear",
  "filter.league": "League",
  "filter.status": "Status",
  "filter.date": "Date",
  "filter.match": "match",
  "filter.matches": "matches",
  "filter.result": "result",
  "filter.results": "results",

  // Hero
  "hero.eyebrow": "The world's biggest stage",
  "hero.subtitle":
    "Real-time scores, in-depth analysis and predictions — everything you need for the ultimate World Cup experience.",
  "hero.statTeams": "Teams",
  "hero.statMatches": "Matches",
  "hero.statCities": "Host Cities",

  // Sections
  "section.featured.eyebrow": "Match of the day",
  "section.featured.title": "Featured Match",
  "section.live.eyebrow": "In play & next up",
  "section.live.title": "Live Matches",
  "section.predictions.eyebrow": "Powered by the model",
  "section.predictions.title": "Match Predictions",
  "section.standings.eyebrow": "Group stage",
  "section.standings.title": "Standings",
  "section.news.eyebrow": "Stories & analysis",
  "section.news.title": "Latest News",

  // Pages
  "page.fixtures.eyebrow": "Schedule",
  "page.fixtures.title": "Fixtures",
  "page.fixtures.desc":
    "Today, tomorrow and the week ahead. All kickoff times shown in Asia/Ho_Chi_Minh.",
  "page.results.eyebrow": "Full time",
  "page.results.title": "Results",
  "page.results.desc": "Full-time and half-time scores. Dates and times use Asia/Ho_Chi_Minh.",
  "page.standings.eyebrow": "Tables",
  "page.standings.title": "Standings",
  "page.standings.desc":
    "Select a league to see the full ranking, recent form, leaders and the relegation zone.",
  "page.news.eyebrow": "Stories & analysis",
  "page.news.title": "News",
  "page.news.desc": "Match reports, features and tactical analysis from World Cup 2026.",
  "page.search.title": "Search",

  // Featured / match
  "match.openMatchCenter": "Open Match Center",
  "match.backToFixtures": "Back to fixtures",
  "match.metadata": "Match metadata",
  "match.scoreboard": "Scoreboard",
  "match.venue": "Venue",
  "match.city": "City",
  "match.league": "League",
  "match.season": "Season",
  "match.round": "Round",
  "match.kickoff": "Kickoff Time",
  "match.countdownPlaceholder": "Countdown will be updated before kickoff.",
  "match.completed": "Match completed",
  "match.currentMinute": "Current minute",
  "match.finalScore": "Final Score",
  "match.notFound": "Match not found.",
  "match.loadError": "Unable to load match information.",

  // Fixtures
  "fixtures.viewAll": "View all",
  "fixtures.prevPage": "Previous",
  "fixtures.nextPage": "Next",
  "fixtures.page": "Page",
  "fixtures.of": "of",
  "fixtures.showing": "Showing",

  // Standings table
  "standings.colPos": "#",
  "standings.colTeam": "Team",
  "standings.colPlayed": "P",
  "standings.colWon": "W",
  "standings.colDrawn": "D",
  "standings.colLost": "L",
  "standings.colGf": "GF",
  "standings.colGa": "GA",
  "standings.colGd": "GD",
  "standings.colPoints": "Pts",
  "standings.colForm": "Form",
  "standings.win": "Win",
  "standings.draw": "Draw",
  "standings.loss": "Loss",
  "standings.leader": "Leader",
  "standings.topTwo": "Top two advance to the knockout stage",

  // Results
  "results.fullTime": "Full time",
  "results.ht": "HT",
  "results.matchEvents": "Match events",
  "results.win": "win",
  "results.draw": "Draw",
  "results.noEvents": "No events recorded.",
  "results.noResults": "No results found",
  "results.noResultsHint": "Try a different league or date, or clear your filters.",

  // Fixtures empty
  "fixtures.noMatches": "No matches found",
  "fixtures.noMatchesHint": "Try a different day, league, or clear your filters.",
  "fixtures.loadError": "Unable to load fixtures. Please try again later.",

  // Head To Head
  "h2h.title": "Head To Head",
  "h2h.empty": "No head-to-head data available.",
  "h2h.wins": "Wins",
  "h2h.draws": "Draws",
  "h2h.recent": "Recent meetings",

  // Predictions detail
  "prediction.allPredictions": "All predictions",
  "prediction.summaryTitle": "Prediction Summary",
  "prediction.matchTime": "Match time",
  "prediction.date": "Date",
  "prediction.kickoff": "Kickoff",
  "prediction.venue": "Venue",
  "prediction.stage": "Stage",
  "prediction.related": "Related Predictions",
  "prediction.relatedEyebrow": "Keep reading",

  // News
  "news.related": "Related stories",
  "news.allNews": "All news",
  "news.empty": "Content is being updated.",
  "news.by": "By",

  // Search
  "search.placeholder": "Search matches, teams, news…",
  "search.prompt": "Start typing to search news, predictions and fixtures.",
  "search.noResults": "No results for",
  "search.typeNews": "News",
  "search.typePrediction": "Prediction",
  "search.typeFixture": "Fixture",

  // Error / not found
  "error.title": "Something went wrong",
  "error.desc": "We couldn't load this content. Please try again in a moment.",
  "notFound.title": "Page not found",
  "notFound.desc": "The page you're looking for doesn't exist or has moved.",

  // Footer
  "footer.tournament": "Tournament",
  "footer.explore": "Explore",
  "footer.company": "Company",
  "footer.rights": "All rights reserved.",
  "footer.demoNote": "Scores & data are for demonstration purposes.",

  // CTA banner
  "ctaBanner.eyebrow": "Don't miss a moment",
  "ctaBanner.title": "Unlock exclusive match insights",
  "ctaBanner.subtitle":
    "Get expert analysis, premium predictions and live alerts delivered straight to your feed.",
  "ctaBanner.feature1": "Expert match analysis",
  "ctaBanner.feature2": "Real-time insights",
  "ctaBanner.feature3": "Live score alerts",
  "ctaBanner.free": "It's free — takes 30 seconds",

  // Language
  "lang.label": "Language",
  "lang.vi": "VI",
  "lang.en": "EN",
};
