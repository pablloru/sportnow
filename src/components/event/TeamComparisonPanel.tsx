import { useTranslations } from "next-intl";
import type { EventStatistic, SportEvent, Team } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { FormStrip } from "@/components/event/FormStrip";
import { tallyForm, summarizeHeadToHead } from "@/lib/team-comparison";
import { LocalDateTime } from "@/components/ui/LocalDateTime";

/**
 * "Compare the two teams before the match" block: recent form, historical
 * head-to-head record, and whatever curated EventStatistic rows exist for
 * this event — all in one card instead of split across the hero and a
 * separate stats card. Returns null if there is nothing at all to show
 * (no form, no history, no stats), same convention as StatisticsPanel.
 */
export function TeamComparisonPanel({
  homeTeam,
  awayTeam,
  statistics,
  headToHead,
  locale,
}: {
  homeTeam: Team;
  awayTeam: Team;
  statistics: EventStatistic[];
  headToHead: SportEvent[];
  locale: string;
}) {
  const t = useTranslations("comparison");
  const homeTally = tallyForm(homeTeam.form);
  const awayTally = tallyForm(awayTeam.form);
  const h2h = summarizeHeadToHead(headToHead, homeTeam.id);

  const hasForm = (homeTeam.form?.length ?? 0) > 0 || (awayTeam.form?.length ?? 0) > 0;
  if (!hasForm && statistics.length === 0 && headToHead.length === 0) return null;

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-base font-semibold text-white">{t("title")}</h3>

      {hasForm && (
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            {t("recentForm")}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormStrip form={homeTeam.form} />
              <p className="mt-1.5 text-xs text-[var(--muted)]">
                {homeTally.wins}
                {t("winsShort")}-{homeTally.draws}
                {t("drawsShort")}-{homeTally.losses}
                {t("lossesShort")}
              </p>
            </div>
            <div className="text-right">
              <div className="flex justify-end">
                <FormStrip form={awayTeam.form} />
              </div>
              <p className="mt-1.5 text-xs text-[var(--muted)]">
                {awayTally.wins}
                {t("winsShort")}-{awayTally.draws}
                {t("drawsShort")}-{awayTally.losses}
                {t("lossesShort")}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className={hasForm ? "mt-5 border-t border-white/10 pt-5" : ""}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            {t("headToHead")}
          </p>
          {headToHead.length > 0 && (
            <span className="text-xs text-[var(--muted)]">
              {t("meetingsCount", { count: headToHead.length })}
            </span>
          )}
        </div>

        {headToHead.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">{t("noMeetings")}</p>
        ) : (
          <>
            <div className="mb-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="text-lg font-bold text-[var(--accent)]">{h2h.wins}</div>
                <div className="truncate text-xs text-[var(--muted)]">{homeTeam.shortName}</div>
              </div>
              {h2h.draws > 0 ? (
                <div>
                  <div className="text-lg font-bold text-slate-300">{h2h.draws}</div>
                  <div className="text-xs text-[var(--muted)]">{t("draws")}</div>
                </div>
              ) : (
                <div />
              )}
              <div>
                <div className="text-lg font-bold text-[var(--accent-2)]">{h2h.losses}</div>
                <div className="truncate text-xs text-[var(--muted)]">{awayTeam.shortName}</div>
              </div>
            </div>

            <ul className="space-y-1.5">
              {headToHead.slice(0, 5).map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between text-xs text-[var(--muted)]"
                >
                  <LocalDateTime iso={event.startTime} locale={locale} mode="date" />
                  <span className="font-medium text-slate-200">
                    {event.home.team.shortName} {event.home.score}:{event.away.score}{" "}
                    {event.away.team.shortName}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {statistics.length > 0 && (
        <section className="mt-5 border-t border-white/10 pt-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            {t("keyStats")}
          </p>
          <div className="space-y-3">
            {statistics.map((stat) => (
              <div key={stat.id} className="flex items-center gap-3 text-sm">
                <span className="w-12 shrink-0 text-right font-semibold text-white">
                  {stat.homeValue}
                </span>
                <span className="flex-1 text-center text-xs text-[var(--muted)]">{stat.label}</span>
                <span className="w-12 shrink-0 text-left font-semibold text-white">
                  {stat.awayValue}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </Card>
  );
}
