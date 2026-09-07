"use client";

import { clsx } from "clsx";
import { useFavorites } from "@/hooks/useFavorites";
import type { FavoriteKind } from "@/lib/favorites";

type Props = {
  kind: FavoriteKind;
  id: string;
  /** Display name of the team/match — used as the toast message and,
   * on the compact variant, the tooltip. Never rendered as the pill's
   * own label (that stays a short, constant verb phrase on purpose,
   * so the control reads the same everywhere it appears). */
  label: string;
  addLabel: string;
  removeLabel: string;
  addText: string;
  activeText: string;
  size?: "default" | "compact";
};

/**
 * The one shared "favorite this" control — a labeled pill, not a bare
 * icon, on purpose: an icon-only star only means something to visitors
 * who already know the convention, and this app has no accounts/onboarding
 * to teach it first. Pairing the star with a plain-language verb
 * ("В избранное" → "В избранном") makes the action and its result
 * legible on first look, the same way Airbnb/Booking's heart buttons or
 * a "Save"/"Saved" toggle read without any explanation needed.
 */
export function FavoriteButton({ kind, id, label, addLabel, removeLabel, addText, activeText, size = "default" }: Props) {
  const { isFavorite, toggle } = useFavorites(kind);
  const active = isFavorite(id);

  return (
    <button
      type="button"
      onClick={() => toggle(id, label)}
      aria-pressed={active}
      aria-label={active ? removeLabel : addLabel}
      title={active ? removeLabel : addLabel}
      className={clsx(
        "flex shrink-0 items-center gap-1.5 rounded-full border font-medium transition-colors",
        size === "compact" ? "h-8 px-2.5 text-xs" : "h-10 px-3.5 text-sm",
        active
          ? "border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.16)] text-[var(--brand)]"
          : "border-[rgba(var(--ink-rgb),0.1)] bg-[rgba(var(--ink-rgb),0.05)] text-[var(--foreground-dim)] hover:border-[rgba(var(--ink-rgb),0.2)] hover:text-[var(--foreground)]"
      )}
    >
      <StarIcon filled={active} className={size === "compact" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      <span className={clsx(size === "compact" && "hidden sm:inline")}>{active ? activeText : addText}</span>
    </button>
  );
}

function StarIcon({ filled, className }: { filled: boolean; className: string }) {
  return (
    <svg
      className={clsx(className, "shrink-0")}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        d="m12 3 2.6 5.86 6.4.6-4.8 4.3 1.4 6.24L12 16.9l-5.6 3.1 1.4-6.24-4.8-4.3 6.4-.6L12 3Z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
