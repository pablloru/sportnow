import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** A row of jump-links pinned right below the sticky Header (which is
 * 115px tall: 3px accent bar + 60px logo row + 52px sport-switcher row —
 * see the matching `scroll-mt-44` on the target sections below), so a
 * first-time visitor sees the site's whole menu of content (today's
 * picks, upcoming events, predictions, news, results) before scrolling
 * at all, and it stays reachable while scrolling. The first four are
 * same-page anchors (plain <a href="#...">, smoothed by the global
 * `scroll-smooth` on <html> — no client JS needed); "Results" is a real
 * link to its own page. Full-bleed like Header (outer bar + inner
 * max-w-7xl row) so it doesn't look like a floating fragment when stuck. */
export async function QuickNav() {
  const t = await getTranslations("home");

  const items = [
    { href: "#section-today", label: t("quickNavToday"), icon: <IconBolt /> },
    { href: "#section-upcoming", label: t("quickNavUpcoming"), icon: <IconCalendar /> },
    { href: "#section-predictions", label: t("quickNavPredictions"), icon: <IconTrend /> },
    { href: "#section-news", label: t("quickNavNews"), icon: <IconNews /> },
  ];

  return (
    <div className="sticky top-[115px] z-30 border-b border-white/10 bg-[var(--background)]/90 backdrop-blur">
      <nav
        aria-label={t("quickNavLabel")}
        className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6"
      >
        <span className="hidden shrink-0 text-xs font-medium uppercase tracking-wide text-[var(--muted)] sm:inline">
          {t("quickNavLabel")}
        </span>
        <div className="scrollbar-none flex flex-1 gap-2 overflow-x-auto">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-[rgba(var(--brand-rgb),0.4)] hover:bg-[rgba(var(--brand-rgb),0.12)] hover:text-white"
            >
              <span className="text-[var(--brand)]">{item.icon}</span>
              {item.label}
            </a>
          ))}
          <Link
            href="/results"
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-[rgba(var(--brand-rgb),0.4)] hover:bg-[rgba(var(--brand-rgb),0.12)] hover:text-white"
          >
            <span className="text-[var(--brand)]">
              <IconFlag />
            </span>
            {t("quickNavResults")}
          </Link>
        </div>
      </nav>
    </div>
  );
}

function IconBolt() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" strokeLinecap="round" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 17 9.5 10.5 13.5 14.5 21 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconNews() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M7.5 8.5h6M7.5 12h9M7.5 15.5h9" strokeLinecap="round" />
    </svg>
  );
}

function IconFlag() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 21V4" strokeLinecap="round" />
      <path d="M5 4h13l-3 4 3 4H5" strokeLinejoin="round" />
    </svg>
  );
}
