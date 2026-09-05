import { Link } from "@/i18n/navigation";
import type { Team } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { FormStrip } from "@/components/event/FormStrip";

/** Team directory for a sport page — the main discovery surface for
 * team pages, the same role SportCategoryGrid plays for sports on the
 * homepage. Also reused by search results, which can mix teams from
 * several sports in one grid — hence building the link from each
 * team's own `sport` field instead of a single shared prop. */
export function TeamGrid({ teams }: { teams: Team[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {teams.map((team) => (
        <Link key={team.id} href={`/${team.sport}/team/${team.slug}`}>
          <Card hoverable className="flex flex-col gap-2 p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-slate-200">
                {team.shortName.slice(0, 3)}
              </span>
              <span className="truncate text-sm font-medium text-white">{team.name}</span>
            </div>
            {team.form && team.form.length > 0 && <FormStrip form={team.form} />}
          </Card>
        </Link>
      ))}
    </div>
  );
}
