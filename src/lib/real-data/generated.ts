// Placeholder for scripts/fetch-real-events.mjs output. Committed so a fresh
// checkout (or a build that skips the fetch step, e.g. local dev without
// FOOTBALL_DATA_API_TOKEN) still type-checks and builds with empty real-data
// arrays. Overwritten at build time in CI.

import type { SportEvent, Team, Competition, Prediction, IntelligenceInsight } from "@/lib/types";

export const REAL_EVENTS: SportEvent[] = [];

export const REAL_TEAMS: Team[] = [];

export const REAL_COMPETITIONS: Competition[] = [];

export const REAL_PREDICTIONS_RU: Prediction[] = [];

export const REAL_PREDICTIONS_EN: Prediction[] = [];

export const REAL_INSIGHTS_RU: IntelligenceInsight[] = [];

export const REAL_INSIGHTS_EN: IntelligenceInsight[] = [];
