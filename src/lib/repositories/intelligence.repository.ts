import * as mock from "@/lib/mock-data";
import type { Prediction, IntelligenceInsight } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";

/**
 * Data access for the Intelligence layer's inputs. Kept separate from
 * event.repository.ts because in a real system these would likely come
 * from a different service (an odds/analysis provider) than core event
 * scheduling data does.
 */
export const intelligenceRepository = {
  async getPrediction(eventId: string, locale: AppLocale = "ru"): Promise<Prediction | undefined> {
    return mock.getPredictionForEvent(eventId, locale);
  },
  async getInsights(eventId: string, locale: AppLocale = "ru"): Promise<IntelligenceInsight[]> {
    return mock.getInsightsForEvent(eventId, locale);
  },
};
