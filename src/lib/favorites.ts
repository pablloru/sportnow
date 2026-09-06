/**
 * Client-only "follow a team" favorites — no account needed. Backed by
 * localStorage, a demo-scale stand-in for what would eventually be a
 * per-user list on the server once accounts exist. Every read/write is
 * guarded because this only makes sense in the browser: server-rendered
 * pages never know a visitor's favorites, and that's the point — it's
 * private to their own browser until there's a real account system to
 * sync it through.
 */
const STORAGE_KEY = "sportsnew:favorite-teams";
const CHANGE_EVENT = "sportsnew:favorites-change";

const EMPTY: string[] = [];

// useSyncExternalStore (see useFavoriteTeams) requires getSnapshot to
// return the SAME array reference when nothing actually changed —
// otherwise React thinks the store changed on every render. So we cache
// the last-parsed result keyed by the raw string still in storage, and
// only build a new array when that raw string actually differs.
let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY;

function readIds(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedIds;
    cachedRaw = raw;
    if (!raw) {
      cachedIds = EMPTY;
      return cachedIds;
    }
    const parsed = JSON.parse(raw);
    cachedIds = Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : EMPTY;
    return cachedIds;
  } catch {
    cachedIds = EMPTY;
    return cachedIds;
  }
}

function writeIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage can be unavailable (private browsing, quota, disabled) —
    // favoriting just silently doesn't persist rather than breaking
    // the page.
  }
}

export function getFavoriteTeamIds(): string[] {
  return readIds();
}

export function getServerFavoriteTeamIds(): string[] {
  return EMPTY;
}

export function toggleFavoriteTeam(teamId: string): string[] {
  const current = readIds();
  const next = current.includes(teamId)
    ? current.filter((id) => id !== teamId)
    : [...current, teamId];
  writeIds(next);
  return next;
}

/** Notifies every subscriber when favorites change — including in
 * another tab (native "storage" event) — so a star toggled on the team
 * page is reflected instantly in, say, the homepage's favorites section
 * without a full reload. */
export function subscribeFavorites(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
