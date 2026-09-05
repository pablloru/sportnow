import { useTranslations } from "next-intl";
import type { IntelligenceInsight } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const IMPORTANCE_TONE = {
  high: "danger",
  medium: "warning",
  low: "neutral",
} as const;

export function IntelligencePanel({ insights }: { insights: IntelligenceInsight[] }) {
  const t = useTranslations("eventPage");
  const tImportance = useTranslations("importance");
  const tCommon = useTranslations("common");

  if (insights.length === 0) return null;

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-base font-semibold text-white">{t("whatChanged")}</h3>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="border-l-2 border-white/10 pl-4">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Badge tone={IMPORTANCE_TONE[insight.importance]}>
                {tImportance(insight.importance)}
              </Badge>
              <span className="text-xs text-[var(--muted)]">
                {tCommon("source")}: {insight.source.name}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">{insight.headline}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              {t("whyItMatters")}
            </p>
            <p className="mt-0.5 text-sm text-[var(--muted)]">{insight.explanation}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
