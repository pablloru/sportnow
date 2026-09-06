"use client";

import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { useFavorites } from "@/hooks/useFavorites";

/** Same star-toggle pattern as FavoriteTeamButton, for a single match
 * instead of a team — lets a visitor track one upcoming event without
 * having to follow either team playing in it. Sized smaller than the
 * team-page button so it sits comfortably in the match header's
 * tournament/status row. Favorited event ids are read back on the
 * dedicated favorites page (see /favorites). */
export function FavoriteEventButton({ eventId, matchLabel }: { eventId: string; matchLabel: string }) {
  const t = useTranslations("eventPage");
  const { isFavorite, toggle } = useFavorites("event");
  const active = isFavorite(eventId);

  return (
    <button
      type="button"
      onClick={() => toggle(eventId)}
      aria-pressed={active}
      aria-label={active ? t("unfollowEvent", { match: matchLabel }) : t("followEvent", { match: matchLabel })}
      className={clsx(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
        active
          ? "border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.16)] text-[var(--brand)]"
          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
      )}
    >
      <StarIcon filled={active} />
    </button>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        d="m12 3 2.6 5.86 6.4.6-4.8 4.3 1.4 6.24L12 16.9l-5.6 3.1 1.4-6.24-4.8-4.3 6.4-.6L12 3Z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
