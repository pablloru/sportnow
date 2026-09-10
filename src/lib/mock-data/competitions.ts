import type { Competition } from "@/lib/types";
import { REAL_COMPETITIONS } from "@/lib/real-data/generated";

/**
 * Every team/competition/player name in this mock dataset is fictional
 * by design — this is demo data for a product architecture, not a feed
 * of real results, so nothing here should ever be read as a real-world
 * sports claim, injury report, or prediction.
 */
const MOCK_COMPETITIONS: Competition[] = [
  { id: "comp-football-1", sport: "football", name: "Continental Premier League", region: "INT", tier: 1 },
  { id: "comp-hockey-1", sport: "hockey", name: "Continental Hockey Cup", region: "INT", tier: 1 },
  { id: "comp-tennis-1", sport: "tennis", name: "Grand Circuit Masters", region: "INT", tier: 1 },
  { id: "comp-cs2-1", sport: "cs2", name: "Apex Championship Series", region: "INT", tier: 1 },
  { id: "comp-dota-2-1", sport: "dota-2", name: "Global Rift Invitational", region: "INT", tier: 1 },
  { id: "comp-mlbb-1", sport: "mobile-legends", name: "Bracket Royale Series", region: "INT", tier: 1 },
  { id: "comp-ufc-1", sport: "ufc", name: "UFC Fight Night", region: "INT", tier: 1 },
];

export const COMPETITIONS: Competition[] = [
  ...MOCK_COMPETITIONS.filter((c) => c.sport !== "football" && c.sport !== "hockey"),
  ...REAL_COMPETITIONS,
];

export function getCompetition(id: string): Competition {
  // Falls back to the unfiltered mock list so the literal football/hockey
  // event objects in events.ts (still built against the original fictional
  // competition ids before those sports are filtered out of the final
  // EVENTS export) can resolve without throwing.
  const found = COMPETITIONS.find((c) => c.id === id) ?? MOCK_COMPETITIONS.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown competition id: ${id}`);
  return found;
}
