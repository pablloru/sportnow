import type { IntelligenceImportance } from "@/lib/types";

/**
 * STUB — not called anywhere yet in V1 (insights are hand-written mock
 * data). This documents the intended shape for when a real News/Odds
 * feed is connected: a raw incoming signal gets scored into one of the
 * three importance buckets the UI already knows how to render.
 *
 * Replace the body with a real model/heuristic later; keep the
 * signature so the intelligence layer's callers don't need to change.
 */
export interface RawSignal {
  type: "injury" | "lineup-change" | "odds-move" | "news" | "weather";
  /** e.g. how much the underlying line moved, or the player's minutes share. */
  magnitude?: number;
  isKeyEntity?: boolean;
}

export function scoreImpact(signal: RawSignal): IntelligenceImportance {
  if (signal.type === "injury" && signal.isKeyEntity) return "high";
  if (signal.type === "lineup-change" && signal.isKeyEntity) return "high";
  if (signal.type === "odds-move" && (signal.magnitude ?? 0) > 15) return "medium";
  return "low";
}
