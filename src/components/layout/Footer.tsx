import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SPORTS } from "@/lib/constants";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-white/10 bg-[var(--surface)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-[var(--brand)] via-[var(--brand)]/40 to-transparent" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="font-display mb-2 text-base font-semibold uppercase tracking-wide text-white">
              {t("meta.siteName")}
            </div>
            <p className="text-sm text-[var(--muted)]">{t("footer.tagline")}</p>
          </div>
          <div>
            <div className="mb-3 text-sm font-medium text-white">{t("home.sectionCategories")}</div>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-[var(--muted)]">
              {SPORTS.map((sport) => (
                <li key={sport.slug}>
                  <Link href={`/${sport.slug}`} className="hover:text-white">
                    {t(`sports.${sport.slug}.shortName`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} {t("meta.siteName")}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
