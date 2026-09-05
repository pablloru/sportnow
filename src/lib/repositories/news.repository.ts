import * as mock from "@/lib/mock-data";
import type { News } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";

export const newsRepository = {
  async listLatest(limit?: number, locale: AppLocale = "ru"): Promise<News[]> {
    return mock.getLatestNews(limit, locale);
  },
  async listBySport(sport: string, limit?: number, locale: AppLocale = "ru"): Promise<News[]> {
    return mock.getNewsBySport(sport, limit, locale);
  },
  async getBySlug(slug: string, locale: AppLocale = "ru"): Promise<News | undefined> {
    return mock.getNewsBySlug(slug, locale);
  },

  /** Every news item across every sport — used by site-wide search. */
  async listAll(locale: AppLocale = "ru"): Promise<News[]> {
    return mock.getAllNews(locale);
  },
};
