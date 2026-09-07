import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { News } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { LocalDateTime } from "@/components/ui/LocalDateTime";

export function NewsCard({ news, sport }: { news: News; sport?: string }) {
  const locale = useLocale();
  const t = useTranslations("sports");

  return (
    <Link href={`/news/${news.slug}`}>
      <Card hoverable className="flex h-full flex-col overflow-hidden">
        {news.image && (
          <div className="relative h-36 w-full overflow-hidden bg-[rgba(var(--ink-rgb),0.05)]">
            <Image
              src={news.image}
              alt={news.title}
              fill
              sizes="(min-width: 1024px) 320px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--brand)]">
            {t(`${sport ?? news.sport}.shortName`)}
          </span>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--foreground)]">{news.title}</h3>
          <p className="line-clamp-2 flex-1 text-sm text-[var(--muted)]">{news.excerpt}</p>
          <div className="flex items-center justify-between pt-1 text-xs text-[var(--muted)]">
            <span>{news.source.name}</span>
            <LocalDateTime iso={news.publishedAt} locale={locale} mode="eventDateTime" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
