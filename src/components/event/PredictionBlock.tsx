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

      <div className="mt-5 border-t border-[rgba(var(--ink-rgb),0.1)] pt-4">
        <h4 className="mb-2 text-sm font-medium text-[var(--foreground)]">{t("predictionFactorsTitle")}</h4>
        <ul className="space-y-2">
          {prediction.factors.map((factor) => (
            <li key={factor.label} className="text-sm text-[var(--muted)]">
              <span className="font-medium text-[var(--foreground-soft)]">{factor.label}.</span> {factor.detail}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 border-t border-[rgba(var(--ink-rgb),0.1)] pt-3 text-xs leading-relaxed text-[var(--muted)] opacity-60">
        {t("predictionDisclaimer")}
      </p>
    </Card>
  );
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
