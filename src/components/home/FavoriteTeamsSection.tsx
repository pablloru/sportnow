"use client";

import { useTranslations } from "next-intl";
import type { News, SportEvent } from "@/lib/types";
import { useFavoriteTeams } from "@/hooks/useFavoriteTeams";
import { EventCard } from "@/components/event/EventCard";
import { NewsCard } from "@/components/home/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** The personalized "why come back" section: matches and news for
 * whichever teams the visitor has starred (see FavoriteTeamButton on
 * the team page). Favorites live only in this browser's localStorage,
 * so this has to be a client component — the server has no idea who's
 * visiting or what they follow. Renders a discoverable empty state for
 * everyone who hasn't favorited anything yet, rather than just
 * disappearing (a feature no one notices might as well not exist). */
export function FavoriteTeamsSection({
  upcoming,
  news,
}: {
  upcoming: SportEvent[];
  news: News[];
}) {
  const t = useTranslations("home");
  const { favoriteIds } = useFavoriteTeams();

  if (favoriteIds.length === 0) {
    return (
      <section id="section-favorites" className="scroll-mt-44">
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--muted)]">{t("favoritesEmpty")}</p>
          <a
            href="#section-categories"
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-[rgba(var(--brand-rgb),0.4)] hover:bg-[rgba(var(--brand-rgb),0.12)] hover:text-white"
          >
            {t("favoritesEmptyCta")} →
          </a>
        </div>
      </section>
    );
  }

  const favoriteEvents = upcoming
    .filter((e) => favoriteIds.includes(e.home.team.id) || favoriteIds.includes(e.away.team.id))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 6);

  const favoriteNews = news
    .filter((n) => n.relatedTeamIds?.some((id) => favoriteIds.includes(id)))
    .slice(0, 3);

  return (
    <section id="section-favorites" className="scroll-mt-44 space-y-4">
      <SectionHeading title={t("sectionFavorites")} />
      {favoriteEvents.length === 0 && favoriteNews.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{t("favoritesNoUpcoming")}</p>
      ) : (
        <>
          {favoriteEvents.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
          {favoriteNews.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {favoriteNews.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
