import { useTranslations } from "next-intl";
import type { Lineup } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function LineupPanel({
  homeLineup,
  awayLineup,
  homeName,
  awayName,
}: {
  homeLineup?: Lineup;
  awayLineup?: Lineup;
  homeName: string;
  awayName: string;
}) {
  const t = useTranslations("eventPage");
  if (!homeLineup && !awayLineup) return null;

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-base font-semibold text-white">{t("lineups")}</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TeamLineup name={homeName} lineup={homeLineup} t={t} />
        <TeamLineup name={awayName} lineup={awayLineup} t={t} />
      </div>
    </Card>
  );
}

function TeamLineup({
  name,
  lineup,
  t,
}: {
  name: string;
  lineup?: Lineup;
  t: ReturnType<typeof useTranslations>;
}) {
  if (!lineup) return null;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{name}</span>
        {lineup.formation && (
          <span className="text-xs text-[var(--muted)]">{lineup.formation}</span>
        )}
      </div>
      <p className="mb-1 text-xs uppercase tracking-wide text-[var(--muted)]">{t("starters")}</p>
      <ul className="mb-3 space-y-1">
        {lineup.starters.map((p) => (
          <li key={p.id} className="flex items-center gap-2 text-sm text-slate-200">
            <span className="w-6 shrink-0 text-right text-xs text-[var(--muted)]">{p.number}</span>
            {p.name}
          </li>
        ))}
      </ul>
      {lineup.bench && lineup.bench.length > 0 && (
        <>
          <p className="mb-1 text-xs uppercase tracking-wide text-[var(--muted)]">{t("bench")}</p>
          <ul className="space-y-1">
            {lineup.bench.map((p) => (
              <li key={p.id} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <span className="w-6 shrink-0 text-right text-xs">{p.number}</span>
                {p.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
