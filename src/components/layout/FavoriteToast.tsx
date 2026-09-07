"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { subscribeFavoriteToast, type FavoriteToastDetail } from "@/lib/favorites";

const VISIBLE_MS = 3200;

/**
 * Mounted once in the root layout. Every star toggle across the site
 * (team page, match page) fires a toast event with what just happened
 * — this is the single place that turns it into a brief, explicit
 * confirmation ("Added to favorites: <name>") plus a direct link to
 * the favorites page, so a visitor never has to wonder whether the
 * click "worked" or where a favorited item went. Purely a listener:
 * it renders nothing until the first toggle happens anywhere on the
 * page, and disappears on its own a few seconds later.
 *
 * Deliberately NOT theme-aware — this stays a fixed dark pill in both
 * light and dark mode (the same convention most sites use for toasts/
 * snackbars), so its colors below are literal, not the --foreground/
 * --ink-rgb tokens the rest of the app uses.
 */
export function FavoriteToast() {
  const t = useTranslations("favoritesToast");
  const [toast, setToast] = useState<FavoriteToastDetail | null>(null);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = subscribeFavoriteToast((detail) => {
      setToast(detail);
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setToast(null), VISIBLE_MS);
    });
    return () => {
      unsubscribe();
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  if (!toast) return null;

  const key = toast.active
    ? toast.kind === "team"
      ? "addedTeam"
      : "addedEvent"
    : toast.kind === "team"
      ? "removedTeam"
      : "removedEvent";

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6"
    >
      <div className="pointer-events-auto flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-slate-900/95 py-2 pl-4 pr-2 text-sm text-white shadow-xl backdrop-blur">
        <StarIcon filled={toast.active} />
        <span className="truncate">{t(key, { name: toast.label })}</span>
        <Link
          href="/favorites"
          className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/20 hover:text-white"
        >
          {t("view")}
        </Link>
      </div>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[var(--brand)]"
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
