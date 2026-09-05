import type { EventStatistic } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";
import { localize } from "./helpers";
import { EVENT_STATISTICS_EN } from "./i18n/event-statistics.en";

export const EVENT_STATISTICS: EventStatistic[] = [
  { id: "stat-1", eventId: "evt-football-featured", label: "Победы в последних 5 матчах", homeValue: 3, awayValue: 2 },
  { id: "stat-2", eventId: "evt-football-featured", label: "Средняя результативность (голы/матч)", homeValue: "2.1", awayValue: "1.7" },
  { id: "stat-3", eventId: "evt-football-featured", label: "Пропущено голов дома/на выезде (среднее)", homeValue: "0.8", awayValue: "1.2" },
  { id: "stat-4", eventId: "evt-football-featured", label: "Личные встречи (последние 5)", homeValue: "2 победы", awayValue: "1 победа" },

  { id: "stat-5", eventId: "evt-football-1", label: "Владение мячом", homeValue: "58%", awayValue: "42%" },
  { id: "stat-6", eventId: "evt-football-1", label: "Удары в створ", homeValue: 6, awayValue: 3 },

  { id: "stat-7", eventId: "evt-hockey-3", label: "Победы в последних 5 матчах", homeValue: 3, awayValue: 2 },
  { id: "stat-8", eventId: "evt-hockey-3", label: "Среднее количество шайб за матч", homeValue: "3.4", awayValue: "3.1" },
  { id: "stat-9", eventId: "evt-hockey-3", label: "Пропущено шайб в среднем за матч", homeValue: "2.6", awayValue: "2.9" },
  { id: "stat-10", eventId: "evt-hockey-3", label: "Личные встречи (последние 4)", homeValue: "2 победы", awayValue: "2 победы" },
];

function localizeStatistic(stat: EventStatistic, locale: AppLocale): EventStatistic {
  return localize(stat, locale, { en: EVENT_STATISTICS_EN });
}

export function getStatisticsForEvent(eventId: string, locale: AppLocale = "ru"): EventStatistic[] {
  return EVENT_STATISTICS.filter((s) => s.eventId === eventId).map((s) => localizeStatistic(s, locale));
}
