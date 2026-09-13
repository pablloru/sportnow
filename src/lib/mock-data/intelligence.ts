import type { IntelligenceInsight } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";
import { daysFromNow, localize } from "./helpers";
import { getSource } from "./sources";
import { INTELLIGENCE_EN } from "./i18n/intelligence.en";
import { REAL_INSIGHTS_RU, REAL_INSIGHTS_EN } from "@/lib/real-data/generated";

/**
 * "What changed?" entries — the core Match Intelligence concept from
 * the brief: explain *why* a fact matters, not just report it. In V1
 * this is hand-written per event; the intelligence layer (see
 * src/lib/intelligence) is where a real version would turn a raw
 * news/odds-movement event into one of these automatically.
 */
export const INTELLIGENCE_INSIGHTS: IntelligenceInsight[] = [
  {
    id: "intel-1",
    eventId: "evt-football-featured",
    headline: "Ключевой нападающий хозяев пропустит матч",
    explanation:
      "Марко Делич — один из ключевых игроков команды: на его счету 40% голов Northbridge United в этом сезоне. Его отсутствие может снизить атакующую эффективность и заставит тренера менять предполагаемый состав.",
    importance: "high",
    createdAt: daysFromNow(-1, 12, 0),
    source: getSource("src-sportswire"),
  },
  {
    id: "intel-2",
    eventId: "evt-football-featured",
    headline: "Real Alcazar не проигрывают четыре матча подряд",
    explanation:
      "Гости подходят к игре в лучшей форме сезона: 3 победы и 1 ничья в последних 4 матчах во всех турнирах — уверенность команды перед выездной игрой выросла.",
    importance: "medium",
    createdAt: daysFromNow(-2, 10, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-3",
    eventId: "evt-football-featured",
    headline: "Ожидается высокая результативность",
    explanation:
      "В 4 из последних 5 очных встреч этих команд был забит хотя бы один гол в каждом тайме — фактор, который стоит учитывать при прогнозе тотала.",
    importance: "low",
    createdAt: daysFromNow(-3, 8, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-4",
    eventId: "evt-hockey-3",
    headline: "Ключевой защитник гостей пропустит матч",
    explanation:
      "Дмитрий Орлов — лидер обороны Arctic Kings по среднему игровому времени в этом сезоне. Его отсутствие ослабляет первую пару защитников и может открыть больше пространства для атак Steel Bears.",
    importance: "high",
    createdAt: daysFromNow(-1, 10, 30),
    source: getSource("src-sportswire"),
  },
  {
    id: "intel-5",
    eventId: "evt-hockey-3",
    headline: "Команды показывают близкую результативность",
    explanation:
      "В среднем обе команды забивают и пропускают в пределах одной шайбы разницы за последние 5 игр — по статистике сезона матч выглядит равным.",
    importance: "medium",
    createdAt: daysFromNow(-2, 9, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-6",
    eventId: "evt-hockey-3",
    headline: "Серия очных встреч без явного фаворита",
    explanation:
      "Три из последних четырёх матчей между этими командами завершились с разницей в одну шайбу — историческая статистика не выделяет явного фаворита на эту игру.",
    importance: "low",
    createdAt: daysFromNow(-3, 9, 0),
    source: getSource("src-statcenter"),
  },

  // --------------------------------------------------------------------
  // Below: Match Intelligence for every other scheduled (upcoming) event.
  // Two insights per match, built from that event's own prediction
  // factors (see predictions.ts) rather than new invented facts, so the
  // "What changed?" panel and the AI Match Analysis stay consistent.
  // --------------------------------------------------------------------
  {
    id: "intel-7",
    eventId: "evt-football-4",
    headline: "Iron Coast SC подходят к матчу в лучшей форме",
    explanation:
      "Гости выиграли 3 из последних 5 матчей против 2 побед Sterling FC — небольшое преимущество в динамике результатов смещает прогноз в сторону выездной команды.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-8",
    eventId: "evt-football-4",
    headline: "Явного фаворита по личным встречам нет",
    explanation:
      "Статистика очных матчей последних сезонов между Sterling FC и Iron Coast SC примерно равная — история встреч не даёт заметного преимущества ни одной из команд.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-9",
    eventId: "evt-football-6",
    headline: "Real Alcazar подходят к игре в лучшей форме",
    explanation:
      "Хозяева выиграли 3 из последних 5 матчей против 2 побед Vantage Athletic — преимущество в динамике результатов на стороне Real Alcazar.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-10",
    eventId: "evt-football-6",
    headline: "Real Alcazar сильны на своём поле",
    explanation:
      "В этом сезоне команда стабильно набирает очки в домашних матчах — дополнительный фактор в пользу хозяев в игре с Vantage Athletic.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-11",
    eventId: "evt-football-7",
    headline: "Sterling FC превосходят соперника по числу побед",
    explanation:
      "В последних 5 матчах Sterling FC одержали 3 победы против 2 у Meridian City — небольшое преимущество в форме перед личной встречей.",
    importance: "medium",
    createdAt: daysFromNow(0, 11, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-12",
    eventId: "evt-football-7",
    headline: "Meridian City результативнее на своём поле",
    explanation:
      "В среднем команда набирает на 0.3 очка за матч больше дома, чем на выезде — фактор, частично компенсирующий более слабую форму хозяев.",
    importance: "low",
    createdAt: daysFromNow(0, 15, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-13",
    eventId: "evt-hockey-2",
    headline: "Arctic Kings подходят к игре в куда лучшей форме",
    explanation:
      "Хозяева выиграли 3 из последних 5 игр, тогда как Redline HC — только одну. Разрыв в текущей динамике результатов заметно смещает прогноз в пользу Arctic Kings.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-14",
    eventId: "evt-hockey-2",
    headline: "История очных встреч на стороне хозяев",
    explanation:
      "Последние личные встречи команд чаще складывались в пользу Arctic Kings — ещё один фактор в пользу хозяев перед этой игрой.",
    importance: "low",
    createdAt: daysFromNow(-1, 13, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-15",
    eventId: "evt-hockey-6",
    headline: "Southern Comets выигрывают чаще соперника",
    explanation:
      "В последних 5 матчах хозяева одержали 3 победы против 2 у Vulcan Reign — небольшое, но заметное преимущество в форме.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-16",
    eventId: "evt-hockey-6",
    headline: "Southern Comets сильны на своей арене",
    explanation:
      "В этом сезоне команда стабильно набирает очки в домашних матчах на Comet Bay Arena, что дополнительно усиливает статус фаворита.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-17",
    eventId: "evt-hockey-7",
    headline: "Frost Wolves ощутимо превосходят соперника по форме",
    explanation:
      "Хозяева выиграли 3 из последних 5 матчей против всего одной победы Redline HC — один из самых заметных разрывов в форме среди ближайших игр тура.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-18",
    eventId: "evt-hockey-7",
    headline: "Frost Wolves — одна из самых надёжных оборон в лиге",
    explanation:
      "Команда пропускает меньше шайб в среднем за матч, чем большинство соперников в этом сезоне, что играет на руку хозяевам в игре с Redline HC.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-19",
    eventId: "evt-tennis-2",
    headline: "Форма обеих спортсменок практически равная",
    explanation:
      "Takahashi и Okafor выиграли по 3 из последних 5 матчей — статистика формы не выделяет явного фаворита перед их встречей.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-20",
    eventId: "evt-tennis-2",
    headline: "Данные личных встреч не дают преимущества ни одной из сторон",
    explanation:
      "Статистика очных матчей между Takahashi и Okafor слишком ограничена, чтобы выделить фаворита — прогноз строится почти исключительно на текущей форме.",
    importance: "low",
    createdAt: daysFromNow(-1, 13, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-21",
    eventId: "evt-tennis-3",
    headline: "Volkov подходит к матчу в лучшей форме",
    explanation:
      "Спортсмен выиграл 4 из последних 5 матчей на этом покрытии — один из самых убедительных показателей формы среди участников турнира.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-22",
    eventId: "evt-tennis-3",
    headline: "Volkov уверенно ведёт в личных встречах",
    explanation:
      "В очных матчах с Takahashi счёт 3-1 в пользу Volkov — статистика личных встреч заметно усиливает статус фаворита.",
    importance: "low",
    createdAt: daysFromNow(-1, 13, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-23",
    eventId: "evt-tennis-5",
    headline: "Andersson выигрывает заметно чаще соперника",
    explanation:
      "Спортсмен одержал 4 победы в последних 5 матчах против 3 побед Costa — разрыв в форме, который стоит учитывать при прогнозе.",
    importance: "medium",
    createdAt: daysFromNow(-1, 10, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-24",
    eventId: "evt-tennis-5",
    headline: "Дебют в основной сетке добавляет неопределённости",
    explanation:
      "Andersson впервые выступает в основной сетке турнира этого уровня — фактор, который может повлиять на игру сильнее, чем показывает статистика формы.",
    importance: "low",
    createdAt: daysFromNow(-1, 14, 0),
    source: getSource("src-sportswire"),
  },
  {
    id: "intel-25",
    eventId: "evt-tennis-6",
    headline: "Форма обеих спортсменок почти идентична",
    explanation:
      "Ferreira и Andersson выиграли по 4 из последних 5 матчей — статистика формы не даёт заметного преимущества ни одной из сторон.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-26",
    eventId: "evt-tennis-6",
    headline: "Ferreira сильнее на этом типе покрытия",
    explanation:
      "По статистике сезона Ferreira показывает лучшие результаты именно на этом покрытии, что становится дополнительным фактором в её пользу.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-27",
    eventId: "evt-tennis-7",
    headline: "Форма обеих спортсменок примерно равная",
    explanation:
      "Costa и Okafor выиграли по 3 из последних 5 матчей — статистика текущей формы не выделяет явного фаворита перед этой встречей.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-28",
    eventId: "evt-tennis-7",
    headline: "Статистики личных встреч пока недостаточно",
    explanation:
      "Данных об очных матчах между Costa и Okafor слишком мало, чтобы выделить фаворита — модель полагается в основном на текущую форму.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-29",
    eventId: "evt-cs2-3",
    headline: "Nova Sentinel выигрывают карту за картой",
    explanation:
      "Команда выиграла 4 из последних 5 карт подряд и подходит к матчу с Vertex Gaming в статусе фаворита по текущей форме.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-30",
    eventId: "evt-cs2-3",
    headline: "Пул карт может сыграть в пользу Vertex Gaming",
    explanation:
      "Vertex Gaming традиционно сильнее на картах с закрытыми позициями — это стоит учитывать при разборе возможного пула карт серии.",
    importance: "low",
    createdAt: daysFromNow(-1, 13, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-31",
    eventId: "evt-cs2-5",
    headline: "Iron Sight выигрывают третью карту подряд",
    explanation:
      "Команда показывает лучший тренд формы среди участников этого матча, что и склоняет прогноз в пользу гостей.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-32",
    eventId: "evt-cs2-5",
    headline: "Iron Sight обновили пул карт перед турниром",
    explanation:
      "Изменения в пуле карт перед стартом турнира могут дать Iron Sight фактор неожиданности в матче с Phantom Six.",
    importance: "low",
    createdAt: daysFromNow(-1, 13, 30),
    source: getSource("src-sportswire"),
  },
  {
    id: "intel-33",
    eventId: "evt-cs2-6",
    headline: "Nova Sentinel заметно превосходят соперника по форме",
    explanation:
      "Команда выиграла 4 из последних 5 карт против 3 у Phantom Six — один из самых уверенных показателей формы в туре.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-34",
    eventId: "evt-cs2-6",
    headline: "Nova Sentinel уверенно выступают на домашних для себя турнирах",
    explanation:
      "Статистика сезона показывает стабильно высокие результаты команды на турнирах, которые она считает домашними — дополнительный фактор в её пользу.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-35",
    eventId: "evt-cs2-7",
    headline: "Форма обеих команд практически равная",
    explanation:
      "Crimson Wolves и Iron Sight выиграли по 3 из последних 5 карт — статистика формы не выделяет явного фаворита перед матчем.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-36",
    eventId: "evt-cs2-7",
    headline: "Статистика личных встреч ограничена",
    explanation:
      "Данных об очных матчах между командами немного, что затрудняет выделение явного фаворита — прогноз строится в основном на текущей форме.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-37",
    eventId: "evt-dota-2-3",
    headline: "Ember Guard выиграли последнюю серию всухую",
    explanation:
      "Команда закрыла предыдущую серию со счётом 2:0 и подходит к матчу с Titan Forge в статусе лёгкого фаворита по текущей форме.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-38",
    eventId: "evt-dota-2-3",
    headline: "Titan Forge сильны на раннем этапе игры",
    explanation:
      "Команда демонстрирует сильную раннюю игру в последних турнирах — фактор, способный компенсировать менее уверенную текущую форму.",
    importance: "low",
    createdAt: daysFromNow(-1, 13, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-39",
    eventId: "evt-dota-2-5",
    headline: "Ashen Pact подходят к дебюту турнира в лучшей форме",
    explanation:
      "Команда выиграла 3 из последних 5 игр и считается фаворитом по текущей динамике результатов перед матчем с Void Legion.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-40",
    eventId: "evt-dota-2-5",
    headline: "У команд нет статистики личных встреч",
    explanation:
      "Void Legion и Ashen Pact ранее не встречались — прогноз строится исключительно на данных о текущей форме команд.",
    importance: "low",
    createdAt: daysFromNow(-1, 13, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-41",
    eventId: "evt-dota-2-6",
    headline: "Ember Guard уверенно превосходят соперника по форме",
    explanation:
      "Команда выиграла 4 из последних 5 игр против 3 у Void Legion — заметное преимущество в текущей динамике результатов.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-42",
    eventId: "evt-dota-2-6",
    headline: "Ember Guard делают ставку на агрессивный ранний драфт",
    explanation:
      "Такой подход к драфту уже приносил команде преимущество на старте карты в предыдущих матчах турнира.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-43",
    eventId: "evt-dota-2-7",
    headline: "Форма обеих команд практически равная",
    explanation:
      "Null Pointer и Ashen Pact выиграли по 3 из последних 5 игр — статистика формы не даёт заметного преимущества ни одной из сторон.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-44",
    eventId: "evt-dota-2-7",
    headline: "Ashen Pact стабильнее играют на поздней стадии матчей",
    explanation:
      "Команда демонстрирует более уверенную игру в поздней стадии встреч по статистике турнира — фактор, который может оказаться решающим в равном матче.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-45",
    eventId: "evt-mlbb-5",
    headline: "Crimson Tide заметно превосходят соперника по форме",
    explanation:
      "Команда выиграла 4 из последних 5 матчей против 3 у Storm Vanguard — существенное преимущество в текущей динамике результатов.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-46",
    eventId: "evt-mlbb-5",
    headline: "Обе команды дебютируют в основной сетке турнира",
    explanation:
      "Отсутствие опыта выступлений на этой стадии турнира добавляет неопределённости в прогноз для обеих команд.",
    importance: "low",
    createdAt: daysFromNow(-1, 13, 30),
    source: getSource("src-sportswire"),
  },
  {
    id: "intel-47",
    eventId: "evt-mlbb-6",
    headline: "Форма обеих команд почти идентична",
    explanation:
      "Solar Flare и Crimson Tide выиграли по 4 из последних 5 матчей — статистика формы не выделяет явного фаворита перед игрой.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-48",
    eventId: "evt-mlbb-6",
    headline: "Solar Flare — действующие финалисты турнира",
    explanation:
      "Команда защищает прошлогодний результат и играет по турнирной сетке на своей стороне — статусный фактор в пользу хозяев.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 0),
    source: getSource("src-sportswire"),
  },
  {
    id: "intel-49",
    eventId: "evt-mlbb-7",
    headline: "Форма обеих команд примерно равная",
    explanation:
      "Nightfall Squad и Storm Vanguard выиграли по 3 из последних 5 матчей — статистика формы не даёт заметного преимущества ни одной из сторон.",
    importance: "medium",
    createdAt: daysFromNow(0, 10, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-50",
    eventId: "evt-mlbb-7",
    headline: "Данные о личных встречах команд ограничены",
    explanation:
      "Статистика очных матчей между Nightfall Squad и Storm Vanguard пока небольшая — модель опирается в основном на текущую форму.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 30),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-51",
    eventId: "evt-mlbb-3",
    headline: "Solar Flare подходят к матчу в уверенной форме",
    explanation:
      "Команда выиграла 4 из последних 5 матчей — один из лучших показателей формы среди участников турнира на этой стадии.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-52",
    eventId: "evt-mlbb-3",
    headline: "Solar Flare выигрывают серию последних очных встреч",
    explanation:
      "В двух предыдущих личных матчах с Golden Spire победа осталась за Solar Flare — ещё один фактор в пользу фаворита.",
    importance: "low",
    createdAt: daysFromNow(-1, 13, 0),
    source: getSource("src-statcenter"),
  },

  // --------------------------------------------------------------------
  // UFC — same approach as above: insights built from each fight's own
  // prediction factors (see predictions.ts), not new invented facts.
  // --------------------------------------------------------------------
  {
    id: "intel-53",
    eventId: "evt-ufc-3",
    headline: "Оба бойца подходят к поединку в равной форме",
    explanation:
      "Vance выиграл 4 из последних 5 боёв, у Osei — тот же показатель. Статистика формы не даёт явного фаворита перед этим поединком.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-54",
    eventId: "evt-ufc-3",
    headline: "Vance чаще завершает бои досрочно",
    explanation:
      "По статистике последних поединков Vance чаще доводит бой до досрочной победы, чем Osei — небольшой, но реальный фактор в его пользу.",
    importance: "low",
    createdAt: daysFromNow(-1, 13, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-55",
    eventId: "evt-ufc-5",
    headline: "Salvatore подходит к бою в лучшей форме",
    explanation:
      "Salvatore выиграл 4 из последних 5 боёв против 3 у Banks — заметное преимущество в текущей форме смещает прогноз в его сторону.",
    importance: "medium",
    createdAt: daysFromNow(-1, 9, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-56",
    eventId: "evt-ufc-5",
    headline: "Salvatore реже пропускает удары в стойке",
    explanation:
      "Статистика последних боёв показывает, что Salvatore лучше защищается в стойке — ещё один фактор в его пользу против Banks.",
    importance: "low",
    createdAt: daysFromNow(-1, 14, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-57",
    eventId: "evt-ufc-6",
    headline: "Banks выходит на бой на серии из трёх побед подряд",
    explanation:
      "Несмотря на то что по итогам последних 5 боёв Vance выигрывает чаще (4 против 3 у Banks), сам Banks сейчас находится в серии из трёх побед подряд — фактор растущей уверенности, который стоит учитывать.",
    importance: "medium",
    createdAt: daysFromNow(0, 9, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-58",
    eventId: "evt-ufc-6",
    headline: "Vance стабильнее в партере",
    explanation:
      "По статистике последних боёв Vance чаще доводит преимущество в партере до досрочной победы — фактор, который может сыграть решающую роль против Banks.",
    importance: "low",
    createdAt: daysFromNow(0, 13, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-59",
    eventId: "evt-ufc-7",
    headline: "Salvatore выигрывает заметно чаще Zima",
    explanation:
      "Salvatore выиграл 4 из последних 5 боёв против 3 у Zima — один из самых заметных разрывов в форме среди предстоящих поединков карда.",
    importance: "high",
    createdAt: daysFromNow(0, 9, 0),
    source: getSource("src-statcenter"),
  },
  {
    id: "intel-60",
    eventId: "evt-ufc-7",
    headline: "Salvatore выигрывает больше раундов по ударной статистике",
    explanation:
      "В среднем за бой Salvatore выигрывает больше раундов по значимым ударам, чем Zima — ещё один фактор в пользу фаворита этого поединка.",
    importance: "low",
    createdAt: daysFromNow(0, 14, 0),
    source: getSource("src-statcenter"),
  },
];

function localizeInsight(insight: IntelligenceInsight, locale: AppLocale): IntelligenceInsight {
  return localize(insight, locale, { en: INTELLIGENCE_EN });
}

export function getInsightsForEvent(eventId: string, locale: AppLocale = "ru"): IntelligenceInsight[] {
  const mockMatches = INTELLIGENCE_INSIGHTS.filter((i) => i.eventId === eventId).map((i) => localizeInsight(i, locale));
  // Real events' insights (see scripts/fetch-real-events.mjs) are already
  // localized per language at generation time, so they bypass localizeInsight().
  const real = locale === "en" ? REAL_INSIGHTS_EN : REAL_INSIGHTS_RU;
  const realMatches = real.filter((i) => i.eventId === eventId);
  return [...mockMatches, ...realMatches].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 } as const;
    return order[a.importance] - order[b.importance];
  });
}
