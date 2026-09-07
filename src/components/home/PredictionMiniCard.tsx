import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Prediction, SportEvent } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function PredictionMiniCard({
  event,
  prediction,
}: {
  event: SportEvent;
  prediction: Prediction;
}) {
  const t = useTranslations("eventPage");

  return (
    <Link href={`/${event.sport}/match/${event.slug}`}>
      <Card hoverable className="flex h-full flex-col gap-3 p-4">
        <span className="truncate text-xs font-medium text-[var(--muted)]">
          {event.home.team.shortName} — {event.away.team.shortName}
        </span>
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-[rgba(var(--ink-rgb),0.05)]">
          <div className="h-full bg-[var(--accent)]" style={{ width: `${prediction.homeWinPct}%` }} />
          {prediction.drawPct !== undefined && (
            <div className="h-full bg-[rgba(var(--ink-rgb),0.25)]" style={{ width: `${prediction.drawPct}%` }} />
          )}
          <div className="h-full bg-[var(--accent-2)]" style={{ width: `${prediction.awayWinPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-[var(--muted)]">
          <span>
            {t("homeWin")} <span className="font-semibold text-[var(--foreground)]">{prediction.homeWinPct}%</span>
          </span>
          <span>
            {t("awayWin")} <span className="font-semibold text-[var(--foreground)]">{prediction.awayWinPct}%</span>
          </span>
        </div>
      </Card>
    </Link>
  );
}
