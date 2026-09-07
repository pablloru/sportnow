"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getTheme, getServerTheme, subscribeTheme, toggleTheme } from "@/lib/theme";

/** Reads the active theme and keeps every consumer in sync (including
 * across tabs). `useSyncExternalStore` for the same reason as
 * useFavorites: the real value lives outside React (the <html>
 * data-theme attribute / localStorage), and it can change from a
 * source other than this component (another ThemeToggle instance, the
 * anti-FOUC script, another tab). */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const toggle = useCallback(() => toggleTheme(), []);
  return { theme, toggle };
}
