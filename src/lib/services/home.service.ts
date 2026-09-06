import { sportRepository } from "@/lib/repositories/sport.repository";
import { eventRepository } from "@/lib/repositories/event.repository";
import { newsRepository } from "@/lib/repositories/news.repository";
import { intelligenceRepository } from "@/lib/repositories/intelligence.repository";
import type { AppLocale } from "@/i18n/routing";

/**
 * Application layer: assembles everything the homepage needs in one
 * call. Components never talk to repositories directly — they call a
 * service, which decides which repositories to combine. This is the
 * seam where caching / request deduplication would be added later.
 */
export async function getHomePageData(locale: AppLocale = "ru") {
  const [sports, upcoming, popular, latestNews] = await Promise.all([
    sportRepository.listAll(),
    eventRepository.listUpcoming(6),
    eventRepository.listPopular(4),
    newsRepository.listLatest(6, locale),
  ]);

  const predictedEvents = await Promise.all(
    popular.map(async (event) => ({
      event,
      prediction: await intelligenceRepository.getPrediction(event.id, locale),
    }))
  );

  // Paired with the event it's about (not just the raw insight) so the
  // homepage card can show which match this is and link straight to it
  // — an insight with no visible match context reads as a floating,
  // unclickable fact ("the home team's striker will miss the match" —
  // which match?).
  const topInsights = await Promise.all(
    popular
      .filter((e) => e.hasIntelligence)
      .map(async (event) => {
        const insights = await intelligenceRepository.getInsights(event.id, locale);
        return insights.map((insight) => ({ insight, event }));
      })
  );

  return {
    sports,
    upcoming,
    popular,
    latestNews,
    predictions: predictedEvents.filter((p) => p.prediction),
    todayInsights: topInsights.flat().slice(0, 3),
  };
}
