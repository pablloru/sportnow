import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { eventRepository } from "@/lib/repositories/event.repository";
import { routing } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { ResultsClient } from "@/components/results/ResultsClient";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resultsPage" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: { canonical: `/${locale}/results`, languages: localeAlternates((l) => `/${l}/results`) },
  };
}

type Props = {
  params: Promise<{ locale: string }>;
  // Reading searchParams here (rather than via the client useSearchParams
  // hook) opts just this route into per-request rendering instead of full
  // static generation — the simplest way to seed the results filters from
  // a "see all" link on a sport/team page without a Suspense boundary.
  searchParams: Promise<{ sport?: string; q?: string }>;
};

export default async function ResultsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { sport, q } = await searchParams;
  setRequestLocale(locale);

  const allEvents = await eventRepository.listAll();
  const finished = allEvents
    .filter((e) => e.status === "finished")
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return <ResultsClient events={finished} initialSport={sport} initialQuery={q} />;
}
