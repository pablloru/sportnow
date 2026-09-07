import { useTranslations } from "next-intl";
import type { PredictionMarket, PredictionMarketOutcome } from "@/lib/prediction-markets";

const ACCENT = "var(--accent)";
const ACCENT_2 = "var(--accent-2)";
const NEUTRAL = "rgba(255,255,255,0.25)";

/** Color for one outcome's bar segment. A handicap outcome genuinely
 * belongs to one team, so it carries that team's identity color (same
 * cyan/violet used everywhere else on the page); total/BTTS/method
 * outcomes aren't tied to either side, so they get a single accent vs.
 * neutral treatment instead — reusing team colors there would wrongly
 * imply one of the teams "owns" e.g. the Over outcome. */
function outcomeColor(market: PredictionMarket, outcome: PredictionMarketOutcome): string {
  if (market.id === "handicap") {
    const favoriteIsHome = market.favorite === "home";
    const isFavorite = outcome.kind === "handicapFavorite";
    if (isFavorite) return favoriteIsHome ? ACCENT : ACCENT_2;
    return favoriteIsHome ? ACCENT_2 : ACCENT;
  }
  return outcome.kind === "over" || outcome.kind === "yes" || outcome.kind === "methodFinish"
    ? ACCENT
    : NEUTRAL;
}

/**
 * "Other likely outcomes" — the secondary markets buildPredictionMarkets()
 * derives (total, BTTS, handicap, method of victory, depending on sport),
 * shown as the same segmented-bar language as the main 3-way result
 * above, one market per row.
 */
export function PredictionMarkets({
  markets,
  homeTeamName,
  awayTeamName,
}: {
  markets: PredictionMarket[];
  homeTeamName: string;
  awayTeamName: string;
}) {
  const t = useTranslations("eventPage");

  return (
    <div className="mt-5 border-t border-[rgba(var(--ink-rgb),0.1)] pt-4">
      <h4 className="mb-3 text-sm font-medium text-[var(--foreground)]">{t("markets.title")}</h4>
      <div className="space-y-4">
        {markets.map((market) => (
          <MarketRow
            key={market.id}
            market={market}
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
          />
        ))}
      </div>
    </div>
  );
}

function MarketRow({
  market,
  homeTeamName,
  awayTeamName,
}: {
  market: PredictionMarket;
  homeTeamName: string;
  awayTeamName: string;
}) {
  const t = useTranslations("eventPage");

  const title =
    market.id === "total"
      ? t("markets.totalTitle", { line: market.line ?? 0 })
      : market.id === "btts"
        ? t("markets.bttsTitle")
        : market.id === "handicap"
          ? t("markets.handicapTitle")
          : t("markets.methodTitle");

  function outcomeLabel(outcome: PredictionMarketOutcome): string {
    switch (outcome.kind) {
      case "over":
        return t("markets.over", { line: market.line ?? 0 });
      case "under":
        return t("markets.under", { line: market.line ?? 0 });
      case "yes":
        return t("markets.yes");
      case "no":
        return t("markets.no");
      case "methodFinish":
        return t("markets.methodFinish");
      case "methodDecision":
        return t("markets.methodDecision");
      case "handicapFavorite":
        return `${market.favorite === "home" ? homeTeamName : awayTeamName} (−${market.line})`;
      case "handicapUnderdog":
        return `${market.favorite === "home" ? awayTeamName : homeTeamName} (+${market.line})`;
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{title}</p>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-[rgba(var(--ink-rgb),0.05)]">
        {market.outcomes.map((outcome) => (
          <div
            key={outcome.kind}
            className="h-full transition-[width] duration-700 ease-out"
            style={{ width: `${outcome.pct}%`, backgroundColor: outcomeColor(market, outcome) }}
          />
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-2 text-xs text-[var(--muted)]">
        {market.outcomes.map((outcome) => (
          <div key={outcome.kind} className={outcome.kind === "handicapUnderdog" || outcome.kind === "under" || outcome.kind === "no" || outcome.kind === "methodDecision" ? "text-right" : ""}>
            <span className="truncate">{outcomeLabel(outcome)}</span>{" "}
            <span className="font-semibold text-[var(--foreground)]">{outcome.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
