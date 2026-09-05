import * as mock from "@/lib/mock-data";
import type { Injury, Player, Team } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";

export const playerRepository = {
  async getBySlug(sport: string, slug: string): Promise<Player | undefined> {
    return mock.getPlayerBySlug(sport, slug);
  },

  async getTeam(teamId: string): Promise<Team> {
    return mock.getTeam(teamId);
  },

  /** A player's current reported injury, if any — empty is a legitimate
   * "fully fit" answer, not missing data (same convention as
   * event.repository.ts's getHeadToHead). */
  async getInjury(playerId: string, locale: AppLocale = "ru"): Promise<Injury | undefined> {
    return mock.getInjuryForPlayer(playerId, locale);
  },
};
