"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/hooks/useTheme";

/**
 * The header's light/dark switch. Shows the icon for the theme a
 * click would turn ON, not the one currently active — a sun while
 * dark mode is on (click it to go light), a moon while light mode is
 * on (click it to go dark) — matching how this kind of toggle reads on
 * most sites and exactly as asked for.
 */
export function ThemeToggle() {
  const t = useTranslations("nav");
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      title={isDark ? t("switchToLight") : t("switchToDark")}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--ink-rgb),0.05)] text-[var(--foreground-dim)] transition-colors hover:bg-[rgba(var(--ink-rgb),0.1)] hover:text-[var(--foreground)]"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 14.6A8.5 8.5 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1Z" />
    </svg>
  );
}
