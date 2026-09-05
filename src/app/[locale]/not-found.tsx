import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-white">{t("title")}</h1>
      <p className="text-[var(--muted)]">{t("message")}</p>
      <Link href="/" className="text-[var(--accent)] hover:underline">
        {t("backHome")}
      </Link>
    </div>
  );
}
