"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFavorites } from "@/hooks/useFavorites";

/**
 * The header's entry point to /favorites. Icon-only controls are easy
 * to miss and, worse, easy to misread once noticed — so this pairs the
 * star with its own name ("Избранное") the same way the "Результаты"
 * link does, rather than relying on an aria-label nobody sighted ever
 * reads. The small brand-colored count badge (Amazon/Airbnb-style)
 * appears the moment anything is favorited, giving a visitor concrete
 * proof the star buttons elsewhere on the site actually did something
 * and collected here.
 */
export function FavoritesNavLink() {
  const t = useTranslations("nav");
  const { favoriteIds: teamIds } = useFavorites("team");
  const { favoriteIds: eventIds } = useFavorites("event");
  const count = teamIds.length + eventIds.length;

  return (
    <Link
      href="/favorites"
      aria-label={t("favorites")}
      title={t("favorites")}
      className="relative flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[rgba(var(--ink-rgb),0.05)] px-3 text-[var(--foreground-dim)] transition-colors hover:bg-[rgba(var(--ink-rgb),0.1)] hover:text-[var(--foreground)]"
    >
      <StarIcon />
      <span className="hidden text-sm font-medium sm:inline">{t("favorites")}</span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-bold leading-none text-slate-950">
          {count}
        </span>
      )}
    </Link>
  );
}

function StarIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="m12 3 2.6 5.86 6.4.6-4.8 4.3 1.4 6.24L12 16.9l-5.6 3.1 1.4-6.24-4.8-4.3 6.4-.6L12 3Z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
