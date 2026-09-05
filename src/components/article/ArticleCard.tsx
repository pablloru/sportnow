import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { LocalDateTime } from "@/components/ui/LocalDateTime";

export function ArticleCard({ article }: { article: Article }) {
  const locale = useLocale();
  const t = useTranslations("sports");

  return (
    <Link href={`/article/${article.slug}`}>
      <Card hoverable className="flex h-full flex-col overflow-hidden">
        {article.image && (
          <div className="relative h-40 w-full overflow-hidden bg-white/5">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--brand)]">
            {article.category} · {t(`${article.sport}.shortName`)}
          </span>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white">
            {article.title}
          </h3>
          <p className="line-clamp-2 flex-1 text-sm text-[var(--muted)]">{article.excerpt}</p>
          <span className="pt-1 text-xs text-[var(--muted)]">
            <LocalDateTime iso={article.publishedAt} locale={locale} mode="date" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
