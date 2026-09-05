import { intelligenceRepository } from "@/lib/repositories/intelligence.repository";
import { eventRepository } from "@/lib/repositories/event.repository";
import type { IntelligenceInsight, Prediction } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";

export interface MatchIntelligence {
  insights: IntelligenceInsight[];
  prediction: Prediction | undefined;
  statistics: Awaited<ReturnType<typeof eventRepository.getStatistics>>;
}

/**
 * Intelligence layer entry point for an event page. Today this just
 * fetches hand-written mock insights/predictions and orders them — but
 * it is the single seam where real automation plugs in later:
 *
 *   raw signal (news/odds/stats feed)
 *       -> scoreImpact()          [see impact-scoring.ts]
 *       -> IntelligenceInsight
 *
 * Nothing outside this folder needs to change when that happens; event
 * pages only ever call `getMatchIntelligence`.
 */
export async function getMatchIntelligence(eventId: string, locale: AppLocale = "ru"): Promise<MatchIntelligence> {
  const [insights, prediction, statistics] = await Promise.all([
    intelligenceRepository.getInsights(eventId, locale),
    intelligenceRepository.getPrediction(eventId, locale),
    eventRepository.getStatistics(eventId, locale),
  ]);

  return { insights, prediction, statistics };
}

/** Human-readable, non-committal summary line for a prediction — used
 * wherever we show a one-line gist instead of the full factor list.
 * Deliberately phrased as an estimate, never a certainty (see brief §6). */
export function formatPredictionHeadline(prediction: Prediction, locale: AppLocale = "ru"): string {
  const { homeWinPct, awayWinPct, drawPct } = prediction;
  const top = Math.max(homeWinPct, awayWinPct, drawPct ?? 0);
  if (locale === "en") {
    if (top === homeWinPct) return `Slight edge to the home side — ${homeWinPct}%`;
    if (top === awayWinPct) return `Slight edge to the away side — ${awayWinPct}%`;
    return `Even matchup, high chance of a draw — ${drawPct}%`;
  }
  if (top === homeWinPct) return `Небольшое преимущество у хозяев — ${homeWinPct}%`;
  if (top === awayWinPct) return `Небольшое преимущество у гостей — ${awayWinPct}%`;
  return `Равные шансы, высокая вероятность ничьей — ${drawPct}%`;
}
