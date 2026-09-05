import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isSportSlug } from "@/lib/constants";
import { playerRepository } from "@/lib/repositories/player.repository";
import { teamRepository } from "@/lib/repositories/team.repository";
import { PLAYERS, TEAMS } from "@/lib/mock-data";
import { routing, type AppLocale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/event/EventCard";
import { BackLink } from "@/components/ui/BackLink";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string; sport: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PLAYERS.map((player) => {
      const team = TEAMS.find((t) => t.id === player.teamId);
      return { locale, sport: team?.sport ?? "football", slug: player.slug };
    })
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, sport, slug } = await params;
  if (!isSportSlug(sport)) return {};
  const player = await playerRepository.getBySlug(sport, slug);
  if (!player) return {};

  const team = await playerRepository.getTeam(player.teamId);
  const title = player.name;
  const description = `${player.name} (${team.name})${player.position ? ` — ${player.position}` : ""}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/${sport}/player/${slug}`,
      languages: localeAlternates((l) => `/${l}/${sport}/player/${slug}`),
    },
    openGraph: { title, description, type: "profile" },
  };
}

export default async function PlayerPage({ params }: Props) {
  const { locale, sport, slug } = await params;
  setRequestLocale(locale);
  if (!isSportSlug(sport)) notFound();

  const player = await playerRepository.getBySlug(sport, slug);
  if (!player) notFound();

  const [t, team, injury] = await Promise.all([
    getTranslations("teamPage"),
    playerRepository.getTeam(player.teamId),
    playerRepository.getInjury(player.id, locale as AppLocale),
  ]);

  const recentMatches = (await teamRepository.getEvents(team.id)).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    memberOf: { "@type": "SportsTeam", name: team.name },
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackLink href={`/${sport}/team/${team.slug}`} label={t("backToTeam")} />

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--brand-rgb),0.14)] text-lg font-bold text-[var(--brand)]">
            {player.number ?? "—"}
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{player.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
              {player.position && <span>{player.position}</span>}
              <span>·</span>
              <Link href={`/${sport}/team/${team.slug}`} className="text-[var(--brand)] hover:underline">
                {team.name}
              </Link>
              {player.isKeyPlayer && <Badge tone="warning">{t("keyPlayer")}</Badge>}
            </div>
          </div>
        </div>

        {injury && (
          <p className="mt-4 border-t border-white/10 pt-4 text-sm text-[var(--muted)]">
            {injury.impact === "high" ? "⚠️ " : ""}
            {injury.description}
          </p>
        )}
      </Card>

      {recentMatches.length > 0 && (
        <section>
          <SectionHeading title={t("recentMatches")} subtitle={team.name} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recentMatches.map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
