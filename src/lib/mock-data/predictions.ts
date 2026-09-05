import type { Prediction } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";
import { daysFromNow } from "./helpers";
import { PREDICTION_DETAILS_EN } from "./i18n/predictions.en";

/** The fixed set of factor labels used across every prediction (verified exhaustive). */
const FACTOR_LABELS_EN: Record<string, string> = {
  "Текущая форма": "Current form",
  "Домашний фактор": "Home advantage",
  Травмы: "Injuries",
  "Личные встречи": "Head-to-head",
  Статистика: "Statistics",
  "Драфт-статистика": "Draft stats",
  "Пул карт": "Map pool",
  "Дебютный фактор": "Debut factor",
};

/**
 * IMPORTANT (see intelligence layer docs): these are framed as a
 * probability estimate over demo factors, never as a certain outcome.
 * `isDemo: true` on every entry is surfaced in the UI as a disclaimer —
 * do not remove it when this is eventually backed by a real model.
 */
export const PREDICTIONS: Prediction[] = [
  {
    eventId: "evt-football-featured",
    homeWinPct: 48,
    drawPct: 27,
    awayWinPct: 25,
    factors: [
      { label: "Текущая форма", detail: "Northbridge United набрали 10 очков из последних 5 матчей против 7 у Real Alcazar." },
      { label: "Домашний фактор", detail: "Northbridge United выиграли 4 из последних 5 домашних матчей в турнире." },
      { label: "Травмы", detail: "Отсутствие ключевого нападающего хозяев (см. блок «Что изменилось?») немного снижает атакующий потенциал." },
      { label: "Личные встречи", detail: "В последних 5 очных матчах у хозяев 2 победы, 2 ничьи, 1 поражение." },
      { label: "Статистика", detail: "Real Alcazar пропускают в среднем на 0.4 гола за матч больше в гостевых играх." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-hockey-3",
    homeWinPct: 45,
    drawPct: 16,
    awayWinPct: 39,
    factors: [
      { label: "Текущая форма", detail: "Обе команды показывают близкую результативность в последних 5 играх." },
      { label: "Травмы", detail: "Отсутствие ключевого защитника гостей (см. блок «Что изменилось?») немного снижает надёжность обороны Arctic Kings." },
      { label: "Личные встречи", detail: "Три из последних четырёх очных матчей завершились с разницей в одну шайбу." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-tennis-3",
    homeWinPct: 57,
    awayWinPct: 43,
    factors: [
      { label: "Текущая форма", detail: "Volkov выиграл 4 из последних 5 матчей на этом покрытии." },
      { label: "Личные встречи", detail: "Volkov ведёт 3-1 в очных встречах с Takahashi." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-cs2-3",
    homeWinPct: 54,
    awayWinPct: 46,
    factors: [
      { label: "Текущая форма", detail: "Nova Sentinel выиграли 4 из последних 5 карт подряд." },
      { label: "Статистика", detail: "Vertex Gaming сильнее на картах с закрытыми позициями — учитывается пул карт серии." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-dota-2-3",
    homeWinPct: 52,
    awayWinPct: 48,
    factors: [
      { label: "Текущая форма", detail: "Ember Guard выиграли последнюю серию 2-0." },
      { label: "Драфт-статистика", detail: "Titan Forge демонстрируют сильную раннюю игру в последних турнирах." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-mlbb-3",
    homeWinPct: 60,
    awayWinPct: 40,
    factors: [
      { label: "Текущая форма", detail: "Solar Flare выиграли 4 из последних 5 матчей." },
      { label: "Личные встречи", detail: "Solar Flare выиграли последние 2 очные встречи." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-football-7",
    homeWinPct: 39,
    drawPct: 30,
    awayWinPct: 31,
    factors: [
      { label: "Текущая форма", detail: "Meridian City выиграли 2 из последних 5 матчей во всех турнирах против 3 у Sterling FC." },
      { label: "Домашний фактор", detail: "Meridian City набирают в среднем на 0.3 очка за матч больше на своём поле." },
      { label: "Статистика", detail: "В личных встречах последних сезонов команды часто расходятся с минимальной разницей в счёте." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },

  // ---------------------------------------------------------------------
  // The block below extends predictions to every non-finished event (see
  // the brief: a demo prediction belongs on any match that hasn't been
  // played yet, not only on the hand-picked "popular" ones above).
  // ---------------------------------------------------------------------

  {
    eventId: "evt-football-4",
    homeWinPct: 33,
    drawPct: 29,
    awayWinPct: 38,
    factors: [
      { label: "Текущая форма", detail: "Iron Coast SC выиграли 3 из последних 5 матчей против 2 побед Sterling FC." },
      { label: "Личные встречи", detail: "Статистика личных встреч последних сезонов примерно равная, явного фаворита нет." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-football-6",
    homeWinPct: 52,
    drawPct: 26,
    awayWinPct: 22,
    factors: [
      { label: "Текущая форма", detail: "Real Alcazar выиграли 3 из последних 5 матчей против 2 побед Vantage Athletic." },
      { label: "Домашний фактор", detail: "Real Alcazar сильны на своём поле в этом сезоне." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-hockey-2",
    homeWinPct: 54,
    drawPct: 14,
    awayWinPct: 32,
    factors: [
      { label: "Текущая форма", detail: "Arctic Kings выиграли 3 из последних 5 игр, тогда как Redline HC — только одну." },
      { label: "Личные встречи", detail: "Последние очные матчи чаще складывались в пользу хозяев." },
    ],
    generatedAt: daysFromNow(-1, 8, 30),
    isDemo: true,
  },
  {
    eventId: "evt-hockey-6",
    homeWinPct: 51,
    drawPct: 17,
    awayWinPct: 32,
    factors: [
      { label: "Текущая форма", detail: "Southern Comets выиграли 3 из последних 5 матчей против 2 побед Vulcan Reign." },
      { label: "Домашний фактор", detail: "Southern Comets сильны на своей арене в этом сезоне." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-hockey-7",
    homeWinPct: 58,
    drawPct: 16,
    awayWinPct: 26,
    factors: [
      { label: "Текущая форма", detail: "Frost Wolves выиграли 3 из последних 5 матчей против 1 победы Redline HC." },
      { label: "Статистика", detail: "Frost Wolves пропускают меньше шайб в среднем за матч в этом сезоне." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-tennis-2",
    homeWinPct: 51,
    awayWinPct: 49,
    factors: [
      { label: "Текущая форма", detail: "Обе спортсменки выиграли по 3 из последних 5 матчей — форма примерно равная." },
      { label: "Личные встречи", detail: "Статистика личных встреч не выделяет явного фаворита." },
    ],
    generatedAt: daysFromNow(-1, 8, 0),
    isDemo: true,
  },
  {
    eventId: "evt-tennis-5",
    homeWinPct: 58,
    awayWinPct: 42,
    factors: [
      { label: "Текущая форма", detail: "Andersson выиграл 4 из последних 5 матчей против 3 побед Costa." },
      { label: "Дебютный фактор", detail: "Andersson дебютирует в основной сетке — это добавляет неопределённости в прогноз." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-tennis-6",
    homeWinPct: 53,
    awayWinPct: 47,
    factors: [
      { label: "Текущая форма", detail: "Обе спортсменки выиграли по 4 из последних 5 матчей — форма практически идентична." },
      { label: "Статистика", detail: "Ferreira сильнее на этом типе покрытия по статистике сезона." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-tennis-7",
    homeWinPct: 49,
    awayWinPct: 51,
    factors: [
      { label: "Текущая форма", detail: "Обе спортсменки выиграли по 3 из последних 5 матчей." },
      { label: "Личные встречи", detail: "Данных о личных встречах пока недостаточно для явного фаворита." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-cs2-5",
    homeWinPct: 47,
    awayWinPct: 53,
    factors: [
      { label: "Текущая форма", detail: "Iron Sight выиграли последние 3 карты подряд — лучший тренд формы среди двух команд." },
      { label: "Пул карт", detail: "Iron Sight обновили пул карт перед стартом турнира." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-cs2-6",
    homeWinPct: 57,
    awayWinPct: 43,
    factors: [
      { label: "Текущая форма", detail: "Nova Sentinel выиграли 4 из последних 5 карт против 3 у Phantom Six." },
      { label: "Статистика", detail: "Nova Sentinel уверенно выступают в домашних для себя турнирах сезона." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-cs2-7",
    homeWinPct: 48,
    awayWinPct: 52,
    factors: [
      { label: "Текущая форма", detail: "Обе команды выиграли по 3 из последних 5 карт — форма примерно равная." },
      { label: "Личные встречи", detail: "Статистика личных встреч ограничена — сложно выделить явного фаворита." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-dota-2-5",
    homeWinPct: 46,
    awayWinPct: 54,
    factors: [
      { label: "Текущая форма", detail: "Ashen Pact выиграли 3 из последних 5 игр и подходят к дебюту турнира в лучшей форме." },
      { label: "Личные встречи", detail: "У команд нет статистики личных встреч — прогноз строится только на текущей форме." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-dota-2-6",
    homeWinPct: 56,
    awayWinPct: 44,
    factors: [
      { label: "Текущая форма", detail: "Ember Guard выиграли 4 из последних 5 игр против 3 у Void Legion." },
      { label: "Драфт-статистика", detail: "Ember Guard чаще выбирают агрессивный ранний драфт, что даёт преимущество на старте карты." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-dota-2-7",
    homeWinPct: 48,
    awayWinPct: 52,
    factors: [
      { label: "Текущая форма", detail: "Обе команды выиграли по 3 из последних 5 игр." },
      { label: "Статистика", detail: "Ashen Pact демонстрируют более стабильную игру на поздней стадии матчей." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-mlbb-5",
    homeWinPct: 58,
    awayWinPct: 42,
    factors: [
      { label: "Текущая форма", detail: "Crimson Tide выиграли 4 из последних 5 матчей против 3 у Storm Vanguard." },
      { label: "Дебютный фактор", detail: "Обе команды — новички основной сетки турнира в этом сезоне." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-mlbb-6",
    homeWinPct: 53,
    awayWinPct: 47,
    factors: [
      { label: "Текущая форма", detail: "Обе команды выиграли по 4 из последних 5 матчей — форма практически идентична." },
      { label: "Статистика", detail: "Solar Flare — действующие финалисты турнира и играют по сетке на своей стороне." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-mlbb-7",
    homeWinPct: 51,
    awayWinPct: 49,
    factors: [
      { label: "Текущая форма", detail: "Обе команды выиграли по 3 из последних 5 матчей." },
      { label: "Личные встречи", detail: "Данные о личных встречах команд ограничены." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },

  {
    eventId: "evt-ufc-3",
    homeWinPct: 52,
    awayWinPct: 48,
    factors: [
      { label: "Текущая форма", detail: "Vance выиграл 4 из последних 5 боёв, Osei — тоже 4 из 5: по форме бойцы примерно равны." },
      { label: "Статистика", detail: "Vance завершает больше боёв досрочно, что немного смещает прогноз в его пользу." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-ufc-5",
    homeWinPct: 44,
    awayWinPct: 56,
    factors: [
      { label: "Текущая форма", detail: "Salvatore выиграл 4 из последних 5 боёв против 3 у Banks — небольшое преимущество в форме на стороне Salvatore." },
      { label: "Статистика", detail: "Salvatore реже пропускает удары в стойке по статистике последних боёв." },
    ],
    generatedAt: daysFromNow(-1, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-ufc-6",
    homeWinPct: 55,
    awayWinPct: 45,
    factors: [
      { label: "Текущая форма", detail: "Vance выиграл 4 из последних 5 боёв, Banks — 3 из последних 5, хотя и подходит к бою на серии из трёх побед подряд." },
      { label: "Статистика", detail: "Vance стабильнее в партере — по статистике последних боёв чаще доводит преимущество до конца." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
  {
    eventId: "evt-ufc-7",
    homeWinPct: 42,
    awayWinPct: 58,
    factors: [
      { label: "Текущая форма", detail: "Salvatore выиграл 4 из последних 5 боёв против 3 у Zima — заметное преимущество в текущей форме." },
      { label: "Статистика", detail: "Salvatore выигрывает больше раундов по ударной статистике в среднем за бой." },
    ],
    generatedAt: daysFromNow(0, 9, 0),
    isDemo: true,
  },
];

function localizePrediction(prediction: Prediction, locale: AppLocale): Prediction {
  if (locale === "ru") return prediction;
  const details = PREDICTION_DETAILS_EN[prediction.eventId];
  return {
    ...prediction,
    factors: prediction.factors.map((factor, index) => ({
      label: FACTOR_LABELS_EN[factor.label] ?? factor.label,
      detail: details?.[index] ?? factor.detail,
    })),
  };
}

export function getPredictionForEvent(eventId: string, locale: AppLocale = "ru"): Prediction | undefined {
  const found = PREDICTIONS.find((p) => p.eventId === eventId);
  return found ? localizePrediction(found, locale) : undefined;
}
