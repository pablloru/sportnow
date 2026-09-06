"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getFavoriteIds,
  getServerFavoriteIds,
  subscribeFavorites,
  toggleFavorite,
  type FavoriteKind,
} from "@/lib/favorites";

/** Reads favorite ids of one kind ("team" or "event") from localStorage
 * and keeps them in sync across every component using this hook on the
 * page (and across browser tabs, via the "storage" event).
 * `useSyncExternalStore` is the correct tool here rather than
 * useState+useEffect: favorites are an external store (localStorage)
 * the server can never see, and this hook needs to re-render whenever
 * ANY component on the page toggles one — a plain effect that calls
 * setState synchronously on mount is exactly the anti-pattern this API
 * replaces. */
export function useFavorites(kind: FavoriteKind) {
  const getSnapshot = useCallback(() => getFavoriteIds(kind), [kind]);
  const ids = useSyncExternalStore(subscribeFavorites, getSnapshot, getServerFavoriteIds);

  // `label` is optional and purely cosmetic — pass the team/match's
  // display name to get a confirmation toast (see FavoriteToast); omit
  // it for a silent toggle.
  const toggle = useCallback(
    (id: string, label?: string) => {
      toggleFavorite(kind, id, label);
    },
    [kind]
  );

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return { favoriteIds: ids, toggle, isFavorite };
}
