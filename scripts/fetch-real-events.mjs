// Generates src/lib/real-data/generated.ts from real, free sports APIs:
//   - football-data.org (needs FOOTBALL_DATA_API_TOKEN env var, free tier)
//   - NHL's public schedule API (api-web.nhle.com — no key required)
//
// Runs at BUILD TIME (see .github/workflows/deploy.yml), never in the
// browser. Any fetch failure is caught and logged so a missing token or
// a flaky upstream never breaks the whole site build — the affected
// sport just falls back to an empty real-data set for that run.
//
// Besides events/teams/competitions, this also derives — from the same
// already-fetched matches, no extra API calls — a simple, transparent
// prediction (win/draw/win % + factors) for upcoming matches and a
// short post-match insight (final score + streak context) for finished
// ones. This is a plain rule-based estimate (recent-form points, named
// by opponent and scoreline, + a fixed home-advantage weight, plus a
// head-to-head factor naming the most recent meeting's score and year)
// — not a statistical/ML model — see buildPrediction() below. Recent
// form and head-to-head both draw on several seasons of per-team
// history (football: season=YYYY per competition; hockey: NHL's
// club-schedule-season per team), not just a narrow near-term window,
// so an old meeting between two teams can still surface.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const OUT_FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "lib",
  "real-data",
  "generated.ts"
);

function slugify(text) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------
// Football — football-data.org
// ---------------------------------------------------------------------

const FOOTBALL_COMPETITIONS = ["PL", "CL", "BL1", "PD"];

// How many completed seasons of history to pull per competition, on top
// of the near-term window below, purely to feed buildPrediction()'s
// recent-form / head-to-head math with real depth — two teams' most
// recent meeting might be from a season or two back, not the last 30
// days. Kept modest to stay well within the free tier's rate limit and
// keep build time reasonable; if the free tier restricts access to
// older seasons, those requests just fail gracefully like any other.
const FOOTBALL_PAST_SEASONS = 3;

function footballCurrentSeasonStartYear() {
  const now = new Date();
  // European club seasons start around July/August; before that we're
  // still inside the season that started the previous calendar year.
  return now.getUTCMonth() >= 6 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
}

const FOOTBALL_STATUS_MAP = {
  SCHEDULED: "scheduled",
  TIMED: "scheduled",
  IN_PLAY: "scheduled",
  PAUSED: "scheduled",
  FINISHED: "finished",
  POSTPONED: "postponed",
  SUSPENDED: "cancelled",
  CANCELLED: "cancelled",
  AWARDED: "finished",
};

function mapFootballTeam(teams, t) {
  const id = `fd-team-${t.id}`;
  if (!teams.has(id)) {
    teams.set(id, {
      id,
      sport: "football",
      name: t.name,
      shortName: t.tla || t.shortName || t.name.slice(0, 3).toUpperCase(),
      country: undefined,
    });
  }
  return id;
}

function mapFootballMatch(match, teams, competitions) {
  const compId = `fd-comp-${match.competition.id}`;
  if (!competitions.has(compId)) {
    competitions.set(compId, {
      id: compId,
      sport: "football",
      name: match.competition.name,
      region: "EU",
      tier: 1,
    });
  }

  const homeId = mapFootballTeam(teams, match.homeTeam);
  const awayId = mapFootballTeam(teams, match.awayTeam);

  return {
    id: `fd-event-${match.id}`,
    sport: "football",
    competitionId: compId,
    status: FOOTBALL_STATUS_MAP[match.status] ?? "scheduled",
    startTime: match.utcDate,
    homeTeamId: homeId,
    homeScore: match.score?.fullTime?.home ?? undefined,
    awayTeamId: awayId,
    awayScore: match.score?.fullTime?.away ?? undefined,
    venue: match.venue ?? undefined,
  };
}

/** One football-data.org matches query, returning `data.matches` (or []
 * on any failure) — never throws, and always waits out the free tier's
 * 10-req/min limit before returning, win or lose. */
async function fetchFootballMatches(url, token) {
  try {
    const res = await fetch(url, { headers: { "X-Auth-Token": token } });
    if (!res.ok) {
      console.warn(`[fetch-real-events] football-data.org ${url} -> HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    return data.matches ?? [];
  } catch (err) {
    console.warn(`[fetch-real-events] football-data.org ${url} failed:`, err.message);
    return [];
  } finally {
    await new Promise((r) => setTimeout(r, 7000));
  }
}

async function fetchFootball() {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  const teams = new Map();
  const competitions = new Map();
  const events = [];
  const historyEvents = [];

  if (!token) {
    console.warn("[fetch-real-events] FOOTBALL_DATA_API_TOKEN not set — skipping football.");
    return { teams: [], competitions: [], events: [], historyEvents: [] };
  }

  // 30 days back (not just 7) so there's enough finished-match history
  // per team to compute a "last 5" form line even before the deeper,
  // multi-season history below is factored in.
  const dateFrom = isoDate(new Date(Date.now() - 30 * 86400000));
  const dateTo = isoDate(new Date(Date.now() + 14 * 86400000));
  const currentSeason = footballCurrentSeasonStartYear();
  const historyDedupe = new Set();

  for (const code of FOOTBALL_COMPETITIONS) {
    const nearTermMatches = await fetchFootballMatches(
      `https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      token
    );
    for (const match of nearTermMatches) {
      events.push(mapFootballMatch(match, teams, competitions));
    }

    // Extra seasons purely for recent-form / head-to-head depth (see
    // formHistoryRawEvents in main()) — never added to `events`, so an
    // old season never turns into its own match page on the site.
    for (let i = 0; i <= FOOTBALL_PAST_SEASONS; i++) {
      const season = currentSeason - i;
      const seasonMatches = await fetchFootballMatches(
        `https://api.football-data.org/v4/competitions/${code}/matches?season=${season}`,
        token
      );
      for (const match of seasonMatches) {
        if (match.status !== "FINISHED") continue; // only results are useful as history
        const event = mapFootballMatch(match, teams, competitions);
        if (historyDedupe.has(event.id)) continue;
        historyDedupe.add(event.id);
        historyEvents.push(event);
      }
    }
  }

  return { teams: [...teams.values()], competitions: [...competitions.values()], events, historyEvents };
}

// ---------------------------------------------------------------------
// Hockey — NHL public API (no key needed)
// ---------------------------------------------------------------------

/** One week of raw NHL game objects starting at `date` ("YYYY-MM-DD" or
 * the literal "now"), or [] on any failure — never throws, matching the
 * "a flaky upstream never breaks the build" contract for this script. */
async function fetchHockeyWeek(date) {
  try {
    const res = await fetch(`https://api-web.nhle.com/v1/schedule/${date}`);
    if (!res.ok) {
      console.warn(`[fetch-real-events] NHL ${date} -> HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    const games = [];
    for (const week of data.gameWeek ?? []) {
      for (const game of week.games ?? []) games.push(game);
    }
    return games;
  } catch (err) {
    console.warn(`[fetch-real-events] NHL ${date} failed:`, err.message);
    return [];
  }
}

function mapNhlGame(game, teams) {
  const mapTeam = (t) => {
    const id = `nhl-team-${t.id}`;
    if (!teams.has(id)) {
      teams.set(id, {
        id,
        sport: "hockey",
        name: t.commonName?.default || t.placeName?.default || t.abbrev,
        shortName: t.abbrev,
        country: undefined,
      });
    }
    return id;
  };

  const homeId = mapTeam(game.homeTeam);
  const awayId = mapTeam(game.awayTeam);

  const stateMap = {
    FUT: "scheduled",
    PRE: "scheduled",
    LIVE: "scheduled",
    CRIT: "scheduled",
    OFF: "finished",
    FINAL: "finished",
  };

  return {
    id: `nhl-event-${game.id}`,
    sport: "hockey",
    competitionId: "nhl-comp-1",
    status: stateMap[game.gameState] ?? "scheduled",
    startTime: game.startTimeUTC,
    homeTeamId: homeId,
    homeScore: game.homeTeam.score ?? undefined,
    awayTeamId: awayId,
    awayScore: game.awayTeam.score ?? undefined,
    venue: game.venue?.default ?? undefined,
  };
}

// NHL's schedule endpoint returns one week per call — enough windows to
// discover which teams have near-term fixtures (see fetchHockey below).
const PAST_WEEK_OFFSETS_DAYS = [-34, -27, -20, -13, -6];

/** One team's full schedule for one NHL season (e.g. "20242025"), via
 * the club-schedule-season endpoint — a single call gets every game
 * that team played that season, instead of paging week by week. Games
 * come back in the same shape as fetchHockeyWeek()'s, so mapNhlGame()
 * handles both. Returns [] on any failure, same fail-open contract as
 * the rest of this script. */
async function fetchNhlTeamSeason(teamAbbrev, season) {
  try {
    const res = await fetch(`https://api-web.nhle.com/v1/club-schedule-season/${teamAbbrev}/${season}`);
    if (!res.ok) {
      console.warn(`[fetch-real-events] NHL club-schedule-season ${teamAbbrev}/${season} -> HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    return data.games ?? [];
  } catch (err) {
    console.warn(`[fetch-real-events] NHL club-schedule-season ${teamAbbrev}/${season} failed:`, err.message);
    return [];
  }
}

function nhlCurrentSeasonStartYear() {
  const now = new Date();
  // The NHL regular season starts around October; a "season" is labeled
  // by its start year, e.g. "20262027" for the season starting Oct 2026.
  return now.getUTCMonth() >= 6 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
}

// How many seasons of full per-team schedule to pull as history, on top
// of the near-term weekly windows above — same reasoning as football's
// FOOTBALL_PAST_SEASONS: real depth for recent-form/head-to-head, kept
// modest to stay polite to a free public API with no published rate
// limit or key requirement.
const NHL_PAST_SEASONS = 3;

async function fetchHockey() {
  const teams = new Map();
  const competition = { id: "nhl-comp-1", sport: "hockey", name: "NHL", region: "NA", tier: 1 };

  const currentWeekStarts = PAST_WEEK_OFFSETS_DAYS.map((d) => isoDate(new Date(Date.now() + d * 86400000)));
  const dedupe = new Set();
  const events = [];

  for (const date of [...currentWeekStarts, "now"]) {
    const games = await fetchHockeyWeek(date);
    for (const game of games) {
      const event = mapNhlGame(game, teams);
      if (dedupe.has(event.id)) continue;
      dedupe.add(event.id);
      events.push(event);
    }
  }

  // Deeper per-team history for recent-form/head-to-head context: for
  // every team that actually has a fixture in the window above, pull
  // several past seasons of that team's full schedule in one call each
  // (rather than paging week by week) — reaches back multiple years so
  // an old head-to-head meeting can still surface, and doesn't depend
  // on the current season having produced any finished games yet (early
  // in a new season, or before it's even started, the near-term window
  // can be all-scheduled with nothing finished). Kept separate
  // (`historyEvents`) and never merged into `events` — these are not
  // part of the current schedule and must never get their own match page.
  const involvedTeamIds = new Set(events.flatMap((e) => [e.homeTeamId, e.awayTeamId]));
  const currentSeasonStartYear = nhlCurrentSeasonStartYear();
  const historyEvents = [];
  const historyDedupe = new Set();

  for (const teamId of involvedTeamIds) {
    const abbrev = teams.get(teamId)?.shortName;
    if (!abbrev) continue;
    for (let i = 0; i <= NHL_PAST_SEASONS; i++) {
      const startYear = currentSeasonStartYear - i;
      const season = `${startYear}${startYear + 1}`;
      const games = await fetchNhlTeamSeason(abbrev, season);
      for (const game of games) {
        const event = mapNhlGame(game, teams);
        if (event.status !== "finished") continue; // only results are useful as history
        if (historyDedupe.has(event.id)) continue;
        historyDedupe.add(event.id);
        historyEvents.push(event);
      }
      // Be polite to a free, unauthenticated public API.
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return {
    teams: [...teams.values()],
    competitions: events.length ? [competition] : [],
    events,
    historyEvents,
  };
}

// ---------------------------------------------------------------------
// Intelligence layer: form / head-to-head / predictions / post-match
// insights, all derived from the raw matches already fetched above.
// ---------------------------------------------------------------------

/** Newest-first W/D/L for one team from already-fetched raw events,
 * optionally restricted to strictly before `beforeTime` (so a
 * prediction only ever sees matches before kickoff, and a post-match
 * insight only sees matches before that match itself). Used by
 * buildPostMatchInsights()'s streak counting, which only needs the
 * result letters; buildPrediction() uses the richer
 * computeRecentResults() below instead, which also names opponents. */
function computeForm(rawEvents, teamId, { limit = 5, beforeTime } = {}) {
  return rawEvents
    .filter(
      (e) =>
        e.status === "finished" &&
        typeof e.homeScore === "number" &&
        typeof e.awayScore === "number" &&
        (e.homeTeamId === teamId || e.awayTeamId === teamId) &&
        (!beforeTime || new Date(e.startTime).getTime() < beforeTime)
    )
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, limit)
    .map((e) => {
      const isHome = e.homeTeamId === teamId;
      const gf = isHome ? e.homeScore : e.awayScore;
      const ga = isHome ? e.awayScore : e.homeScore;
      return gf > ga ? "W" : gf < ga ? "L" : "D";
    });
}

/** Collapses a list of raw events to one entry per id, keeping the
 * first occurrence. Needed because formHistoryRawEvents can now merge
 * the near-term events fetch with one or more full-season historical
 * fetches that overlap it (e.g. a match finished this week can appear
 * in both), and computeForm()/computeRecentResults()/summarizeH2H()
 * all assume each real match appears exactly once. */
function dedupeById(rawEvents) {
  const seen = new Set();
  const out = [];
  for (const e of rawEvents) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    out.push(e);
  }
  return out;
}

function formPoints(form) {
  return form.reduce((sum, r) => sum + (r === "W" ? 3 : r === "D" ? 1 : 0), 0);
}

/** Same filter as computeForm(), but keeps the opponent and scoreline
 * for each match instead of collapsing it to a single letter — lets the
 * prediction's "current form" factor name specific opponents and
 * scores ("won 3-1 against X") instead of a bare points total. */
function computeRecentResults(rawEvents, teamId, teamsById, { limit = 5, beforeTime } = {}) {
  return rawEvents
    .filter(
      (e) =>
        e.status === "finished" &&
        typeof e.homeScore === "number" &&
        typeof e.awayScore === "number" &&
        (e.homeTeamId === teamId || e.awayTeamId === teamId) &&
        (!beforeTime || new Date(e.startTime).getTime() < beforeTime)
    )
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, limit)
    .map((e) => {
      const isHome = e.homeTeamId === teamId;
      const opponentId = isHome ? e.awayTeamId : e.homeTeamId;
      const scoreFor = isHome ? e.homeScore : e.awayScore;
      const scoreAgainst = isHome ? e.awayScore : e.homeScore;
      const result = scoreFor > scoreAgainst ? "W" : scoreFor < scoreAgainst ? "L" : "D";
      return {
        result,
        opponentName: teamsById.get(opponentId)?.name ?? "неизвестный соперник",
        scoreFor,
        scoreAgainst,
      };
    });
}

function summarizeRecentResultsRu(teamName, results) {
  if (results.length === 0) return null;
  const wins = results.filter((r) => r.result === "W");
  const losses = results.filter((r) => r.result === "L");
  const draws = results.filter((r) => r.result === "D");

  let text = `${teamName}: ${wins.length} побед, ${draws.length} ничьих, ${losses.length} поражений в последних ${results.length} матчах`;
  const highlights = [];
  if (wins.length > 0) {
    highlights.push(
      `победы над ${wins.slice(0, 2).map((r) => `${r.opponentName} (${r.scoreFor}:${r.scoreAgainst})`).join(" и ")}`
    );
  }
  if (losses.length > 0) {
    highlights.push(
      `поражения от ${losses.slice(0, 2).map((r) => `${r.opponentName} (${r.scoreFor}:${r.scoreAgainst})`).join(" и ")}`
    );
  }
  if (highlights.length > 0) text += ` — ${highlights.join(", ")}`;
  return text + ".";
}

function summarizeRecentResultsEn(teamName, results) {
  if (results.length === 0) return null;
  const wins = results.filter((r) => r.result === "W");
  const losses = results.filter((r) => r.result === "L");
  const draws = results.filter((r) => r.result === "D");

  let text = `${teamName}: ${wins.length}W ${draws.length}D ${losses.length}L over their last ${results.length} matches`;
  const highlights = [];
  if (wins.length > 0) {
    highlights.push(
      `wins over ${wins.slice(0, 2).map((r) => `${r.opponentName} (${r.scoreFor}-${r.scoreAgainst})`).join(" and ")}`
    );
  }
  if (losses.length > 0) {
    highlights.push(
      `losses to ${losses.slice(0, 2).map((r) => `${r.opponentName} (${r.scoreFor}-${r.scoreAgainst})`).join(" and ")}`
    );
  }
  if (highlights.length > 0) text += ` — ${highlights.join(", ")}`;
  return text + ".";
}

/** Aggregate head-to-head tally plus the most recent meeting's exact
 * scoreline and year — now genuinely deep, since rawEvents can include
 * several seasons of history per team (see fetchFootball()/fetchHockey()
 * above), not just whatever happened to fall in a 30-day window. Returns
 * null when the two teams haven't met within the fetched history. */
function summarizeH2H(rawEvents, homeId, awayId, beforeTime) {
  const h2h = rawEvents.filter(
    (e) =>
      e.status === "finished" &&
      typeof e.homeScore === "number" &&
      typeof e.awayScore === "number" &&
      ((e.homeTeamId === homeId && e.awayTeamId === awayId) ||
        (e.homeTeamId === awayId && e.awayTeamId === homeId)) &&
      (!beforeTime || new Date(e.startTime).getTime() < beforeTime)
  );
  if (h2h.length === 0) return null;

  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  for (const m of h2h) {
    const homeIsHomeNow = m.homeTeamId === homeId;
    const gf = homeIsHomeNow ? m.homeScore : m.awayScore;
    const ga = homeIsHomeNow ? m.awayScore : m.homeScore;
    if (gf > ga) homeWins++;
    else if (gf < ga) awayWins++;
    else draws++;
  }

  const mostRecent = [...h2h].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
  const mostRecentHomeIsHomeNow = mostRecent.homeTeamId === homeId;
  const lastMeeting = {
    forHome: mostRecentHomeIsHomeNow ? mostRecent.homeScore : mostRecent.awayScore,
    forAway: mostRecentHomeIsHomeNow ? mostRecent.awayScore : mostRecent.homeScore,
    year: new Date(mostRecent.startTime).getUTCFullYear(),
  };

  return { count: h2h.length, homeWins, awayWins, draws, lastMeeting };
}

/**
 * A deliberately simple, transparent estimate — recent-form points plus
 * a fixed home-advantage weight, and a head-to-head factor when the two
 * teams have met within the fetched history (which, thanks to the
 * multi-season fetch above, can now reach back several years — not just
 * whatever happened to fall in the near-term window). Not a statistical
 * or ML model, and never claims to be one (see the predictionDisclaimer
 * copy in messages/*.json). Returns null when there's too little
 * history to say anything (fewer than 2 recent results total between
 * both teams) rather than fabricate a number from nothing.
 */
function buildPrediction(event, rawEvents, teamsById) {
  const kickoff = new Date(event.startTime).getTime();
  const homeId = event.home.team.id;
  const awayId = event.away.team.id;
  const homeName = event.home.team.name;
  const awayName = event.away.team.name;

  const homeResults = computeRecentResults(rawEvents, homeId, teamsById, { beforeTime: kickoff });
  const awayResults = computeRecentResults(rawEvents, awayId, teamsById, { beforeTime: kickoff });
  if (homeResults.length + awayResults.length < 2) return null;

  const homePts = formPoints(homeResults.map((r) => r.result));
  const awayPts = formPoints(awayResults.map((r) => r.result));
  const hasDraws = event.sport === "football";

  const HOME_ADVANTAGE = 2.2;
  const FLOOR = 1; // keeps a team with zero recent history from being a flat 0
  const homeStrength = homePts + HOME_ADVANTAGE + FLOOR;
  const awayStrength = awayPts + FLOOR;

  let homeWinPct;
  let drawPct;
  let awayWinPct;
  if (hasDraws) {
    const drawShare = 0.22; // fixed baseline, roughly league-average draw rate
    const remainder = 100 * (1 - drawShare);
    const total = homeStrength + awayStrength;
    homeWinPct = Math.round((homeStrength / total) * remainder);
    awayWinPct = Math.round((awayStrength / total) * remainder);
    drawPct = 100 - homeWinPct - awayWinPct;
  } else {
    const total = homeStrength + awayStrength;
    homeWinPct = Math.round((homeStrength / total) * 100);
    awayWinPct = 100 - homeWinPct;
  }

  const factorsRu = [];
  const factorsEn = [];

  if (homeResults.length > 0 || awayResults.length > 0) {
    factorsRu.push({
      label: "Текущая форма",
      detail: [summarizeRecentResultsRu(homeName, homeResults), summarizeRecentResultsRu(awayName, awayResults)]
        .filter(Boolean)
        .join(" "),
    });
    factorsEn.push({
      label: "Current form",
      detail: [summarizeRecentResultsEn(homeName, homeResults), summarizeRecentResultsEn(awayName, awayResults)]
        .filter(Boolean)
        .join(" "),
    });
  }

  factorsRu.push({
    label: "Домашний фактор",
    detail: `${homeName} играют на своём поле — в оценку заложен стандартный вес фактора хозяев.`,
  });
  factorsEn.push({
    label: "Home advantage",
    detail: `${homeName} are playing at home — a standard home-advantage weighting is factored in.`,
  });

  const h2h = summarizeH2H(rawEvents, homeId, awayId, kickoff);
  if (h2h) {
    factorsRu.push({
      label: "Личные встречи",
      detail: `В последних ${h2h.count} очных матчах: ${h2h.homeWins} побед ${homeName}, ${h2h.draws} ничьих, ${h2h.awayWins} побед ${awayName}. Последняя встреча (${h2h.lastMeeting.year} г.): ${homeName} ${h2h.lastMeeting.forHome}:${h2h.lastMeeting.forAway} ${awayName}.`,
    });
    factorsEn.push({
      label: "Head-to-head",
      detail: `In their last ${h2h.count} meetings: ${h2h.homeWins} wins for ${homeName}, ${h2h.draws} draws, ${h2h.awayWins} wins for ${awayName}. Most recent (${h2h.lastMeeting.year}): ${homeName} ${h2h.lastMeeting.forHome}-${h2h.lastMeeting.forAway} ${awayName}.`,
    });
  }

  const generatedAt = new Date().toISOString();
  const shared = { eventId: event.id, homeWinPct, awayWinPct, generatedAt, isDemo: false };
  if (hasDraws) shared.drawPct = drawPct;

  return {
    ru: { ...shared, factors: factorsRu },
    en: { ...shared, factors: factorsEn },
  };
}

/**
 * Post-match recap: the final score plus, when there's enough prior
 * form on record, whether it extended a winning run or snapped a
 * winless one. Template text, not an AI-written recap.
 */
function buildPostMatchInsights(event, rawEvents) {
  const homeScore = event.home.score;
  const awayScore = event.away.score;
  if (typeof homeScore !== "number" || typeof awayScore !== "number") return null;

  const kickoff = new Date(event.startTime).getTime();
  const homeName = event.home.team.name;
  const awayName = event.away.team.name;
  const isDraw = homeScore === awayScore;
  const winnerIsHome = homeScore > awayScore;
  const winner = isDraw ? null : winnerIsHome ? event.home.team : event.away.team;
  const loser = isDraw ? null : winnerIsHome ? event.away.team : event.home.team;
  const winnerScore = winnerIsHome ? homeScore : awayScore;
  const loserScore = winnerIsHome ? awayScore : homeScore;

  const createdAt = new Date().toISOString();
  const source = { id: "src-statcenter", name: "StatCenter" };
  const insightsRu = [];
  const insightsEn = [];

  insightsRu.push({
    id: `${event.id}-insight-score`,
    eventId: event.id,
    headline: isDraw ? "Ничья" : `Победа ${winner.name}`,
    explanation: isDraw
      ? `${homeName} ${homeScore}:${awayScore} ${awayName} — команды разошлись миром.`
      : `${winner.name} обыграли ${loser.name} со счётом ${winnerScore}:${loserScore}.`,
    importance: "medium",
    createdAt,
    source,
  });
  insightsEn.push({
    id: `${event.id}-insight-score`,
    eventId: event.id,
    headline: isDraw ? "Draw" : `${winner.name} win`,
    explanation: isDraw
      ? `${homeName} ${homeScore}-${awayScore} ${awayName} — the sides shared the points.`
      : `${winner.name} beat ${loser.name} ${winnerScore}-${loserScore}.`,
    importance: "medium",
    createdAt,
    source,
  });

  if (!isDraw) {
    const winnerId = winnerIsHome ? event.home.team.id : event.away.team.id;
    const priorForm = computeForm(rawEvents, winnerId, { beforeTime: kickoff, limit: 5 });

    let winStreak = 0;
    for (const r of priorForm) {
      if (r === "W") winStreak++;
      else break;
    }

    if (winStreak >= 1) {
      const total = winStreak + 1;
      insightsRu.push({
        id: `${event.id}-insight-streak`,
        eventId: event.id,
        headline: `${total}-я победа подряд`,
        explanation: `${winner.name} выигрывают уже ${total}-й матч подряд.`,
        importance: total >= 3 ? "high" : "low",
        createdAt,
        source,
      });
      insightsEn.push({
        id: `${event.id}-insight-streak`,
        eventId: event.id,
        headline: `${total} in a row`,
        explanation: `${winner.name} have now won ${total} matches in a row.`,
        importance: total >= 3 ? "high" : "low",
        createdAt,
        source,
      });
    } else {
      let winless = 0;
      for (const r of priorForm) {
        if (r !== "W") winless++;
        else break;
      }
      if (winless >= 2) {
        insightsRu.push({
          id: `${event.id}-insight-streak`,
          eventId: event.id,
          headline: "Серия без побед прервана",
          explanation: `${winner.name} прервали серию из ${winless} матчей без побед.`,
          importance: "medium",
          createdAt,
          source,
        });
        insightsEn.push({
          id: `${event.id}-insight-streak`,
          eventId: event.id,
          headline: "Winless run ends",
          explanation: `${winner.name} snapped a ${winless}-match run without a win.`,
          importance: "medium",
          createdAt,
          source,
        });
      }
    }
  }

  return { ru: insightsRu, en: insightsEn };
}

// ---------------------------------------------------------------------

function buildEvent(raw, teamsById, competitionsById) {
  const home = teamsById.get(raw.homeTeamId);
  const away = teamsById.get(raw.awayTeamId);
  const competition = competitionsById.get(raw.competitionId);
  if (!home || !away || !competition) return null;

  const slug = slugify(`${home.shortName}-vs-${away.shortName}-${raw.id}`);

  return {
    id: raw.id,
    slug,
    sport: raw.sport,
    competition,
    status: raw.status,
    startTime: raw.startTime,
    home: { team: home, score: raw.homeScore },
    away: { team: away, score: raw.awayScore },
    venue: raw.venue,
    hasIntelligence: false,
    hasPrediction: false,
    isPopular: false,
  };
}

async function main() {
  const [football, hockey] = await Promise.all([fetchFootball(), fetchHockey()]);

  // Slugs are added here, BEFORE teamsById is built, so the exact same
  // (slugged) team objects end up both embedded inside each event's
  // home/away.team AND in the standalone REAL_TEAMS export below — earlier
  // this added slugs only to the REAL_TEAMS copy, leaving the team objects
  // nested inside REAL_EVENTS without a slug and failing the build's
  // TypeScript check (Team.slug is required).
  const allTeamsRaw = [...football.teams, ...hockey.teams].map((t) => ({
    ...t,
    slug: slugify(t.name),
  }));
  const teamsById = new Map(allTeamsRaw.map((t) => [t.id, t]));

  const allCompetitionsRaw = [...football.competitions, ...hockey.competitions];
  const competitionsById = new Map(allCompetitionsRaw.map((c) => [c.id, c]));

  const rawEvents = [...football.events, ...hockey.events];
  const events = rawEvents
    .map((e) => buildEvent(e, teamsById, competitionsById))
    .filter((e) => e !== null)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Superset used only for form/head-to-head math (see buildPrediction()
  // and buildPostMatchInsights()) — adds several seasons of per-team
  // history on top of the events actually listed on the site (see
  // fetchFootball()'s season=YYYY loop and fetchHockey()'s
  // club-schedule-season loop above), so an old head-to-head meeting can
  // surface even if it happened years before either team's next fixture.
  // Never used to build `events` itself. Deduped by id: a currently
  // finished match can legitimately appear both in the near-term
  // `events` fetch and in a `season=currentSeason` / current-season
  // history fetch, and counting it twice would double its weight in
  // recent-form/head-to-head math.
  const formHistoryRawEvents = dedupeById([
    ...rawEvents,
    ...(football.historyEvents ?? []),
    ...(hockey.historyEvents ?? []),
  ]);

  // Predictions (scheduled events) and post-match insights (finished
  // events), computed from the matches already fetched above — see the
  // Intelligence layer section. Mutates hasPrediction/hasIntelligence on
  // each event so listing cards pick up the same "AI insight available"
  // badge the hand-written mock events use.
  const predictionsRu = [];
  const predictionsEn = [];
  const insightsRu = [];
  const insightsEn = [];

  for (const event of events) {
    if (event.status === "scheduled") {
      const prediction = buildPrediction(event, formHistoryRawEvents, teamsById);
      if (prediction) {
        predictionsRu.push(prediction.ru);
        predictionsEn.push(prediction.en);
        event.hasPrediction = true;
      }
    } else if (event.status === "finished") {
      const insights = buildPostMatchInsights(event, formHistoryRawEvents);
      if (insights && insights.ru.length > 0) {
        insightsRu.push(...insights.ru);
        insightsEn.push(...insights.en);
        event.hasIntelligence = true;
      }
    }
  }

  // Teams actually referenced by at least one event (so we never ship a
  // team page with zero fixtures on it). Slugs were already added above.
  const usedTeamIds = new Set(events.flatMap((e) => [e.home.team.id, e.away.team.id]));
  const teams = allTeamsRaw.filter((t) => usedTeamIds.has(t.id));

  const usedCompetitionIds = new Set(events.map((e) => e.competition.id));
  const competitions = allCompetitionsRaw.filter((c) => usedCompetitionIds.has(c.id));

  const banner =
    "// AUTO-GENERATED by scripts/fetch-real-events.mjs at build time — do not edit by hand.\n" +
    "// Real football + hockey fixtures/results fetched from football-data.org and the\n" +
    "// NHL's public schedule API. Falls back to empty arrays when a fetch fails or the\n" +
    "// FOOTBALL_DATA_API_TOKEN secret is missing, so the build never breaks because of it.\n" +
    "//\n" +
    "// REAL_PREDICTIONS_* / REAL_INSIGHTS_* are a plain rule-based estimate derived from\n" +
    "// the same fetched matches (recent-form points + a fixed home-advantage weight, plus\n" +
    "// head-to-head/streak context when available) — not a statistical or ML model.\n\n" +
    'import type { SportEvent, Team, Competition, Prediction, IntelligenceInsight } from "@/lib/types";\n\n';

  const body =
    `export const REAL_EVENTS: SportEvent[] = ${JSON.stringify(events, null, 2)};\n\n` +
    `export const REAL_TEAMS: Team[] = ${JSON.stringify(teams, null, 2)};\n\n` +
    `export const REAL_COMPETITIONS: Competition[] = ${JSON.stringify(competitions, null, 2)};\n\n` +
    `export const REAL_PREDICTIONS_RU: Prediction[] = ${JSON.stringify(predictionsRu, null, 2)};\n\n` +
    `export const REAL_PREDICTIONS_EN: Prediction[] = ${JSON.stringify(predictionsEn, null, 2)};\n\n` +
    `export const REAL_INSIGHTS_RU: IntelligenceInsight[] = ${JSON.stringify(insightsRu, null, 2)};\n\n` +
    `export const REAL_INSIGHTS_EN: IntelligenceInsight[] = ${JSON.stringify(insightsEn, null, 2)};\n`;

  await writeFile(OUT_FILE, banner + body, "utf8");
  console.log(
    `[fetch-real-events] wrote ${events.length} events, ${teams.length} teams, ${competitions.length} competitions, ` +
      `${predictionsRu.length} predictions, ${insightsRu.length} insights -> ${OUT_FILE}`
  );
}

main().catch((err) => {
  console.error("[fetch-real-events] fatal error, leaving existing generated.ts in place:", err);
  // Non-zero exit would fail the whole deploy — better to ship with
  // whatever generated.ts already exists (or the committed empty
  // fallback) than to block the release over a data-fetch hiccup.
  process.exit(0);
});
