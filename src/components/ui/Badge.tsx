import { clsx } from "clsx";
import type { ReactNode } from "react";

type BadgeTone = "neutral" | "accent" | "brand" | "positive" | "warning" | "danger";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-[rgba(var(--ink-rgb),0.05)] text-[var(--foreground-dim)] ring-1 ring-inset ring-[rgba(var(--ink-rgb),0.1)]",
  accent: "bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/30",
  // Site-wide energy tone (predictions, live-ish markers) — kept apart
  // from "accent" so cyan/violet stay reserved for home/away identity.
  brand: "bg-[rgba(var(--brand-rgb),0.12)] text-[#ff9a5c] ring-1 ring-inset ring-[rgba(var(--brand-rgb),0.35)]",
  positive: "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/30",
  warning: "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/30",
  danger: "bg-rose-400/10 text-rose-300 ring-1 ring-inset ring-rose-400/30",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  pulse = false,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
        TONE_CLASSES[tone],
        className
      )}
    >
      {pulse && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
      {children}
    </span>
  );
}
