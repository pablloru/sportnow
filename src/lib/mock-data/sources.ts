import type { Source } from "@/lib/types";

/** Placeholder "feeds" — stand in for the real News/Odds/Stats API
 * integrations described in the architecture. Every mock News/Article/
 * IntelligenceInsight cites one of these so the UI already renders a
 * source attribution, which real integrations will simply replace. */
export const SOURCES: Source[] = [
  { id: "src-sportswire", name: "SportsWire", kind: "news" },
  { id: "src-oddsmetrics", name: "OddsMetrics", kind: "odds" },
  { id: "src-statcenter", name: "StatCenter", kind: "stats" },
  { id: "src-editorial", name: "SportNow Editorial", kind: "editorial" },
];

export function getSource(id: string): Pick<Source, "id" | "name"> {
  const found = SOURCES.find((s) => s.id === id);
  return found ? { id: found.id, name: found.name } : { id, name: "Unknown source" };
}
