import { sportRepository } from "@/lib/repositories/sport.repository";
import { eventRepository } from "@/lib/repositories/event.repository";
import { newsRepository } from "@/lib/repositories/news.repository";
import { articleRepository } from "@/lib/repositories/article.repository";
import { intelligenceRepository } from "@/lib/repositories/intelligence.repository";
import { teamRepository } from "@/lib/repositories/team.repository";
import type { SportSlug } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";

export async function getSportPageData(sport: SportSlug, locale: AppLocale = "ru") {
  const [sportInfo, upcoming, results, popular, news, articles, teams] = await Promise.all([
    sportRepository.getBySlug(sport),
    eventRepository.listUpcoming(6, sport),
    eventRepository.listRecentResults(sport, 4),
    eventRepository.listPopular(3, sport),
    newsRepository.listBySport(sport, 5, locale),
    articleRepository.listBySport(sport, 3, locale),
    teamRepository.listBySport(sport),
  ]);

  const predictedEvents = await Promise.all(
    [...upcoming, ...popular]
      .filter((e, i, arr) => arr.findIndex((x) => x.id === e.id) === i)
      .filter((e) => e.hasPrediction)
      .map(async (event) => ({
        event,
        prediction: await intelligenceRepository.getPrediction(event.id, locale),
      }))
  );

  return { sportInfo, upcoming, results, popular, news, articles, teams, predictions: predictedEvents };
}
