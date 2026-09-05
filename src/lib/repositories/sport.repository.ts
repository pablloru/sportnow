import { SPORTS } from "@/lib/constants";
import type { Sport, SportSlug } from "@/lib/types";

/**
 * Repository layer: the ONLY place in the app allowed to know where data
 * comes from. Right now that's the static SPORTS registry; later this
 * could read from a CMS or config service. Every function is async so
 * call sites never need to change when the implementation does.
 */
export const sportRepository = {
  async listAll(): Promise<Sport[]> {
    return SPORTS;
  },

  async getBySlug(slug: SportSlug): Promise<Sport | undefined> {
    return SPORTS.find((s) => s.slug === slug);
  },
};
