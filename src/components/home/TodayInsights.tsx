import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { IntelligenceInsight, SportEvent } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SportIcon } from "@/components/ui/SportIcon";

const IMPORTANCE_TONE = { high: "danger", medium: "warning", low: "neutral" } as const;

/** Each insight is paired with the match it's about (see home.service),
 * so the card can always show *which* match this concerns and link
 * straight to it — "the home team's striker will miss the match" is
 * meaningless without that context, however specific the explanation
 * text underneath already is. */
export function TodayInsights({
  insights,
}: {
  insights: { insight: IntelligenceInsight; event: SportEvent }[];
}) {
  const tImportance = useTranslations("importance");
  if (insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {insights.map(({ insight, event }) => (
        <Link key={insight.id} href={`/${event.sport}/match/${event.slug}`}>
          <Card hoverable className="flex h-full flex-col gap-2.5 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-[var(--muted)]">
                <SportIcon sport={event.sport} className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />
                <span className="truncate">
                  {event.home.team.shortName} — {event.away.team.shortName}
                </span>
              </span>
              <Badge tone={IMPORTANCE_TONE[insight.importance]} className="shrink-0">
                {tImportance(insight.importance)}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-white">{insight.headline}</p>
            <p className="line-clamp-3 text-xs text-[var(--muted)]">{insight.explanation}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
