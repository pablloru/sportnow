import type { SportSlug } from "./sport";

/** ISO date-time string, e.g. "2026-09-14T18:00:00Z". Kept as a plain
 * string (not Date) so entities stay JSON-serializable end to end —
 * important once these come from a real API/DB instead of mock files. */
export type ISODateTime = string;

export interface Competition {
  id: string;
  sport: SportSlug;
  name: string;
  /** e.g. "RU", "EU", "INT" — used for grouping/filtering. */
  region: string;
  tier: 1 | 2 | 3;
  logo?: string;
}

export interface Team {
  id: string;
  sport: SportSlug;
  name: string;
  shortName: string;
  /** URL-safe, derived from `name` by `slugify` in mock-data — see
   * team.repository.ts. Powers /[sport]/team/[slug]. */
  slug: string;
  logo?: string;
  country?: string;
  /** Recent match results, newest first: W/D/L. */
  form?: ("W" | "D" | "L")[];
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  /** URL-safe, derived from `name` by `slugify` in mock-data — see
   * player.repository.ts. Powers /[sport]/player/[slug]. */
  slug: string;
  position?: string;
  number?: number;
  photo?: string;
  /** True role-players in esports (e.g. "mid", "support") reuse `position`. */
  isKeyPlayer?: boolean;
}

export type EventStatus =
  | "scheduled"
  | "finished"
  | "postponed"
  | "cancelled";

export interface EventParticipant {
  team: Team;
  /** Final or live score. Undefined before the event starts. */
  score?: number;
}

export interface EventStatistic {
  id: string;
  eventId: string;
  /** Human-readable stat label, e.g. "Possession", "Shots on target".
   * Free-form on purpose: different sports track different stats and
   * V1 does not attempt a universal stat taxonomy. */
  label: string;
  homeValue: string | number;
  awayValue: string | number;
}

export interface Lineup {
  eventId: string;
  teamId: string;
  formation?: string;
  starters: Player[];
  bench?: Player[];
}

export interface Injury {
  id: string;
  playerId: string;
  teamId: string;
  description: string;
  /** How much this is expected to affect the team's next event. */
  impact: "low" | "medium" | "high";
  reportedAt: ISODateTime;
}

/**
 * The core scheduling entity. Deliberately sport-agnostic: a football
 * match, a tennis match and a Dota 2 game are all an `Event` with a
 * `sport` field, not separate types. Sport-specific detail (sets, maps,
 * periods) is layered on top via EventStatistic / Lineup rather than by
 * forking this shape.
 */
export interface SportEvent {
  id: string;
  slug: string;
  sport: SportSlug;
  competition: Competition;
  status: EventStatus;
  startTime: ISODateTime;
  home: EventParticipant;
  away: EventParticipant;
  venue?: string;
  /** Populated once analysis exists for this event. */
  hasIntelligence: boolean;
  hasPrediction: boolean;
  /** Editorial "featured on homepage / sport page" flag. In V1 this is
   * set by hand in mock data; later it's a natural place for a ranking
   * signal (viewership, competition tier, odds volume, etc.) to plug in. */
  isPopular?: boolean;
}

export interface PredictionFactor {
  label: string;
  /** Short explanation of how this factor pushes the prediction. */
  detail: string;
}

/**
 * A deliberately transparent, non-authoritative estimate — see the
 * Intelligence layer for the framing rules (never "will win", always
 * a probability + the factors behind it).
 */
export interface Prediction {
  eventId: string;
  homeWinPct: number;
  drawPct?: number;
  awayWinPct: number;
  factors: PredictionFactor[];
  generatedAt: ISODateTime;
  /** Always mock/demo in V1 — surfaced in the UI, never hidden. */
  isDemo: boolean;
}

export type IntelligenceImportance = "low" | "medium" | "high";

/**
 * One "What changed?" entry for an event — the core Match Intelligence
 * concept from the brief: not just data, but an explanation of why a
 * piece of data matters.
 */
export interface IntelligenceInsight {
  id: string;
  eventId: string;
  headline: string;
  explanation: string;
  importance: IntelligenceImportance;
  createdAt: ISODateTime;
  /** Where this insight would come from once wired to real feeds. */
  source: Pick<Source, "id" | "name">;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  sport: SportSlug;
  competition?: string;
  relatedTeamIds?: string[];
  relatedPlayerIds?: string[];
  publishedAt: ISODateTime;
  updatedAt: ISODateTime;
  source: Pick<Source, "id" | "name">;
  tags: string[];
}

export interface ArticleStatBlock {
  label: string;
  value: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  sport: SportSlug;
  image?: string;
  publishedAt: ISODateTime;
  updatedAt: ISODateTime;
  author?: string;
  /** Short teaser used on cards and in meta description. */
  excerpt: string;
  /** Intro paragraph, shown larger above the body. */
  intro: string;
  /** Body content as an array of paragraphs (kept simple for V1 instead
   * of a rich-text/markdown AST). */
  body: string[];
  stats?: ArticleStatBlock[];
  relatedEventIds?: string[];
  relatedArticleSlugs?: string[];
  tags: string[];
}

export interface Source {
  id: string;
  name: string;
  url?: string;
  /** What kind of feed this would be once real integrations exist. */
  kind: "news" | "odds" | "stats" | "editorial";
}
