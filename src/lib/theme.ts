/**
 * Light/dark theme switching — a manual, persisted per-visitor choice
 * (not a `prefers-color-scheme` media query), so it always starts dark
 * (this app's original look) unless a visitor has explicitly toggled
 * it before. The single source of truth once the page has loaded is
 * the `data-theme` attribute on <html> — not localStorage directly —
 * because that's what globals.css actually keys its light-theme
 * overrides off of; localStorage is only where the choice is
 * persisted between visits. See the inline script in
 * app/[locale]/layout.tsx, which sets that attribute from localStorage
 * before the page paints, so there's no flash of the wrong theme.
 */
export type Theme = "dark" | "light";

const STORAGE_KEY = "sportnow:theme";
const CHANGE_EVENT = "sportnow:theme-change";

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  return isTheme(attr) ? attr : "dark";
}

export function getServerTheme(): Theme {
  return "dark";
}

export function setTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private browsing, quota, disabled) —
    // the theme still applies for this page view, it just won't
    // persist to the next visit.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function toggleTheme(): void {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

/** Notifies subscribers when the theme changes — including in another
 * tab (native "storage" event) — so every ThemeToggle instance and
 * anything else reading getTheme() stays in sync instantly. */
export function subscribeTheme(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
