"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import type { SportEvent, SportSlug } from "@/lib/types";
import { SPORTS, isSportSlug } from "@/lib/constants";
import { searchEvents } from "@/lib/search";
import { EventCard } from "@/components/event/EventCard";

const PAGE_SIZE = 12;

type Period = "all" | "7d" | "30d" | "90d";
const PERIOD_DAYS: Record<Exclude<Period, "all">, number> = { "7d": 7, "30d": 30, "90d": 90 };
const PERIODS: Period[] = ["all", "7d", "30d", "90d"];

type SortOrder = "newest" | "oldest";

/** History/results browser: every finished event across every sport,
 * filterable by sport, competition, and recency, plus free-text search
 * over team/tournament names. Same "ship the (small) dataset, filter
 * client-side" approach as SearchClient — no separate history API
 * needed for a dataset this size. `initialSport`/`initialQuery` seed
 * the filters when arriving from a sport or team page's "see all"
 * link; the rest of the UI is fully interactive from there. */
export function ResultsClient({
  events,
  initialSport,
  initialQuery,
}: {
  events: SportEvent[];
  initialSport?: string;
  initialQuery?: string;
}) {
  const t = useTranslations("resultsPage");
  const tSports = useTranslations("sports");
  const tCommon = useTranslations("common");

  const [query, setQuery] = useState(initialQuery ?? "");
  const [sport, setSport] = useState<SportSlug | "all">(
    initialSport && isSportSlug(initialSport) ? initialSport : "all"
  );
  const [competition, setCompetition] = useState<string>("all");
  const [period, setPeriod] = useState<Period>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // `Date.now()` is impure, so it can't be called directly during render
  // (the react-hooks/purity rule catches that) — capture it once after
  // mount instead. The period filter defaults to "all" (no date
  // filtering), so `now` is always populated well before a user could
  // pick a dated period; the setTimeout hop sidesteps the
  // react-hooks/set-state-in-effect rule the same way LocalDateTime does.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);

  function selectSport(next: SportSlug | "all") {
    setSport(next);
    setCompetition("all");
  }

  const sportFiltered = useMemo(
    () => (sport === "all" ? events : events.filter((e) => e.sport === sport)),
    [events, sport]
  );

  const competitions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const event of sportFiltered) {
      if (!seen.has(event.competition.id)) seen.set(event.competition.id, event.competition.name);
    }
    return Array.from(seen, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [sportFiltered]);

  const trimmedQuery = query.trim();

  const filtered = useMemo(() => {
    let result = sportFiltered;

    if (competition !== "all") {
      result = result.filter((e) => e.competition.id === competition);
    }

    if (period !== "all" && now !== null) {
      const cutoff = now - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000;
      result = result.filter((e) => new Date(e.startTime).getTime() >= cutoff);
    }

    if (trimmedQuery) {
      result = searchEvents(result, trimmedQuery);
    }

    result = [...result].sort((a, b) => {
      const diff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });

    return result;
  }, [sportFiltered, competition, period, trimmedQuery, sortOrder, now]);

  // Reset pagination whenever the active filters change, without an
  // Effect: comparing against the previous key during render and
  // adjusting state right away is the pattern React's own docs
  // recommend for "state that resets when inputs change".
  const filterKey = `${sport}|${competition}|${period}|${trimmedQuery}|${sortOrder}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const hasActiveFilters =
    sport !== "all" || competition !== "all" || period !== "all" || trimmedQuery !== "";

  function resetFilters() {
    setQuery("");
    setSport("all");
    setCompetition("all");
    setPeriod("all");
    setSortOrder("newest");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-white sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("subtitle")}</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-2xl border border-white/10 bg-[var(--surface)] py-3 pl-11 pr-4 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-white/30"
          />
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          <SportPill active={sport === "all"} onClick={() => selectSport("all")}>
            {t("allSports")}
          </SportPill>
          {SPORTS.map((s) => (
            <SportPill key={s.slug} active={sport === s.slug} onClick={() => selectSport(s.slug)}>
              {tSports(`${s.slug}.shortName`)}
            </SportPill>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
            className="rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2 text-sm text-white outline-none focus:border-white/30"
          >
            <option value="all">{t("allCompetitions")}</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            aria-label={t("period")}
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {t(p === "all" ? "periodAll" : `period${p}`)}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2 text-sm text-white outline-none focus:border-white/30"
          >
            <option value="newest">{t("sortNewest")}</option>
            <option value="oldest">{t("sortOldest")}</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-sm font-medium text-[var(--muted)] transition-colors hover:text-white"
            >
              {t("resetFilters")}
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-[var(--muted)]">{t("resultsCount", { count: filtered.length })}</p>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-[var(--muted)]">
          {trimmedQuery || hasActiveFilters ? t("noResults") : tCommon("emptyState")}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="rounded-full bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            {t("showMore")}
          </button>
        </div>
      )}
    </div>
  );
}

function SportPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-white text-slate-950"
          : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}
