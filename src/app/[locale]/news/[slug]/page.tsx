import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { newsRepository } from "@/lib/repositories/news.repository";
import { teamRepository } from "@/lib/repositories/team.repository";
import { NEWS } from "@/lib/mock-data";
import { routing, type AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LocalDateTime } from "@/components/ui/LocalDateTime";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => NEWS.map((news) => ({ locale, slug: news.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const news = await newsRepository.getBySlug(slug, locale as AppLocale);
  if (!news) return {};

  return {
    title: news.title,
    description: news.excerpt,
    alternates: {
      canonical: `/${locale}/news/${slug}`,
      languages: localeAlternates((l) => `/${l}/news/${slug}`),
    },
    openGraph: {
      title: news.title,
      description: news.excerpt,
      type: "article",
      publishedTime: news.publishedAt,
      images: news.image ? [news.image] : undefined,
    },
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, tArticle, tSports, news] = await Promise.all([
    getTranslations("newsPage"),
    getTranslations("articlePage"),
    getTranslations("sports"),
    newsRepository.getBySlug(slug, locale as AppLocale),
  ]);
  if (!news) notFound();

  const sportTeams = await teamRepository.listBySport(news.sport);
  const relatedTeams = sportTeams.filter((team) => news.relatedTeamIds?.includes(team.id));

  const paragraphs = news.content.split("\n\n");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description: news.excerpt,
    image: news.image,
    datePublished: news.publishedAt,
    dateModified: news.updatedAt,
    publisher: { "@type": "Organization", name: news.source.name },
  };

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{tSports(`${news.sport}.shortName`)}</Badge>
          <Badge tone="warning">{tArticle("demoLabel")}</Badge>
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {news.title}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
          <span className="font-medium text-slate-300">{news.source.name}</span>
          <span>
            {tArticle("publishedOn")} <LocalDateTime iso={news.publishedAt} locale={locale} mode="date" />
          </span>
          {news.updatedAt !== news.publishedAt && (
            <span>
              {tArticle("updatedOn")} <LocalDateTime iso={news.updatedAt} locale={locale} mode="date" />
            </span>
          )}
        </div>
      </header>

      {news.image && (
        <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-white/5 sm:h-96">
          <Image src={news.image} alt={news.title} fill priority className="object-cover" />
        </div>
      )}

      <div className="space-y-4">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="leading-relaxed text-[var(--muted)]">
            {paragraph}
          </p>
        ))}
      </div>

      {relatedTeams.length > 0 && (
        <Card className="p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            {t("relatedTeams")}
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedTeams.map((team) => (
              <Link
                key={team.id}
                href={`/${team.sport}/team/${team.slug}`}
                className="rounded-full bg-white/5 px-3.5 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                {team.name}
              </Link>
            ))}
          </div>
        </Card>
      )}

    </article>
  );
}
