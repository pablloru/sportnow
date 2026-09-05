"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article, News, SportEvent, Team } from "@/lib/types";
import { SPORTS } from "@/lib/constants";
import { searchArticles, searchEvents, searchNews, searchTeams } from "@/lib/search";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/event/EventCard";
import { ArticleCard } from "@/components/article/ArticleCard";
import { NewsCard } from "@/components/home/NewsCard";
import { TeamGrid } from "@/components/team/TeamGrid";

const RESULT_LIMIT = 9;

/** Site-wide search over everything that already has a real destination
 * page — teams, events, articles, and sport categories. News stays in
 * the results (it's useful context) even though it has no detail page
 * of its own in V1, same as everywhere else NewsCard is used. Fully
 * client-side: the dataset is small enough to ship in one page load
 * and filter in the browser, no search API needed for a V1 demo. */
export function SearchClient({
  events,
  news,
  articles,
  teams,
}: {
  events: SportEvent[];
  news: News[];
  articles: Article[];
  teams: Team[];
}) {
  const t = useTranslations("search");
  const tSports = useTranslations("sports");
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const matchedSports = useMemo(() => {
    if (!trimmed) return [];
    const q = trimmed.toLowerCase();
    return SPORTS.filter((sport) => {
      const name = tSports(`${sport.slug}.name`).toLowerCase();
      const shortName = tSports(`${sport.slug}.shortName`).toLowerCase();
      return name.includes(q) || shortName.includes(q);
    });
  }, [trimmed, tSports]);

  const matchedTeams = useMemo(() => (trimmed ? searchTeams(teams, trimmed) : []), [teams, trimmed]);
  const matchedEvents = useMemo(
    () => (trimmed ? searchEvents(events, trimmed) : []),
    [events, trimmed]
  );
  const matchedArticles = useMemo(
    () => (trimmed ? searchArticles(articles, trimmed) : []),
    [articles, trimmed]
  );
  const matchedNews = useMemo(() => (trimmed ? searchNews(news, trimmed) : []), [news, trimmed]);

  const hasAnyResults =
    matchedSports.length > 0 ||
    matchedTeams.length > 0 ||
    matchedEvents.length > 0 ||
    matchedArticles.length > 0 ||
    matchedNews.length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-white sm:text-3xl">
          {t("title")}
        </h1>
        <div className="relative mt-5">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            autoFocus
            className="w-full rounded-2xl border border-white/10 bg-[var(--surface)] py-3.5 pl-11 pr-4 text-base text-white placeholder-[var(--muted)] outline-none focus:border-white/30"
          />
        </div>
      </div>

      {!trimmed && (
        <p className="text-sm text-[var(--muted)]">{t("hint")}</p>
      )}

      {trimmed && !hasAnyResults && (
        <p className="text-sm text-[var(--muted)]">{t("noResults", { query: trimmed })}</p>
      )}

      {matchedSports.length > 0 && (
        <section>
          <SectionHeading title={t("sports")} />
          <div className="flex flex-wrap gap-2">
            {matchedSports.map((sport) => (
              <Link
                key={sport.slug}
                href={`/${sport.slug}`}
                className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                {tSports(`${sport.slug}.name`)}
              </Link>
            ))}
          </div>
        </section>
      )}

      {matchedTeams.length > 0 && (
        <section>
          <SectionHeading
            title={t("teams")}
            subtitle={t("resultsCount", { count: matchedTeams.length })}
          />
          <TeamGrid teams={matchedTeams.slice(0, RESULT_LIMIT)} />
        </section>
      )}

      {matchedEvents.length > 0 && (
        <section>
          <SectionHeading
            title={t("events")}
            subtitle={t("resultsCount", { count: matchedEvents.length })}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedEvents.slice(0, RESULT_LIMIT).map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </div>
        </section>
      )}

      {matchedArticles.length > 0 && (
        <section>
          <SectionHeading
            title={t("articles")}
            subtitle={t("resultsCount", { count: matchedArticles.length })}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedArticles.slice(0, RESULT_LIMIT).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {matchedNews.length > 0 && (
        <section>
          <SectionHeading
            title={t("news")}
            subtitle={t("resultsCount", { count: matchedNews.length })}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedNews.slice(0, RESULT_LIMIT).map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
