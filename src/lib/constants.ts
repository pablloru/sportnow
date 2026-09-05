import type { Sport } from "./types";

/**
 * Registry of every sport the platform knows about. Display names are
 * NOT here — they come from messages/*.json via the `sports.<slug>.name`
 * key, so this file never needs to change when a new language is added.
 *
 * Adding a 7th sport later is: add an entry here + mock data + messages
 * keys. No page component needs to change, since sport/[sport] pages
 * are generated generically from this list.
 */
export const SPORTS: Sport[] = [
  { slug: "football", category: "traditional", icon: "circle-dot", active: true },
  { slug: "hockey", category: "traditional", icon: "hockey-puck", active: true },
  { slug: "tennis", category: "traditional", icon: "circle", active: true },
  { slug: "cs2", category: "esports", icon: "crosshair", active: true },
  { slug: "dota-2", category: "esports", icon: "swords", active: true },
  { slug: "mobile-legends", category: "esports", icon: "smartphone", active: true },
  { slug: "ufc", category: "traditional", icon: "flame", active: true },
];

export const SPORT_SLUGS = SPORTS.map((s) => s.slug);

export function isSportSlug(value: string): value is (typeof SPORT_SLUGS)[number] {
  return (SPORT_SLUGS as string[]).includes(value);
}

export const SITE_NAME = "SportsNew";
