import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Player } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/** Clickable roster — the primary discovery path into player pages
 * (LineupPanel on a match page stays plain text; this is where a name
 * actually becomes a link). Only rendered when the team has a roster
 * at all (see players.ts header note on V1's partial coverage). */
export function RosterGrid({ players, sport }: { players: Player[]; sport: string }) {
  const t = useTranslations("teamPage");

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {players.map((player) => (
        <Link key={player.id} href={`/${sport}/player/${player.slug}`}>
          <Card hoverable className="flex items-center gap-3 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--brand-rgb),0.14)] text-xs font-semibold text-[var(--brand)]">
              {player.number ?? "—"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--foreground)]">{player.name}</p>
              <div className="flex items-center gap-1.5">
                {player.position && (
                  <span className="text-xs text-[var(--muted)]">{player.position}</span>
                )}
                {player.isKeyPlayer && (
                  <Badge tone="warning" className="px-1.5 py-0 text-[10px]">
                    {t("keyPlayer")}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
