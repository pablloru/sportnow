import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Sport } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { SportIcon } from "@/components/ui/SportIcon";

export function SportCategoryGrid({ sports }: { sports: Sport[] }) {
  const t = useTranslations("sports");

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {sports.map((sport) => (
        <Link key={sport.slug} href={`/${sport.slug}`}>
          <Card
            hoverable
            className="group flex flex-col items-center justify-center gap-2.5 p-5 text-center hover:shadow-[0_0_0_1px_rgba(var(--brand-rgb),0.35)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(var(--brand-rgb),0.12)] text-[var(--brand)] transition-colors group-hover:bg-[var(--brand)] group-hover:text-[var(--brand-ink)]">
              <SportIcon sport={sport.slug} className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium text-white">{t(`${sport.slug}.shortName`)}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
