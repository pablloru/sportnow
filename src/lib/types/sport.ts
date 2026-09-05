/**
 * Canonical sport identifier. This is a language-agnostic slug — it is
 * used as a URL segment (`/ru/football`) and as a lookup key into the
 * i18n messages (`sports.football.name`). Never store a display name
 * here; display names are translated content and live in messages/*.json.
 */
export type SportSlug =
  | "football"
  | "hockey"
  | "tennis"
  | "cs2"
  | "dota-2"
  | "mobile-legends"
  | "ufc";

/** Broad category — lets the UI/data layer treat traditional sports and
 * esports consistently while still allowing sport-specific rendering
 * later (e.g. tennis has sets, football has a scoreline). */
export type SportCategory = "traditional" | "esports";

export interface Sport {
  slug: SportSlug;
  category: SportCategory;
  /** Lucide icon name (or similar) used across nav/cards. */
  icon: string;
  /** Is this sport fully wired up with mock data in V1? */
  active: boolean;
}
