import * as mock from "@/lib/mock-data";
import type { Article } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";

export const articleRepository = {
  async getBySlug(slug: string, locale: AppLocale = "ru"): Promise<Article | undefined> {
    return mock.getArticleBySlug(slug, locale);
  },
  async listLatest(limit?: number, locale: AppLocale = "ru"): Promise<Article[]> {
    return mock.getLatestArticles(limit, locale);
  },
  async listBySport(sport: string, limit?: number, locale: AppLocale = "ru"): Promise<Article[]> {
    return mock.getArticlesBySport(sport, limit, locale);
  },
  async listAll(locale: AppLocale = "ru"): Promise<Article[]> {
    return mock.getAllArticles(locale);
  },
};
