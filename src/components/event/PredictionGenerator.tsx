"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import type { Prediction } from "@/lib/types";
import type { PredictionMarket } from "@/lib/prediction-markets";
import { Card } from "@/components/ui/Card";
import { PredictionBlock } from "@/components/event/PredictionBlock";

/** The "AI is thinking" checklist, in the order it ticks off. Purely
 * theatrical — the prediction itself is already computed server-side
 * and passed in as a prop; this only delays revealing it so the click
 * reads as "an analysis just ran" rather than a plain accordion. */
const STEP_KEYS = [
  "stepCollectData",
  "stepAnalyzeForm",
  "stepHeadToHead",
  "stepOdds",
  "stepProbabilities",
  "stepFinalizing",
] as const;

const STEP_MS = 550;
const REVEAL_DELAY_MS = 800;

type Phase = "idle" | "generating" | "done";

/**
 * Gates the match page's prediction behind an explicit button click
 * instead of showing it immediately — a visitor has to ask for it, and
 * watching each step check off in order makes the eventual number feel
 * earned rather than just another stat on the page. Once the checklist
 * finishes, hands off to the real PredictionBlock with the
 * already-known result.
 */
export function PredictionGenerator({
  prediction,
  homeTeamName,
  awayTeamName,
  markets,
}: {
  prediction: Prediction;
  homeTeamName: string;
  awayTeamName: string;
  markets?: PredictionMarket[];
}) {
  const t = useTranslations("eventPage");
  const [phase, setPhase] = useState<Phase>("idle");
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (phase !== "generating") return;
    if (completed >= STEP_KEYS.length) {
      const revealTimer = setTimeout(() => setPhase("done"), REVEAL_DELAY_MS);
      return () => clearTimeout(revealTimer);
    }
    const stepTimer = setTimeout(() => setCompleted((n) => n + 1), STEP_MS);
    return () => clearTimeout(stepTimer);
  }, [phase, completed]);

  if (phase === "done") {
    return (
      <PredictionBlock
        prediction={prediction}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
        markets={markets}
      />
    );
  }

  // Idle: one big, unadorned button — no card chrome, no header row, no
  // explanatory subtitle above it. It's the single most important
  // action on the page before a prediction exists, so it gets to just
  // be a button rather than a button buried inside a labeled card.
  if (phase === "idle") {
    return (
      <button
        type="button"
        onClick={() => {
          setCompleted(0);
          setPhase("generating");
        }}
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[var(--brand)] px-6 py-5 text-base font-semibold text-slate-950 transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <SparkleIcon className="h-5 w-5" />
        {t("getPrediction")}
      </button>
    );
  }

  // Generating: the card chrome (icon + title + spinner) only appears
  // once something is actually happening, framing the checklist below.
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center gap-3 border-b border-[rgba(var(--ink-rgb),0.1)] px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--brand-rgb),0.16)] text-[var(--brand)]">
          <SparkleIcon />
        </span>
        <h3 className="text-base font-semibold text-[var(--foreground)]">{t("predictionTitle")}</h3>
        <span
          className="ml-auto h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[rgba(var(--ink-rgb),0.15)] border-t-[var(--brand)]"
          aria-hidden
        />
      </div>

      <ul className="space-y-3 p-5">
        {STEP_KEYS.map((key, index) => {
          const isDone = index < completed;
          const isActive = index === completed;
          return (
            <li key={key} className="flex items-center gap-2.5 text-sm">
              {isDone ? (
                <CheckIcon />
              ) : (
                <span
                  className={clsx(
                    "h-2 w-2 shrink-0 rounded-full",
                    isActive ? "animate-pulse bg-[var(--brand)]" : "bg-[rgba(var(--ink-rgb),0.15)]"
                  )}
                />
              )}
              <span className={isDone ? "text-[var(--foreground-soft)]" : isActive ? "text-[var(--foreground)]" : "text-[var(--muted)]"}>
                {t(key)}
              </span>
            </li>
          );
        })}
      </ul>
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

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[var(--positive)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      aria-hidden
    >
      <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
