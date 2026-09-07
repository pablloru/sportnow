import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SportSwitcher } from "./SportSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FavoritesNavLink } from "./FavoritesNavLink";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const tNav = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(var(--ink-rgb),0.1)] bg-[var(--background)]/90 backdrop-blur">
      <div
        className="h-[3px] w-full bg-gradient-to-r from-[var(--brand)] via-[var(--brand)]/40 to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-[var(--foreground)]">
          <Image
            src="/brand/logo-mark.png"
            alt=""
            width={64}
            height={64}
            priority
            className="h-8 w-8 shrink-0 rounded-lg"
          />
          <span className="font-display text-base font-semibold uppercase tracking-wide sm:text-lg">
            Sports<span className="text-[var(--brand)]">New</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/results"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-[var(--foreground-dim)] transition-colors hover:bg-[rgba(var(--ink-rgb),0.05)] hover:text-[var(--foreground)] sm:block"
          >
            {tNav("results")}
          </Link>
          <LanguageSwitcher />
          <Link
            href="/search"
            aria-label={tNav("search")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--ink-rgb),0.05)] text-[var(--foreground-dim)] transition-colors hover:bg-[rgba(var(--ink-rgb),0.1)] hover:text-[var(--foreground)]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </Link>
          <FavoritesNavLink />
          <ThemeToggle />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6">
        <SportSwitcher />
      </div>
    </header>
  );
}
