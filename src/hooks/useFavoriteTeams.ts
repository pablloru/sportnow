"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getFavoriteTeamIds,
  getServerFavoriteTeamIds,
  subscribeFavorites,
  toggleFavoriteTeam,
} from "@/lib/favorites";

/** Reads favorite team ids from localStorage and keeps them in sync
 * across every component using this hook on the page (and across
 * browser tabs, via the "storage" event). `useSyncExternalStore` is the
 * correct tool here rather than useState+useEffect: favorites are an
 * external store (localStorage) the server can never see, and this
 * hook needs to re-render whenever ANY component on the page toggles
 * one — a plain effect that calls setState synchronously on mount is
 * exactly the anti-pattern this API replaces. */
export function useFavoriteTeams() {
  const ids = useSyncExternalStore(subscribeFavorites, getFavoriteTeamIds, getServerFavoriteTeamIds);

  const toggle = useCallback((teamId: string) => {
    toggleFavoriteTeam(teamId);
  }, []);

  const isFavorite = useCallback((teamId: string) => ids.includes(teamId), [ids]);

  return { favoriteIds: ids, toggle, isFavorite };
}
