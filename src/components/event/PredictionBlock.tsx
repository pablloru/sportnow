import { useTranslations } from "next-intl";
import type { Prediction } from "@/lib/types";
import type { PredictionMarket } from "@/lib/prediction-markets";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PredictionMarkets } from "@/components/event/PredictionMarkets";

export function PredictionBlock({
  prediction,
  homeTeamName,
  awayTeamName,
  markets,
}: {
  prediction: Prediction;
  homeTeamName: string;
  awayTeamName: string;
  /** Secondary outcome markets (total, handicap, BTTS, ...) — omitted
   * where there's no sport context to build them from (e.g. the article
   * page's embed), in which case that section just doesn't render. */
  markets?: PredictionMarket[];
}) {
  const t = useTranslations("eventPage");
  const { homeWinPct, drawPct, awayWinPct } = prediction;
  const likelyOutcome = describeLikelyOutcome(prediction, homeTeamName, awayTeamName, t);
  // Same underlying facts as the percentage bar above, read as one
  // paragraph instead of a bullet list — each factor is already a full
  // sentence (see buildPrediction() in scripts/fetch-real-events.mjs and
  // the hand-written mock predictions), so joining them reads naturally.
  const rationale = prediction.factors.map((factor) => factor.detail).join(" ");

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(var(--brand-rgb),0.16)] text-[var(--brand)]">
            <SparkleIcon />
          </span>
          <h3 className="text-base font-semibold text-[var(--foreground)]">{t("predictionTitle")}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {prediction.isDemo && <Badge tone="warning">Demo</Badge>}
        </div>
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[rgba(var(--ink-rgb),0.05)]">
        <div
          className="h-full bg-[var(--accent)] transition-[width] duration-700 ease-out"
          style={{ width: `${homeWinPct}%` }}
        />
        {drawPct !== undefined && (
          <div
            className="h-full bg-[rgba(var(--ink-rgb),0.25)] transition-[width] duration-700 ease-out"
            style={{ width: `${drawPct}%` }}
          />
        )}
        <div
          className="h-full bg-[var(--accent-2)] transition-[width] duration-700 ease-out"
          style={{ width: `${awayWinPct}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <PctColumn label={homeTeamName} sub={t("homeWin")} value={homeWinPct} color="text-[var(--accent)]" />
        {drawPct !== undefined ? (
          <PctColumn label={t("draw")} value={drawPct} color="text-[var(--foreground-dim)]" />
        ) : (
          <div />
        )}
        <PctColumn label={awayTeamName} sub={t("awayWin")} value={awayWinPct} color="text-[var(--accent-2)]" />
      </div>

      {markets && markets.length > 0 && (
        <PredictionMarkets markets={markets} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />
      )}

      <div className="mt-5 space-y-3 rounded-xl bg-[rgba(var(--ink-rgb),0.04)] p-4">
        <p className="text-sm leading-relaxed text-[var(--foreground-soft)]">
          <span className="font-semibold text-[var(--foreground)]">{t("predictionLikelyOutcomeLabel")}</span>
          {" — "}
          {likelyOutcome}.
        </p>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">{t("predictionRationaleLabel")}</span>
          {" — "}
          {rationale}
        </p>
      </div>

      <p className="mt-4 border-t border-[rgba(var(--ink-rgb),0.1)] pt-3 text-xs leading-relaxed text-[var(--muted)] opacity-60">
        {t("predictionDisclaimer")}
      </p>
    </Card>
  );
}

/**
 * Which single outcome the percentages favor, as one line of prose —
 * "победа {team} (П1)" / "ничья (Х)" / "победа {team} (П2)" in Russian
 * (the "(П1)/(Х)/(П2)" 1X2 shorthand only for sports with a draw market;
 * the English copy omits it, since that notation isn't idiomatic there).
 */
function describeLikelyOutcome(
  prediction: Prediction,
  homeTeamName: string,
  awayTeamName: string,
  t: ReturnType<typeof useTranslations>
): string {
  const { homeWinPct, drawPct, awayWinPct } = prediction;
  // The "(П1)/(Х)/(П2)" 1X2 shorthand only makes sense where a draw is
  // an actual outcome (football here) — for a win-only sport it's just
  // noise, so it's left off entirely rather than showing e.g. "(П1)" on
  // a market that never had a Х to begin with.
  const hasDrawMarket = drawPct !== undefined;

  const candidates = [
    {
      pct: homeWinPct,
      text: t("predictionOutcomeHome", { team: homeTeamName }),
      code: hasDrawMarket ? t("predictionOutcomeCodeHome") : "",
    },
    {
      pct: awayWinPct,
      text: t("predictionOutcomeAway", { team: awayTeamName }),
      code: hasDrawMarket ? t("predictionOutcomeCodeAway") : "",
    },
  ];
  if (hasDrawMarket) {
    candidates.push({ pct: drawPct, text: t("predictionOutcomeDraw"), code: t("predictionOutcomeCodeDraw") });
  }

  const best = candidates.reduce((a, b) => (b.pct > a.pct ? b : a));
  return best.code ? `${best.text} (${best.code})` : best.text;
}

function SparkleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.5c.3 2.9 1 5 2.1 6.1S17.6 10.4 20.5 10.7c-2.9.3-5 1-6.4 2.4S12 16.8 11.7 19.7c-.3-2.9-1-5-2.4-6.4S6 11.9 3.1 11.6c2.9-.3 5-1 6.4-2.4S11.7 5.4 12 2.5Z" />
    </svg>
  );
}

function PctColumn({
  label,
  sub,
  value,
  color,
}: {
  label: string;
  sub?: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className={`text-lg font-bold ${color}`}>{value}%</div>
      <div className="truncate text-xs text-[var(--muted)]">{sub ?? label}</div>
      {sub && <div className="truncate text-xs font-medium text-[var(--foreground-dim)]">{label}</div>}
    </div>
  );
}
