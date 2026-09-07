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
  team: "sportnow:favorite-teams",
  event: "sportnow:favorite-events",
};

const CHANGE_EVENT = "sportnow:favorites-change";
const TOAST_EVENT = "sportnow:favorite-toast";

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

/** What a toggle just did — enough for a confirmation toast to say
 * "added/removed <label>" and offer a way to the favorites page,
 * without the toast needing to know anything about teams or events
 * itself. */
export type FavoriteToastDetail = { kind: FavoriteKind; active: boolean; label: string };

/**
 * Flips one id in one kind's list. `label` is optional and purely
 * cosmetic — when given (the team/match's display name), a toast
 * event fires so the visitor gets an explicit confirmation of what
 * just happened and a way to the favorites page, instead of a bare
 * icon silently changing color and hoping they noticed.
 */
export function toggleFavorite(kind: FavoriteKind, id: string, label?: string): string[] {
  const current = readIds(kind);
  const willBeActive = !current.includes(id);
  const next = willBeActive ? [...current, id] : current.filter((existing) => existing !== id);
  writeIds(kind, next);
  if (label && typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<FavoriteToastDetail>(TOAST_EVENT, { detail: { kind, active: willBeActive, label } })
    );
  }
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

/** Subscribes to the one-shot toast notifications toggleFavorite fires
 * (see FavoriteToastDetail). Separate from subscribeFavorites because
 * this is an event stream (one message per toggle), not a snapshot of
 * current state — useSyncExternalStore doesn't apply here. */
export function subscribeFavoriteToast(callback: (detail: FavoriteToastDetail) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => callback((event as CustomEvent<FavoriteToastDetail>).detail);
  window.addEventListener(TOAST_EVENT, handler);
  return () => window.removeEventListener(TOAST_EVENT, handler);
}
