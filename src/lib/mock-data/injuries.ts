import type { Injury } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";
import { daysFromNow, localize } from "./helpers";
import { INJURIES_EN } from "./i18n/injuries.en";

export const INJURIES: Injury[] = [
  {
    id: "injury-1",
    playerId: "p-nbu-9",
    teamId: "team-football-1",
    description:
      "Получил повреждение задней поверхности бедра на закрытой тренировке и будет отсутствовать минимум одну игру.",
    impact: "high",
    reportedAt: daysFromNow(-1, 12, 0),
  },
  {
    id: "injury-2",
    playerId: "p-alc-15",
    teamId: "team-football-2",
    description: "Лёгкий дискомфорт в колене, статус под вопросом — решение примут в день матча.",
    impact: "low",
    reportedAt: daysFromNow(-2, 9, 0),
  },
  {
    id: "injury-3",
    playerId: "p-ark-4",
    teamId: "team-hockey-3",
    description:
      "Повреждение запястья, полученное в предыдущем матче — пропустит игру, замену в первой паре защитников выполнит Andre Silva.",
    impact: "high",
    reportedAt: daysFromNow(-1, 10, 0),
  },
  {
    id: "injury-4",
    playerId: "p-stb-7",
    teamId: "team-hockey-2",
    description: "Играет через лёгкий дискомфорт в плече — тренерский штаб не ожидает ограничений по игровому времени.",
    impact: "low",
    reportedAt: daysFromNow(-2, 9, 0),
  },
];

function localizeInjury(injury: Injury, locale: AppLocale): Injury {
  return localize(injury, locale, { en: INJURIES_EN });
}

export function getInjuriesByTeam(teamId: string, locale: AppLocale = "ru"): Injury[] {
  return INJURIES.filter((i) => i.teamId === teamId).map((i) => localizeInjury(i, locale));
}

export function getInjuryForPlayer(playerId: string, locale: AppLocale = "ru"): Injury | undefined {
  const found = INJURIES.find((i) => i.playerId === playerId);
  return found ? localizeInjury(found, locale) : undefined;
}
