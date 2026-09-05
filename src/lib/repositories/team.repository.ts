import * as mock from "@/lib/mock-data";
import type { SportEvent, News, Player, Team } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";

/**
 * Data-layer boundary for team pages. Same shape as event.repository.ts:
 * every method is async so a real Teams/Players API can replace the
 * mock-data calls later without any caller changing.
 */
export const teamRepository = {
  async getBySlug(sport: string, slug: string): Promise<Team | undefined> {
    return mock.getTeamBySlug(sport, slug);
  },

  async listBySport(sport: string): Promise<Team[]> {
    return mock.getTeamsBySport(sport);
  },

  /** Every team across every sport — used by site-wide search. */
  async listAll(): Promise<Team[]> {
    return mock.TEAMS;
  },

  async getRoster(teamId: string): Promise<Player[]> {
    return mock.getPlayersByTeam(teamId);
  },

  /** Every event involving this team, most recent first — the page
   * splits it into live/upcoming/results groups itself. */
  async getEvents(teamId: string): Promise<SportEvent[]> {
    return mock.getEventsByTeam(teamId);
  },

  async getNews(teamId: string, limit?: number, locale: AppLocale = "ru"): Promise<News[]> {
    return mock.getNewsByTeam(teamId, limit, locale);
  },
};
