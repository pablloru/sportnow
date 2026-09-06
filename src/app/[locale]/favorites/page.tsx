import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { eventRepository } from "@/lib/repositories/event.repository";
import { teamRepository } from "@/lib/repositories/team.repository";
import { routing } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { FavoritesClient } from "@/components/favorites/FavoritesClient";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "favoritesPage" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/favorites`, languages: localeAlternates((l) => `/${l}/favorites`) },
    // Personalized, browser-only content (localStorage) — nothing here
    // is worth indexing, same reasoning as the search page.
    robots: { index: false, follow: true },
  };
}

type Props = { params: Promise<{ locale: string }> };

/** The dedicated favorites directory: every team and event the visitor
 * has starred, in one place, reached from the header's star icon.
 * Fetches the full team/event catalogs here on the server so the
 * client component only has to filter by the ids it reads from
 * localStorage — it never needs its own data-fetching effect. */
export default async function FavoritesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [teams, events] = await Promise.all([teamRepository.listAll(), eventRepository.listAll()]);

  return <FavoritesClient teams={teams} events={events} />;
}
