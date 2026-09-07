import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { articleRepository } from "@/lib/repositories/article.repository";
import { eventRepository } from "@/lib/repositories/event.repository";
import { intelligenceRepository } from "@/lib/repositories/intelligence.repository";
import { ARTICLES } from "@/lib/mock-data";
import { routing, type AppLocale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/event/EventCard";
import { ArticleCard } from "@/components/article/ArticleCard";
import { PredictionBlock } from "@/components/event/PredictionBlock";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ARTICLES.map((article) => ({ locale, slug: article.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await articleRepository.getBySlug(slug, locale as AppLocale);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/${locale}/article/${slug}`,
      languages: localeAlternates((l) => `/${l}/article/${slug}`),
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, tSports, article] = await Promise.all([
    getTranslations("articlePage"),
    getTranslations("sports"),
    articleRepository.getBySlug(slug, locale as AppLocale),
  ]);
  if (!article) notFound();

  const [relatedEvents, allArticles] = await Promise.all([
    Promise.all(
      (article.relatedEventIds ?? []).map((id) =>
        eventRepository.listBySport(article.sport).then((events) => events.find((e) => e.id === id))
      )
    ),
    articleRepository.listAll(locale as AppLocale),
  ]);

  const firstRelatedEvent = relatedEvents.find(Boolean);
  const prediction = firstRelatedEvent
    ? await intelligenceRepository.getPrediction(firstRelatedEvent.id, locale as AppLocale)
    : undefined;

  const relatedArticles = allArticles.filter((a) => article.relatedArticleSlugs?.includes(a.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: article.author ? { "@type": "Organization", name: article.author } : undefined,
  };

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{article.category}</Badge>
          <Badge>{tSports(`${article.sport}.shortName`)}</Badge>
          <Badge tone="warning">{t("demoLabel")}</Badge>
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl">
          {article.title}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
          <span>
            {t("publishedOn")} <LocalDateTime iso={article.publishedAt} locale={locale} mode="date" />
          </span>
          {article.updatedAt !== article.publishedAt && (
            <span>
              {t("updatedOn")} <LocalDateTime iso={article.updatedAt} locale={locale} mode="date" />
            </span>
          )}
          {article.author && <span>{article.author}</span>}
        </div>
      </header>

      {article.image && (
        <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-[rgba(var(--ink-rgb),0.05)] sm:h-96">
          <Image src={article.image} alt={article.title} fill priority className="object-cover" />
        </div>
      )}

      <p className="text-lg font-medium leading-relaxed text-[var(--foreground-soft)]">{article.intro}</p>

      <div className="space-y-4">
        {article.body.map((paragraph, i) => (
          <p key={i} className="leading-relaxed text-[var(--muted)]">
            {paragraph}
          </p>
        ))}
      </div>

      {article.stats && article.stats.length > 0 && (
        <Card className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
          {article.stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-lg font-bold text-[var(--foreground)]">{stat.value}</div>
              <div className="text-xs text-[var(--muted)]">{stat.label}</div>
            </div>
          ))}
        </Card>
      )}

      {firstRelatedEvent && prediction && (
        <PredictionBlock
          prediction={prediction}
          homeTeamName={firstRelatedEvent.home.team.name}
          awayTeamName={firstRelatedEvent.away.team.name}
        />
      )}

      {relatedEvents.filter(Boolean).length > 0 && (
        <section>
          <SectionHeading title={t("relatedEvents")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedEvents.filter(Boolean).map((event) => (
              <EventCard key={event!.id} event={event!} />
            ))}
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section>
          <SectionHeading title={t("relatedArticles")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
