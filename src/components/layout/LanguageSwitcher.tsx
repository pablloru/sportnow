"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { clsx } from "clsx";

/** Top-right locale switcher: keeps the current page, only swaps the
 * `[locale]` segment. Client component only because it needs the
 * current pathname (same reason as SportSwitcher). */
const LOCALE_LABELS: Record<string, string> = {
  ru: "RU",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-white/5 p-1">
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            aria-current={active ? "true" : undefined}
            className={clsx(
              "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
              active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
            )}
          >
            {LOCALE_LABELS[code] ?? code}
          </Link>
        );
      })}
    </div>
  );
}
