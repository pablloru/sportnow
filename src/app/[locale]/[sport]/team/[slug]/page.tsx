import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isSportSlug } from "@/lib/constants";
import { teamRepository } from "@/lib/repositories/team.repository";
import { TEAMS } from "@/lib/mock-data";
import { routing, type AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/lib/seo";
import { tallyForm } from "@/lib/team-comparison";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SportIcon } from "@/components/ui/SportIcon";
import { FormStrip } from "@/components/event/FormStrip";
import { EventCard } from "@/components/event/EventCard";
import { NewsCard } from "@/components/home/NewsCard";
import { RosterGrid } from "@/components/team/RosterGrid";
import { BackLink } from "@/components/ui/BackLink";
import { FavoriteTeamButton } from "@/components/team/FavoriteTeamButton";

type Props = { params: Promise<{ locale: string; sport: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    TEAMS.map((team) => ({ locale, sport: team.sport, slug: team.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, sport, slug } = await params;
  if (!isSportSlug(sport)) return {};
  const team = await teamRepository.getBySlug(sport, slug);
  if (!team) return {};

  const tSports = await getTranslations({ locale, namespace: "sports" });
  const tTeamPage = await getTranslations({ locale, namespace: "teamPage" });
  const title = team.name;
  const description = tTeamPage("metaDescription", { name: team.name, sport: tSports(`${sport}.name`) });

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/${sport}/team/${slug}`,
      languages: localeAlternates((l) => `/${l}/${sport}/team/${slug}`),
    },
    openGraph: { title, description, type: "profile" },
  };
}

export default async function TeamPage({ params }: Props) {
  const { locale, sport, slug } = await params;
  setRequestLocale(locale);
  if (!isSportSlug(sport)) notFound();

  const team = await teamRepository.getBySlug(sport, slug);
  if (!team) notFound();

  const [t, tSport, tSports, tCommon, tComparison, roster, events, news] = await Promise.all([
    getTranslations("teamPage"),
    getTranslations("sportPage"),
    getTranslations("sports"),
    getTranslations("common"),
    getTranslations("comparison"),
    teamRepository.getRoster(team.id),
    teamRepository.getEvents(team.id),
    teamRepository.getNews(team.id, 6, locale as AppLocale),
  ]);

  const upcoming = events
    .filter((e) => e.status === "scheduled")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 6);
  const finished = events.filter((e) => e.status === "finished").slice(0, 6);

  const tally = tallyForm(team.form);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    sport: sport,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackLink href={`/${sport}`} label={tCommon("backToSport")} />

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(var(--brand-rgb),0.14)] text-sm font-bold text-[var(--brand)]">
              {team.shortName.slice(0, 3)}
            </span>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--brand)]">
                <SportIcon sport={sport} className="h-3.5 w-3.5" />
                {tSports(`${sport}.shortName`)}
              </div>
              <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
                {team.name}
              </h1>
              {team.country && <p className="text-sm text-[var(--muted)]">{team.country}</p>}
            </div>
            <FavoriteTeamButton teamId={team.id} teamName={team.name} />
          </div>
          {team.form && team.form.length > 0 && (
            <div className="text-right">
              <FormStrip form={team.form} />
              <p className="mt-1.5 text-xs text-[var(--muted)]">
                {tally.wins}
                {tComparison("winsShort")}-{tally.draws}
                {tComparison("drawsShort")}-{tally.losses}
                {tComparison("lossesShort")}
              </p>
            </div>
          )}
        </div>
      </Card>

      {upcoming.length > 0 && (
        <section>
          <SectionHeading title={tSport("upcoming")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {finished.length > 0 && (
        <section>
          <SectionHeading
            title={tSport("results")}
            action={
              <Link
                href={{ pathname: "/results", query: { sport, q: team.name } }}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {t("seeAllResults")} →
              </Link>
            }
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {finished.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {roster.length > 0 && (
        <section>
          <SectionHeading title={t("roster")} />
          <RosterGrid players={roster} sport={sport} />
        </section>
      )}

      {news.length > 0 && (
        <section>
          <SectionHeading title={tSport("news")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} sport={sport} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
