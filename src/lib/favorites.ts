/**
 * Client-only favorites — no account needed. Backed by localStorage, a
 * demo-scale stand-in for what would eventually be a per-user list on
 * the server once accounts exist. Every read/write is guarded because
 * this only makes sense in the browser: server-rendered pages never
 * know a visitor's favorites, and that's the point — it's private to
 * their own browser until there's a real account system to sync it
 * through.
 *
 * Two independent kinds are supported — "team" and "event" — because
 * some visitors only want to track a single upcoming match, others
 * only want to follow a team long-term. Each kind gets its own
 * storage key so toggling one never touches the other's list.
 */
export type FavoriteKind = "team" | "event";

const STORAGE_KEYS: Record<FavoriteKind, string> = {
  team: "sportsnew:favorite-teams",
  event: "sportsnew:favorite-events",
};

const CHANGE_EVENT = "sportsnew:favorites-change";

const EMPTY: string[] = [];

// useSyncExternalStore (see useFavorites) requires getSnapshot to
// return the SAME array reference when nothing actually changed —
// otherwise React thinks the store changed on every render. So we
// cache the last-parsed result per kind, keyed by the raw string still
// in storage, and only build a new array when that raw string differs.
const cache: Record<FavoriteKind, { raw: string | null; ids: string[] }> = {
  team: { raw: null, ids: EMPTY },
  event: { raw: null, ids: EMPTY },
};

function readIds(kind: FavoriteKind): string[] {
  if (typeof window === "undefined") return EMPTY;
  const slot = cache[kind];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS[kind]);
    if (raw === slot.raw) return slot.ids;
    slot.raw = raw;
    if (!raw) {
      slot.ids = EMPTY;
      return slot.ids;
    }
    const parsed = JSON.parse(raw);
    slot.ids = Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : EMPTY;
    return slot.ids;
  } catch {
    slot.ids = EMPTY;
    return slot.ids;
  }
}

function writeIds(kind: FavoriteKind, ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEYS[kind], JSON.stringify(ids));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage can be unavailable (private browsing, quota, disabled) —
    // favoriting just silently doesn't persist rather than breaking
    // the page.
  }
}

export function getFavoriteIds(kind: FavoriteKind): string[] {
  return readIds(kind);
}

export function getServerFavoriteIds(): string[] {
  return EMPTY;
}

export function toggleFavorite(kind: FavoriteKind, id: string): string[] {
  const current = readIds(kind);
  const next = current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id];
  writeIds(kind, next);
  return next;
}

/** Notifies every subscriber when EITHER kind of favorite changes —
 * including in another tab (native "storage" event) — so a star
 * toggled on one page is reflected instantly anywhere else it's read,
 * without a full reload. Each consumer re-reads its own kind via
 * getFavoriteIds, so a shared event is simpler than per-kind ones. */
export function subscribeFavorites(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
