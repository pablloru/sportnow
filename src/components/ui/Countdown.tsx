"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/** Broken down remaining time. `total` <= 0 means the event has started. */
interface Remaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getRemaining(startTime: string): Remaining {
  const total = new Date(startTime).getTime() - Date.now();
  const clamped = Math.max(total, 0);
  const totalSeconds = Math.floor(clamped / 1000);
  return {
    total,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/**
 * Live "time until kickoff" countdown for scheduled events.
 *
 * The first render (server and first client paint) computes the same
 * lazy initial value, so there is nothing to reconcile on mount; a
 * `setInterval` then nudges state every second to keep it ticking.
 * `suppressHydrationWarning` sits on the leaf text nodes only, because
 * "now" at build/request time is never exactly "now" at hydration time
 * — a one-second drift there is expected and harmless.
 */
export function Countdown({
  startTime,
  variant = "pill",
}: {
  startTime: string;
  variant?: "pill" | "boxes";
}) {
  const t = useTranslations("common.countdown");
  const [remaining, setRemaining] = useState<Remaining>(() => getRemaining(startTime));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(getRemaining(startTime));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const started = remaining.total <= 0;

  if (variant === "boxes") {
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          {t("label")}
        </span>
        {started ? (
          <span className="text-sm font-medium text-[#ff9a5c]" suppressHydrationWarning>
            {t("startingSoon")}
          </span>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <TimeBox value={remaining.days} label={t("days")} />
            <TimeBox value={remaining.hours} label={t("hours")} />
            <TimeBox value={remaining.minutes} label={t("minutes")} />
            <TimeBox value={remaining.seconds} label={t("seconds")} />
          </div>
        )}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(var(--brand-rgb),0.3)] bg-[rgba(var(--brand-rgb),0.12)] px-3 py-1 text-xs font-semibold tabular-nums text-[#ff9a5c]">
      <ClockIcon />
      <span suppressHydrationWarning>
        {started ? t("startingSoon") : <PillLabel remaining={remaining} t={t} />}
      </span>
    </span>
  );
}

function PillLabel({
  remaining,
  t,
}: {
  remaining: Remaining;
  t: (key: "days" | "hours" | "minutes" | "seconds") => string;
}) {
  const { days, hours, minutes, seconds } = remaining;
  if (days > 0) {
    return (
      <>
        {days}
        {t("days")} {hours}
        {t("hours")}
      </>
    );
  }
  if (hours > 0) {
    return (
      <>
        {hours}
        {t("hours")} {minutes}
        {t("minutes")}
      </>
    );
  }
  return (
    <>
      {minutes}
      {t("minutes")} {seconds}
      {t("seconds")}
    </>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[3.25rem] flex-col items-center gap-1 rounded-xl border border-[rgba(var(--ink-rgb),0.1)] bg-[rgba(var(--ink-rgb),0.05)] px-2 py-2.5 sm:min-w-[4rem] sm:px-3">
      <span
        className="font-mono text-xl font-bold tabular-nums text-[var(--foreground)] sm:text-2xl"
        suppressHydrationWarning
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</span>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
