import { defineRouting } from "next-intl/routing";

/**
 * Single source of truth for supported locales.
 *
 * Russian is the default/base locale — every mock entity's Russian
 * text is written directly on it. English is a full second locale:
 * UI copy comes from messages/en.json, and mock content comes from
 * the small per-domain override dictionaries under
 * mock-data/i18n/*.en.ts (see lib/mock-data/helpers.ts `localize`).
 * Adding a third language later is the same two-part recipe:
 *   1. add its code to `locales`
 *   2. add `messages/<code>.json` + `mock-data/i18n/*.<code>.ts` overrides
 * No component or business logic needs to change.
 */
export const routing = defineRouting({
  locales: ["ru", "en"],
  defaultLocale: "ru",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];

/** Locales we intend to support soon — used only for documentation /
 * future planning, not wired into routing yet. Move an entry into
 * `routing.locales` above (and add its messages file) to activate it. */
export const PLANNED_LOCALES = ["es", "de"] as const;
