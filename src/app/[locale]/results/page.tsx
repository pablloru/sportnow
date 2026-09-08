import type { Metadata } from "next";
import { Suspense } from "react";
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
};

// `sport`/`q` used to be read here via searchParams, which forces
// per-request rendering and rules out static export. ResultsClient now
// reads them itself via useSearchParams() — that hook requires a
// Suspense boundary, which is what makes this whole route static
// again (Next resolves the boundary at build time; the search-params
// dependent bit fills in client-side on hydration, from an
// already-loaded, already-filtered dataset, so there's nothing
// meaningful for the fallback to cover).
export default async function ResultsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allEvents = await eventRepository.listAll();
  const finished = allEvents
    .filter((e) => e.status === "finished")
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <Suspense fallback={null}>
      <ResultsClient events={finished} />
    </Suspense>
  );
}
