import { useTranslations } from "next-intl";
import type { IntelligenceInsight } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const IMPORTANCE_TONE = { high: "danger", medium: "warning", low: "neutral" } as const;

export function TodayInsights({ insights }: { insights: IntelligenceInsight[] }) {
  const tImportance = useTranslations("importance");
  if (insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {insights.map((insight) => (
        <Card key={insight.id} className="p-4">
          <Badge tone={IMPORTANCE_TONE[insight.importance]} className="mb-2">
            {tImportance(insight.importance)}
          </Badge>
          <p className="text-sm font-semibold text-white">{insight.headline}</p>
          <p className="mt-1 line-clamp-3 text-xs text-[var(--muted)]">{insight.explanation}</p>
        </Card>
      ))}
    </div>
  );
}
