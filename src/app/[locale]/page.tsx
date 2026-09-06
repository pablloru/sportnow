import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getHomePageData } from "@/lib/services/home.service";
import { localeAlternates } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SportCategoryGrid } from "@/components/home/SportCategoryGrid";
import { EventCard } from "@/components/event/EventCard";
import { NewsCard } from "@/components/home/NewsCard";
import { PredictionMiniCard } from "@/components/home/PredictionMiniCard";
import { TodayInsights } from "@/components/home/TodayInsights";
import { QuickNav } from "@/components/home/QuickNav";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("defaultTitle"),
    description: t("defaultDescription"),
    alternates: { canonical: `/${locale}`, languages: localeAlternates((l) => `/${l}`) },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tSports = await getTranslations("sports");
  const { sports, upcoming, popular, latestNews, predictions, todayInsights } =
    await getHomePageData(locale as AppLocale);

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6">
      <QuickNav />

      <section className="bg-dot-grid relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12">
        <div
          className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[var(--brand)]/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[rgba(var(--brand-rgb),0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#ff9a5c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            {tSports("football.shortName")} · {tSports("hockey.shortName")} · {tSports("tennis.shortName")} · +4
          </span>
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 text-base text-[var(--muted)] sm:text-lg">{t("heroSubtitle")}</p>
        </div>
      </section>

      <section>
        <SectionHeading title={t("sectionCategories")} />
        <SportCategoryGrid sports={sports} />
      </section>

      {todayInsights.length > 0 && (
        <section id="section-today" className="scroll-mt-32">
          <SectionHeading title={t("sectionToday")} />
          <TodayInsights insights={todayInsights} />
        </section>
      )}

      <section id="section-upcoming" className="scroll-mt-32">
        <SectionHeading title={t("sectionUpcoming")} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {popular.length > 0 && (
        <section>
          <SectionHeading title={t("sectionPopular")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </div>
        </section>
      )}

      {predictions.length > 0 && (
        <section id="section-predictions" className="scroll-mt-32">
          <SectionHeading title={t("sectionPredictions")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {predictions.map(
              ({ event, prediction }) =>
                prediction && <PredictionMiniCard key={event.id} event={event} prediction={prediction} />
            )}
          </div>
        </section>
      )}

      <section id="section-news" className="scroll-mt-32">
        <SectionHeading title={t("sectionNews")} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>
    </div>
  );
}
