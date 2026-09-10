// Generates src/lib/real-data/generated.ts from real, free sports APIs:
//   - football-data.org (needs FOOTBALL_DATA_API_TOKEN env var, free tier)
//   - NHL's public schedule API (api-web.nhle.com — no key required)
//
// Runs at BUILD TIME (see .github/workflows/deploy.yml), never in the
// browser. Any fetch failure is caught and logged so a missing token or
// a flaky upstream never breaks the whole site build — the affected
// sport just falls back to an empty real-data set for that run.

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

async function fetchFootball() {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  const teams = new Map();
  const competitions = new Map();
  const events = [];

  if (!token) {
    console.warn("[fetch-real-events] FOOTBALL_DATA_API_TOKEN not set — skipping football.");
    return { teams: [], competitions: [], events: [] };
  }

  const dateFrom = isoDate(new Date(Date.now() - 7 * 86400000));
  const dateTo = isoDate(new Date(Date.now() + 14 * 86400000));

  for (const code of FOOTBALL_COMPETITIONS) {
    try {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { headers: { "X-Auth-Token": token } }
      );
      if (!res.ok) {
        console.warn(`[fetch-real-events] football-data.org ${code} -> HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();

      for (const match of data.matches ?? []) {
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

        const mapTeam = (t) => {
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
        };

        const homeId = mapTeam(match.homeTeam);
        const awayId = mapTeam(match.awayTeam);

        const statusMap = {
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

        events.push({
          id: `fd-event-${match.id}`,
          sport: "football",
          competitionId: compId,
          status: statusMap[match.status] ?? "scheduled",
          startTime: match.utcDate,
          homeTeamId: homeId,
          homeScore: match.score?.fullTime?.home ?? undefined,
          awayTeamId: awayId,
          awayScore: match.score?.fullTime?.away ?? undefined,
          venue: match.venue ?? undefined,
        });
      }
      // Free tier is 10 req/min — stay well under it.
      await new Promise((r) => setTimeout(r, 7000));
    } catch (err) {
      console.warn(`[fetch-real-events] football-data.org ${code} failed:`, err.message);
    }
  }

  return { teams: [...teams.values()], competitions: [...competitions.values()], events };
}

// ---------------------------------------------------------------------
// Hockey — NHL public API (no key needed)
// ---------------------------------------------------------------------

async function fetchHockey() {
  const teams = new Map();
  const events = [];
  const competition = { id: "nhl-comp-1", sport: "hockey", name: "NHL", region: "NA", tier: 1 };

  const datesToTry = [
    isoDate(new Date(Date.now() - 6 * 86400000)),
    "now",
  ];

  for (const date of datesToTry) {
    try {
      const res = await fetch(`https://api-web.nhle.com/v1/schedule/${date}`);
      if (!res.ok) {
        console.warn(`[fetch-real-events] NHL ${date} -> HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();

      for (const week of data.gameWeek ?? []) {
        for (const game of week.games ?? []) {
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

          const eventId = `nhl-event-${game.id}`;
          if (events.some((e) => e.id === eventId)) continue; // dedupe across the two date windows

          events.push({
            id: eventId,
            sport: "hockey",
            competitionId: competition.id,
            status: stateMap[game.gameState] ?? "scheduled",
            startTime: game.startTimeUTC,
            homeTeamId: homeId,
            homeScore: game.homeTeam.score ?? undefined,
            awayTeamId: awayId,
            awayScore: game.awayTeam.score ?? undefined,
            venue: game.venue?.default ?? undefined,
          });
        }
      }
    } catch (err) {
      console.warn(`[fetch-real-events] NHL ${date} failed:`, err.message);
    }
  }

  return {
    teams: [...teams.values()],
    competitions: events.length ? [competition] : [],
    events,
  };
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
    "// FOOTBALL_DATA_API_TOKEN secret is missing, so the build never breaks because of it.\n\n" +
    'import type { SportEvent, Team, Competition } from "@/lib/types";\n\n';

  const body =
    `export const REAL_EVENTS: SportEvent[] = ${JSON.stringify(events, null, 2)};\n\n` +
    `export const REAL_TEAMS: Team[] = ${JSON.stringify(teams, null, 2)};\n\n` +
    `export const REAL_COMPETITIONS: Competition[] = ${JSON.stringify(competitions, null, 2)};\n`;

  await writeFile(OUT_FILE, banner + body, "utf8");
  console.log(
    `[fetch-real-events] wrote ${events.length} events, ${teams.length} teams, ${competitions.length} competitions -> ${OUT_FILE}`
  );
}

main().catch((err) => {
  console.error("[fetch-real-events] fatal error, leaving existing generated.ts in place:", err);
  // Non-zero exit would fail the whole deploy — better to ship with
  // whatever generated.ts already exists (or the committed empty
  // fallback) than to block the release over a data-fetch hiccup.
  process.exit(0);
});
