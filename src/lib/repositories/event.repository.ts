import * as mock from "@/lib/mock-data";
import type { SportEvent, EventStatistic, Lineup, Injury } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";

/**
 * Data-layer boundary for everything event-related. Swapping mock data
 * for a real Sports API/DB means rewriting the bodies of these
 * functions only — every service/component keeps calling the same
 * methods with the same shapes.
 */
export const eventRepository = {
  async getBySlug(sport: string, slug: string): Promise<SportEvent | undefined> {
    return mock.getEventBySlug(sport, slug);
  },

  async listBySport(sport: string): Promise<SportEvent[]> {
    return mock.getEventsBySport(sport);
  },

  /** Every event across every sport — used by site-wide search, which
   * has no single-sport scope to narrow by. */
  async listAll(): Promise<SportEvent[]> {
    return mock.EVENTS;
  },

  async listUpcoming(limit?: number, sport?: string): Promise<SportEvent[]> {
    const events = mock.getUpcomingEvents(sport ? undefined : limit);
    const filtered = sport ? events.filter((e) => e.sport === sport) : events;
    return limit ? filtered.slice(0, limit) : filtered;
  },

  async listRecentResults(sport?: string, limit?: number): Promise<SportEvent[]> {
    return mock.getRecentResults(sport, limit);
  },

  async listPopular(limit?: number, sport?: string): Promise<SportEvent[]> {
    const events = mock.getPopularEvents();
    const filtered = sport ? events.filter((e) => e.sport === sport) : events;
    return limit ? filtered.slice(0, limit) : filtered;
  },

  async getStatistics(eventId: string, locale: AppLocale = "ru"): Promise<EventStatistic[]> {
    return mock.getStatisticsForEvent(eventId, locale);
  },

  async getLineups(eventId: string): Promise<Lineup[]> {
    return mock.getLineupsForEvent(eventId);
  },

  async getInjuriesForTeam(teamId: string, locale: AppLocale = "ru"): Promise<Injury[]> {
    return mock.getInjuriesByTeam(teamId, locale);
  },

  /** Previous finished meetings between these two teams (either side as
   * home), most recent first. Empty when the pair has no history in the
   * mock dataset — that's a legitimate answer, not a missing-data bug. */
  async getHeadToHead(
    homeTeamId: string,
    awayTeamId: string,
    excludeEventId?: string
  ): Promise<SportEvent[]> {
    return mock.getHeadToHeadEvents(homeTeamId, awayTeamId, excludeEventId);
  },
};
