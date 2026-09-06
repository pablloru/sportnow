"use client";

import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { useFavoriteTeams } from "@/hooks/useFavoriteTeams";

/** The one client-interactive island on an otherwise server-rendered
 * team page — everything else about favorites (reading them back for
 * the homepage's "Your teams" section) fans out from this one toggle. */
export function FavoriteTeamButton({ teamId, teamName }: { teamId: string; teamName: string }) {
  const t = useTranslations("teamPage");
  const { isFavorite, toggle } = useFavoriteTeams();
  const active = isFavorite(teamId);

  return (
    <button
      type="button"
      onClick={() => toggle(teamId)}
      aria-pressed={active}
      aria-label={active ? t("unfollowTeam", { name: teamName }) : t("followTeam", { name: teamName })}
      className={clsx(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
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
      className="h-5 w-5"
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
