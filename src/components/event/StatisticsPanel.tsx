import { useTranslations } from "next-intl";
import type { EventStatistic } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function StatisticsPanel({ statistics }: { statistics: EventStatistic[] }) {
  const t = useTranslations("eventPage");
  if (statistics.length === 0) return null;

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-base font-semibold text-[var(--foreground)]">{t("statistics")}</h3>
      <div className="space-y-3">
        {statistics.map((stat) => (
          <div key={stat.id} className="flex items-center gap-3 text-sm">
            <span className="w-12 shrink-0 text-right font-semibold text-[var(--foreground)]">{stat.homeValue}</span>
            <span className="flex-1 text-center text-xs text-[var(--muted)]">{stat.label}</span>
            <span className="w-12 shrink-0 text-left font-semibold text-[var(--foreground)]">{stat.awayValue}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
