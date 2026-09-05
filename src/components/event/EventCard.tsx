import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EventStatus, SportEvent } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/Badge";
import { Countdown } from "@/components/ui/Countdown";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { SportIcon } from "@/components/ui/SportIcon";

/** Top-edge accent color by status — the same read as a broadcast
 * lower-third: orange means "on deck," green means it's in the books. */
const STATUS_BAR: Record<EventStatus, string> = {
  scheduled: "var(--brand)",
  finished: "var(--positive)",
  postponed: "var(--warning)",
  cancelled: "var(--danger)",
};

export function EventCard({ event, compact = false }: { event: SportEvent; compact?: boolean }) {
  const locale = useLocale();
  const tSport = useTranslations("sportPage");
  const showScore = event.status === "finished";

  return (
    <Link href={`/${event.sport}/match/${event.slug}`}>
      <Card hoverable className="group relative flex h-full flex-col gap-3 overflow-hidden p-4 pt-[18px]">
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: STATUS_BAR[event.status] }}
          aria-hidden
        />

        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-[var(--muted)]">
            <SportIcon sport={event.sport} className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />
            <span className="truncate">{event.competition.name}</span>
          </span>
          <StatusPill status={event.status} />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <TeamRow
            name={event.home.team.name}
            short={event.home.team.shortName}
            score={showScore ? event.home.score : undefined}
            side="home"
          />
          <TeamRow
            name={event.away.team.name}
            short={event.away.team.shortName}
            score={showScore ? event.away.score : undefined}
            side="away"
          />
        </div>

        {event.status === "scheduled" && (
          <div>
            <Countdown startTime={event.startTime} />
          </div>
        )}

        {!compact && (
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-[var(--muted)]">
            <LocalDateTime iso={event.startTime} locale={locale} mode="eventDateTime" />
            <div className="flex gap-1.5">
              {event.hasPrediction && <Badge tone="brand">{tSport("predictions")}</Badge>}
              {event.hasIntelligence && <Badge tone="warning">AI</Badge>}
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
}

function TeamRow({
  name,
  short,
  score,
  side,
}: {
  name: string;
  short: string;
  score?: number;
  side: "home" | "away";
}) {
  const sideColor = side === "home" ? "var(--accent)" : "var(--accent-2)";
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-2 truncate text-sm font-medium text-white">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
          style={{ backgroundColor: `color-mix(in srgb, ${sideColor} 20%, transparent)`, color: sideColor }}
        >
          {short.slice(0, 2)}
        </span>
        <span className="truncate">{name}</span>
      </span>
      {score !== undefined && (
        <span className="font-display text-lg font-bold text-white">{score}</span>
      )}
    </div>
  );
}
