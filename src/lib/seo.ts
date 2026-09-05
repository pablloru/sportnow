import { routing } from "@/i18n/routing";

/**
 * Builds the `alternates.languages` map for Next.js Metadata: one entry
 * per supported locale plus `x-default` (pointing at the default
 * locale's URL), so search engines see every locale of a page as
 * alternates of one another instead of as separate, unrelated pages.
 *
 * `pathFor` takes a locale code and returns that locale's version of
 * the *current* page's path (e.g. `(l) => \`/${l}/${sport}\``).
 */
export function localeAlternates(pathFor: (locale: string) => string): Record<string, string> {
  const entries = routing.locales.map((locale) => [locale, pathFor(locale)] as const);
  return {
    ...Object.fromEntries(entries),
    "x-default": pathFor(routing.defaultLocale),
  };
}
