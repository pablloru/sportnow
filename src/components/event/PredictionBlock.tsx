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
        <h3 className="text-base font-semibold text-white">{t("prediction")}</h3>
        <div className="flex items-center gap-1.5">
          {prediction.isDemo && <Badge tone="warning">Demo</Badge>}
        </div>
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full bg-[var(--accent)] transition-[width] duration-700 ease-out"
          style={{ width: `${homeWinPct}%` }}
        />
        {drawPct !== undefined && (
          <div
            className="h-full bg-white/25 transition-[width] duration-700 ease-out"
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
          <PctColumn label={t("draw")} value={drawPct} color="text-slate-300" />
        ) : (
          <div />
        )}
        <PctColumn label={awayTeamName} sub={t("awayWin")} value={awayWinPct} color="text-[var(--accent-2)]" />
      </div>

      {markets && markets.length > 0 && (
        <PredictionMarkets markets={markets} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />
      )}

      <div className="mt-5 border-t border-white/10 pt-4">
        <h4 className="mb-2 text-sm font-medium text-white">{t("predictionFactorsTitle")}</h4>
        <ul className="space-y-2">
          {prediction.factors.map((factor) => (
            <li key={factor.label} className="text-sm text-[var(--muted)]">
              <span className="font-medium text-slate-200">{factor.label}.</span> {factor.detail}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-[var(--muted)]">
        {t("predictionDisclaimer")}
      </p>
    </Card>
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
      {sub && <div className="truncate text-xs font-medium text-slate-300">{label}</div>}
    </div>
  );
}
