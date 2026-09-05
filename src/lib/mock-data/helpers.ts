import type { ISODateTime } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";

/**
 * All mock timestamps are generated relative to "now" instead of being
 * frozen literals, so upcoming events stay upcoming and the demo never
 * looks stale. Once a real API/DB is wired in, these files are deleted
 * wholesale — nothing else in the app depends on how the dates were
 * produced, only that they're ISO strings.
 */
export function daysFromNow(offsetDays: number, hour = 18, minute = 0): ISODateTime {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function hoursFromNow(offsetHours: number): ISODateTime {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() + offsetHours);
  return d.toISOString();
}

/** Turns arbitrary display text into a URL-safe slug — strips accents
 * (so "Marko Delić" becomes "marko-delic", not something with a raw
 * unicode combining mark in a URL), lowercases, and collapses
 * everything else to single hyphens. */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Derives a `slug` for every item from its `name`, disambiguating with
 * `-2`, `-3`, ... on collision — so team/player slugs are generated
 * from mock data instead of hand-authored (and can never silently
 * collide as new entries are added). */
export function withUniqueSlugs<T extends { name: string }>(items: T[]): (T & { slug: string })[] {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const base = slugify(item.name);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return { ...item, slug: count === 0 ? base : `${base}-${count + 1}` };
  });
}

/**
 * Applies a per-locale content override to a mock entity — the seam
 * for shipping English copy without duplicating the entire dataset.
 * Russian is the base/default content written directly on every
 * entity; `overrides` is a small `id -> partial fields` dictionary
 * (see mock-data/i18n/*.en.ts) with ONLY the free-text fields that
 * actually need translating (ids, dates, relations, images, and
 * already-language-neutral proper nouns stay defined once). Locales
 * with no override map (or no entry for this id) fall back to the
 * Russian base — never a blank field.
 */
export function localize<T extends { id: string }, O extends Partial<T>>(
  entity: T,
  locale: AppLocale,
  overridesByLocale: Partial<Record<AppLocale, Record<string, O>>>
): T {
  const override = overridesByLocale[locale]?.[entity.id];
  return override ? { ...entity, ...override } : entity;
}
