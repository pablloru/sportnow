import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SPORT_SLUGS, isSportSlug } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getSportPageData } from "@/lib/services/sport.service";
import { localeAlternates } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SportIcon } from "@/components/ui/SportIcon";
import { EventCard } from "@/components/event/EventCard";
import { NewsCard } from "@/components/home/NewsCard";
import { ArticleCard } from "@/components/article/ArticleCard";
import { PredictionMiniCard } from "@/components/home/PredictionMiniCard";
import { TeamGrid } from "@/components/team/TeamGrid";

type Props = { params: Promise<{ locale: string; sport: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SPORT_SLUGS.map((sport) => ({ locale, sport }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, sport } = await params;
  if (!isSportSlug(sport)) return {};
  const t = await getTranslations({ locale, namespace: "sports" });
  const tSportPage = await getTranslations({ locale, namespace: "sportPage" });
  const name = t(`${sport}.name`);
  return {
    title: name,
    description: tSportPage("metaDescription", { name }),
    alternates: { canonical: `/${locale}/${sport}`, languages: localeAlternates((l) => `/${l}/${sport}`) },
  };
}

export default async function SportPage({ params }: Props) {
  const { locale, sport } = await params;
  setRequestLocale(locale);
  if (!isSportSlug(sport)) notFound();

  const [t, tSports, data] = await Promise.all([
    getTranslations("sportPage"),
    getTranslations("sports"),
    getSportPageData(sport, locale as AppLocale),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6">
      <section className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(var(--brand-rgb),0.14)] text-[var(--brand)]">
          <SportIcon sport={sport} className="h-6 w-6" />
        </span>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-[var(--foreground)]">
          {tSports(`${sport}.name`)}
        </h1>
      </section>

      {data.popular.length > 0 && (
        <section>
          <SectionHeading title={t("popular")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.popular.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeading title={t("upcoming")} />
        {data.upcoming.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      <section>
        <SectionHeading
          title={t("results")}
          action={
            data.results.length > 0 && (
              <Link
                href={`/results?sport=${sport}`}
                className="text-sm font-medium text-[var(--foreground-dim)] transition-colors hover:text-[var(--foreground)]"
              >
                {t("seeAllResults")} →
              </Link>
            )
          }
        />
        {data.results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.results.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {data.teams.length > 0 && (
        <section>
          <SectionHeading title={t("teams")} />
          <TeamGrid teams={data.teams} />
        </section>
      )}

      {data.predictions.length > 0 && (
        <section>
          <SectionHeading title={t("predictions")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.predictions.map(
              ({ event, prediction }) =>
                prediction && <PredictionMiniCard key={event.id} event={event} prediction={prediction} />
            )}
          </div>
        </section>
      )}

      {data.news.length > 0 && (
        <section>
          <SectionHeading title={t("news")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.news.map((news) => (
              <NewsCard key={news.id} news={news} sport={sport} />
            ))}
          </div>
        </section>
      )}

      {data.articles.length > 0 && (
        <section>
          <SectionHeading title={t("articles")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyState() {
  const t = useTranslations("common");
  return (
    <div className="rounded-2xl border border-dashed border-[rgba(var(--ink-rgb),0.1)] p-8 text-center text-sm text-[var(--muted)]">
      {t("emptyState")}
    </div>
  );
}
