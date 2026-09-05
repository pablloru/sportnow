import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { eventRepository } from "@/lib/repositories/event.repository";
import { newsRepository } from "@/lib/repositories/news.repository";
import { articleRepository } from "@/lib/repositories/article.repository";
import { teamRepository } from "@/lib/repositories/team.repository";
import { routing, type AppLocale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { SearchClient } from "@/components/search/SearchClient";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  return {
    title: t("title"),
    alternates: { canonical: `/${locale}/search`, languages: localeAlternates((l) => `/${l}/search`) },
    // A filter/utility page, not editorial content — keep it out of the
    // index the same way most site-search pages do.
    robots: { index: false, follow: true },
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function SearchPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [events, news, articles, teams] = await Promise.all([
    eventRepository.listAll(),
    newsRepository.listAll(locale as AppLocale),
    articleRepository.listAll(locale as AppLocale),
    teamRepository.listAll(),
  ]);

  return <SearchClient events={events} news={news} articles={articles} teams={teams} />;
}
