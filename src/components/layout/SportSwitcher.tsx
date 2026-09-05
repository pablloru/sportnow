"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { SPORTS } from "@/lib/constants";
import { SportIcon } from "@/components/ui/SportIcon";
import { clsx } from "clsx";

/** Client component only because it needs the current pathname to
 * highlight the active sport — everything else here could be server-
 * rendered, but next-intl's `usePathname` is a client hook. */
export function SportSwitcher() {
  const t = useTranslations("sports");
  const pathname = usePathname();

  return (
    <nav className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
      {SPORTS.map((sport) => {
        const href = `/${sport.slug}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={sport.slug}
            href={href}
            className={clsx(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--brand)] text-[var(--brand-ink)]"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <SportIcon sport={sport.slug} className="h-4 w-4 shrink-0" />
            {t(`${sport.slug}.shortName`)}
          </Link>
        );
      })}
    </nav>
  );
}
