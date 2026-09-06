"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { SportEvent, Team } from "@/lib/types";
import { useFavorites } from "@/hooks/useFavorites";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamGrid } from "@/components/team/TeamGrid";
import { EventCard } from "@/components/event/EventCard";

/** A plain directory of everything the visitor has starred. Teams and
 * events are two independent sections on purpose — see useFavorites —
 * since some visitors only want to track a team long-term, others just
 * a single upcoming match. Deliberately does NOT pull in any extra
 * content for a favorited team (news, related matches, etc.): this
 * page is only the index. Clicking an entry takes you to its own
 * page — the team or match page already shows everything about it. */
export function FavoritesClient({ teams, events }: { teams: Team[]; events: SportEvent[] }) {
  const t = useTranslations("favoritesPage");
  const { favoriteIds: favoriteTeamIds } = useFavorites("team");
  const { favoriteIds: favoriteEventIds } = useFavorites("event");

  const favoriteTeams = teams.filter((team) => favoriteTeamIds.includes(team.id));
  const favoriteEvents = events.filter((event) => favoriteEventIds.includes(event.id));

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("intro")}</p>
      </div>

      <section className="space-y-4">
        <SectionHeading title={t("sectionTeams")} />
        {favoriteTeams.length > 0 ? <TeamGrid teams={favoriteTeams} /> : <EmptyState message={t("emptyTeams")} cta={t("emptyCta")} />}
      </section>

      <section className="space-y-4">
        <SectionHeading title={t("sectionEvents")} />
        {favoriteEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState message={t("emptyEvents")} cta={t("emptyCta")} />
        )}
      </section>
    </div>
  );
}

function EmptyState({ message, cta }: { message: string; cta: string }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--muted)]">{message}</p>
      <Link
        href="/search"
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-[rgba(var(--brand-rgb),0.4)] hover:bg-[rgba(var(--brand-rgb),0.12)] hover:text-white"
      >
        {cta} →
      </Link>
    </div>
  );
}
