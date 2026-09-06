import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isSportSlug } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { eventRepository } from "@/lib/repositories/event.repository";
import { newsRepository } from "@/lib/repositories/news.repository";
import { articleRepository } from "@/lib/repositories/article.repository";
import { getMatchIntelligence } from "@/lib/intelligence/match-intelligence";
import { buildPredictionMarkets } from "@/lib/prediction-markets";
import { EVENTS } from "@/lib/mock-data";
import { routing, type AppLocale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Card } from "@/components/ui/Card";
import { Countdown } from "@/components/ui/Countdown";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { FormStrip } from "@/components/event/FormStrip";
import { TeamComparisonPanel } from "@/components/event/TeamComparisonPanel";
import { LineupPanel } from "@/components/event/LineupPanel";
import { PredictionBlock } from "@/components/event/PredictionBlock";
import { FavoriteEventButton } from "@/components/event/FavoriteEventButton";
import { IntelligencePanel } from "@/components/event/IntelligencePanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsCard } from "@/components/home/NewsCard";
import { ArticleCard } from "@/components/article/ArticleCard";

type Props = { params: Promise<{ locale: string; sport: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    EVENTS.map((event) => ({ locale, sport: event.sport, slug: event.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, sport, slug } = await params;
  if (!isSportSlug(sport)) return {};
  const event = await eventRepository.getBySlug(sport, slug);
  if (!event) return {};

  const title = `${event.home.team.name} — ${event.away.team.name}`;
  const description = `${event.competition.name}: ${title}. ${formatDate(event.startTime, locale)}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/${sport}/match/${slug}`,
      languages: localeAlternates((l) => `/${l}/${sport}/match/${slug}`),
    },
    openGraph: { title, description, type: "article" },
  };
}

export default async function EventPage({ params }: Props) {
  const { locale, sport, slug } = await params;
  setRequestLocale(locale);
  if (!isSportSlug(sport)) notFound();

  const event = await eventRepository.getBySlug(sport, slug);
  if (!event) notFound();

  const [t, intelligence, lineups, homeInjuries, awayInjuries, relatedNews, articles, headToHead] =
    await Promise.all([
      getTranslations("eventPage"),
      getMatchIntelligence(event.id, locale as AppLocale),
      eventRepository.getLineups(event.id),
      eventRepository.getInjuriesForTeam(event.home.team.id, locale as AppLocale),
      eventRepository.getInjuriesForTeam(event.away.team.id, locale as AppLocale),
      newsRepository.listBySport(sport, 20, locale as AppLocale),
      articleRepository.listAll(locale as AppLocale),
      eventRepository.getHeadToHead(event.home.team.id, event.away.team.id, event.id),
    ]);

  const homeLineup = lineups.find((l) => l.teamId === event.home.team.id);
  const awayLineup = lineups.find((l) => l.teamId === event.away.team.id);
  const injuries = [...homeInjuries, ...awayInjuries];

  const matchNews = relatedNews
    .filter(
      (n) =>
        n.relatedTeamIds?.includes(event.home.team.id) ||
        n.relatedTeamIds?.includes(event.away.team.id)
    )
    .slice(0, 3);

  // Prefer articles written specifically about this fixture; if none
  // exist (most matches — there are only a handful of hand-written
  // pieces total), fall back to other analysis for the same sport so
  // the section has real, on-topic reading for every match rather than
  // only the handful of events an article happens to name-check.
  const articlesForEvent = articles.filter((a) => a.relatedEventIds?.includes(event.id));
  const articlesForSport = articles.filter(
    (a) => a.sport === sport && !articlesForEvent.some((e) => e.id === a.id)
  );
  const relatedArticles = [...articlesForEvent, ...articlesForSport].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${event.home.team.name} vs ${event.away.team.name}`,
    startDate: event.startTime,
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : event.status === "postponed"
          ? "https://schema.org/EventPostponed"
          : "https://schema.org/EventScheduled",
    location: event.venue ? { "@type": "Place", name: event.venue } : undefined,
    competitor: [
      { "@type": "SportsTeam", name: event.home.team.name },
      { "@type": "SportsTeam", name: event.away.team.name },
    ],
    superEvent: { "@type": "SportsEvent", name: event.competition.name },
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Card className="p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--muted)]">
          <span>
            {t("tournament")}: <span className="text-white">{event.competition.name}</span>
          </span>
          <div className="flex items-center gap-2">
            <StatusPill status={event.status} />
            <FavoriteEventButton eventId={event.id} matchLabel={`${event.home.team.name} — ${event.away.team.name}`} />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <TeamBlock
            name={event.home.team.name}
            score={event.home.score}
            form={event.home.team.form}
            href={`/${sport}/team/${event.home.team.slug}`}
            t={t}
          />
          <div className="text-center text-sm text-[var(--muted)]">
            <div className="text-lg font-semibold text-white">
              <LocalDateTime iso={event.startTime} locale={locale} mode="date" />
            </div>
            <div>
              <LocalDateTime iso={event.startTime} locale={locale} mode="time" />
            </div>
          </div>
          <TeamBlock
            name={event.away.team.name}
            score={event.away.score}
            form={event.away.team.form}
            href={`/${sport}/team/${event.away.team.slug}`}
            align="right"
            t={t}
          />
        </div>

        {event.status === "scheduled" && (
          <div className="mt-5 flex justify-center border-t border-white/10 pt-5">
            <Countdown startTime={event.startTime} variant="boxes" />
          </div>
        )}

        {event.venue && (
          <div className="mt-4 border-t border-white/10 pt-3 text-center text-xs text-[var(--muted)]">
            {t("venue")}: {event.venue}
          </div>
        )}
      </Card>

      {injuries.length > 0 && (
        <Card className="p-5">
          <h3 className="mb-3 text-base font-semibold text-white">{t("injuryReport")}</h3>
          <ul className="space-y-2">
            {injuries.map((injury) => (
              <li key={injury.id} className="text-sm text-[var(--muted)]">
                <span className="font-medium text-slate-200">
                  {injury.impact === "high" ? "⚠️ " : ""}
                </span>
                {injury.description}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {intelligence.insights.length > 0 && <IntelligencePanel insights={intelligence.insights} />}

      {intelligence.prediction && (
        <PredictionBlock
          prediction={intelligence.prediction}
          homeTeamName={event.home.team.name}
          awayTeamName={event.away.team.name}
          markets={buildPredictionMarkets(intelligence.prediction, sport)}
        />
      )}

      <TeamComparisonPanel
        homeTeam={event.home.team}
        awayTeam={event.away.team}
        statistics={intelligence.statistics}
        headToHead={headToHead}
        locale={locale}
      />

      <LineupPanel
        homeLineup={homeLineup}
        awayLineup={awayLineup}
        homeName={event.home.team.name}
        awayName={event.away.team.name}
      />

      {matchNews.length > 0 && (
        <section>
          <SectionHeading title={t("news")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {matchNews.map((news) => (
              <NewsCard key={news.id} news={news} sport={sport} />
            ))}
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section>
          <SectionHeading title={t("related")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {relatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TeamBlock({
  name,
  score,
  form,
  href,
  align = "left",
  t,
}: {
  name: string;
  score?: number;
  form?: ("W" | "D" | "L")[];
  href: string;
  align?: "left" | "right";
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <Link
        href={href}
        className="text-lg font-semibold text-white transition-colors hover:text-[var(--accent)] sm:text-xl"
      >
        {name}
      </Link>
      {score !== undefined && <div className="mt-1 text-3xl font-bold text-white">{score}</div>}
      <div className={`mt-2 flex items-center gap-2 ${align === "right" ? "justify-end" : ""}`}>
        <span className="text-xs text-[var(--muted)]">{t("form")}:</span>
        <FormStrip form={form} />
      </div>
    </div>
  );
}
