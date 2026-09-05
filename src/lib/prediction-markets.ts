import type { Prediction, SportSlug } from "@/lib/types";

export type MarketId = "total" | "btts" | "handicap" | "method";
export type OutcomeKind = "over" | "under" | "yes" | "no" | "handicapFavorite" | "handicapUnderdog" | "methodFinish" | "methodDecision";

export interface PredictionMarketOutcome {
  kind: OutcomeKind;
  pct: number;
}

export interface PredictionMarket {
  id: MarketId;
  /** Threshold for total/handicap markets (e.g. 2.5 goals, 1.5 maps). */
  line?: number;
  /** Which side the handicap line favors — only set on "handicap". */
  favorite?: "home" | "away";
  outcomes: PredictionMarketOutcome[];
}

interface MarketPlan {
  id: MarketId;
  line?: number;
}

/**
 * Which secondary markets make sense per sport. Football/hockey get a
 * classic 7-outcome slate once combined with the 3-way match result
 * already on `Prediction` (home/draw/away + total over/under + BTTS
 * yes/no). Sports without a draw get a total + handicap (racket/esports)
 * or total + method-of-victory (UFC) instead — a point handicap or BTTS
 * market doesn't map to how those are actually bet on, so the slate is 6
 * outcomes there rather than forcing a 7th that wouldn't mean anything.
 */
const SPORT_MARKET_PLAN: Record<SportSlug, MarketPlan[]> = {
  football: [{ id: "total", line: 2.5 }, { id: "btts" }],
  hockey: [{ id: "total", line: 5.5 }, { id: "btts" }],
  tennis: [{ id: "total", line: 22.5 }, { id: "handicap", line: 3.5 }],
  cs2: [{ id: "total", line: 2.5 }, { id: "handicap", line: 1.5 }],
  "dota-2": [{ id: "total", line: 2.5 }, { id: "handicap", line: 1.5 }],
  "mobile-legends": [{ id: "total", line: 2.5 }, { id: "handicap", line: 1.5 }],
  ufc: [{ id: "total", line: 2.5 }, { id: "method" }],
};

/** Small deterministic string hash — same event/market always produces
 * the same split. No Math.random(): this can run during render on the
 * server and the client, and a random source there would disagree
 * between the two (or between builds). */
function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function clampPct(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

/**
 * Secondary outcome markets for an event, alongside the hand-authored
 * match-result percentages already on `Prediction`. V1 has no real
 * multi-market model output, so — same spirit as the rest of this demo
 * ("isDemo: true" on every Prediction) — the split for each market is
 * derived deterministically rather than left unfilled. This is the seam
 * to replace once a real model produces these directly: swap the body,
 * keep the shape.
 */
export function buildPredictionMarkets(prediction: Prediction, sport: SportSlug): PredictionMarket[] {
  const plan = SPORT_MARKET_PLAN[sport];
  if (!plan) return [];

  const favorite: "home" | "away" = prediction.homeWinPct >= prediction.awayWinPct ? "home" : "away";
  const favoritePct = Math.max(prediction.homeWinPct, prediction.awayWinPct);

  return plan.map((market) => {
    const seed = seedFromId(`${prediction.eventId}:${market.id}`);

    switch (market.id) {
      case "total": {
        const over = clampPct(50 + ((seed % 23) - 11));
        return { id: "total", line: market.line, outcomes: [
          { kind: "over", pct: over },
          { kind: "under", pct: 100 - over },
        ] };
      }
      case "btts": {
        const yes = clampPct(50 + ((seed % 21) - 10));
        return { id: "btts", outcomes: [
          { kind: "yes", pct: yes },
          { kind: "no", pct: 100 - yes },
        ] };
      }
      case "handicap": {
        const covers = clampPct(favoritePct * 0.9);
        return { id: "handicap", line: market.line, favorite, outcomes: [
          { kind: "handicapFavorite", pct: covers },
          { kind: "handicapUnderdog", pct: 100 - covers },
        ] };
      }
      case "method": {
        const finish = clampPct(50 + ((seed % 19) - 9));
        return { id: "method", outcomes: [
          { kind: "methodFinish", pct: finish },
          { kind: "methodDecision", pct: 100 - finish },
        ] };
      }
    }
  });
}
