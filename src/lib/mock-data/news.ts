import type { News } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";
import { daysFromNow, localize } from "./helpers";
import { getSource } from "./sources";
import { NEWS_EN } from "./i18n/news.en";

export const NEWS: News[] = [
  {
    id: "news-1",
    title: "Тренер Northbridge United подтвердил серьёзность травмы капитана",
    slug: "northbridge-united-injury-update",
    excerpt:
      "Марко Делич пропустит ближайший матч с Real Alcazar — клуб подтвердил травму задней поверхности бедра.",
    content:
      "Главный тренер Northbridge United подтвердил на пресс-конференции, что нападающий Марко Делич получил повреждение на тренировке и не сможет сыграть в ближайшем матче против Real Alcazar. По предварительным данным, речь идёт о минимум одной пропущенной игре.\n\nДелич — лучший бомбардир команды в этом сезоне, и его отсутствие станет серьёзным испытанием для атаки хозяев.",
    image: "/images/football.jpg",
    sport: "football",
    competition: "comp-football-1",
    relatedTeamIds: ["team-football-1", "team-football-2"],
    publishedAt: daysFromNow(-1, 13, 0),
    updatedAt: daysFromNow(-1, 13, 0),
    source: getSource("src-sportswire"),
    tags: ["football", "injury", "Northbridge United"],
  },
  {
    id: "news-2",
    title: "Real Alcazar выходят на пике формы перед выездной игрой",
    slug: "real-alcazar-form-preview",
    excerpt: "Четыре матча без поражений — команда подходит к игре с Northbridge United в лучшем состоянии сезона.",
    content:
      "Real Alcazar одержали три победы и сыграли вничью в последних четырёх матчах во всех турнирах. Тренерский штаб отмечает возросшую стабильность в обороне как ключевой фактор этой серии.",
    image: "/images/football.jpg",
    sport: "football",
    competition: "comp-football-1",
    relatedTeamIds: ["team-football-2"],
    publishedAt: daysFromNow(-2, 10, 0),
    updatedAt: daysFromNow(-2, 10, 0),
    source: getSource("src-statcenter"),
    tags: ["football", "form", "Real Alcazar"],
  },
  {
    id: "news-3",
    title: "Frost Wolves подписали нового защитника перед стартом плей-офф",
    slug: "frost-wolves-new-signing",
    excerpt: "Клуб усилил оборонительную линию накануне решающего отрезка сезона.",
    content:
      "Frost Wolves объявили о подписании нового защитника, который сразу пополнит заявку команды. Руководство клуба рассчитывает, что усиление поможет в оставшихся играх регулярного сезона.",
    image: "/images/hockey.jpg",
    sport: "hockey",
    competition: "comp-hockey-1",
    relatedTeamIds: ["team-hockey-1"],
    publishedAt: daysFromNow(-1, 11, 0),
    updatedAt: daysFromNow(-1, 11, 0),
    source: getSource("src-sportswire"),
    tags: ["hockey", "transfer", "Frost Wolves"],
  },
  {
    id: "news-4",
    title: "Volkov уверенно вышел в следующий круг Grand Circuit Masters",
    slug: "volkov-advances-grand-circuit",
    excerpt: "Победа в двух сетах позволила Volkov сохранить серию из четырёх побед подряд.",
    content:
      "D. Volkov обыграл M. Ferreira и продолжает уверенно выступать на турнире. Тренерский штаб отмечает стабильную подачу как главное оружие спортсмена в этом сезоне.",
    image: "/images/tennis.jpg",
    sport: "tennis",
    competition: "comp-tennis-1",
    relatedTeamIds: ["team-tennis-1"],
    publishedAt: daysFromNow(-3, 16, 0),
    updatedAt: daysFromNow(-3, 16, 0),
    source: getSource("src-statcenter"),
    tags: ["tennis", "Grand Circuit Masters"],
  },
  {
    id: "news-5",
    title: "Nova Sentinel меняют состав перед Apex Championship Series",
    slug: "nova-sentinel-roster-change",
    excerpt: "Команда объявила ротацию в составе за неделю до старта турнира.",
    content:
      "Nova Sentinel подтвердили изменение состава перед стартом Apex Championship Series. Руководство организации рассчитывает, что перестановка усилит игру на закрытых картах пула.",
    image: "/images/cs2.jpg",
    sport: "cs2",
    competition: "comp-cs2-1",
    relatedTeamIds: ["team-cs2-1"],
    publishedAt: daysFromNow(-2, 14, 0),
    updatedAt: daysFromNow(-2, 14, 0),
    source: getSource("src-sportswire"),
    tags: ["cs2", "roster", "Nova Sentinel"],
  },
  {
    id: "news-6",
    title: "Ember Guard представили новую драфт-стратегию перед Global Rift Invitational",
    slug: "ember-guard-draft-strategy",
    excerpt: "Аналитики отмечают смещение в сторону раннего давления на карте.",
    content:
      "В последних показательных играх Ember Guard чаще выбирают агрессивный ранний драфт, что уже принесло команде две уверенные победы.",
    image: "/images/dota-2.jpg",
    sport: "dota-2",
    competition: "comp-dota-2-1",
    relatedTeamIds: ["team-dota-2-1"],
    publishedAt: daysFromNow(-1, 15, 0),
    updatedAt: daysFromNow(-1, 15, 0),
    source: getSource("src-statcenter"),
    tags: ["dota-2", "strategy", "Ember Guard"],
  },
  {
    id: "news-7",
    title: "Solar Flare одержали камбэк-победу в полуфинале Bracket Royale Series",
    slug: "solar-flare-comeback-win",
    excerpt: "Команда отыгралась после отставания и вышла в финал турнира.",
    content:
      "Solar Flare проиграли первую карту, но собрались и выиграли следующие две, обеспечив себе место в финале Bracket Royale Series.",
    image: "/images/mobile-legends.jpg",
    sport: "mobile-legends",
    competition: "comp-mlbb-1",
    relatedTeamIds: ["team-mlbb-1"],
    publishedAt: daysFromNow(0, 8, 0),
    updatedAt: daysFromNow(0, 8, 0),
    source: getSource("src-sportswire"),
    tags: ["mobile-legends", "Solar Flare"],
  },
  {
    id: "news-8",
    title: "Sterling FC не проигрывают три матча подряд перед выездной игрой",
    slug: "sterling-fc-unbeaten-run",
    excerpt: "Клуб подходит к матчу с Meridian City в одной из лучших серий сезона.",
    content:
      "Sterling FC набрали 7 очков в последних трёх матчах турнира и заметно прибавили в обороне. Тренерский штаб отмечает, что команда впервые за сезон пропускает меньше одного гола за игру в среднем.",
    image: "/images/football.jpg",
    sport: "football",
    competition: "comp-football-1",
    relatedTeamIds: ["team-football-3"],
    publishedAt: daysFromNow(-1, 9, 0),
    updatedAt: daysFromNow(-1, 9, 0),
    source: getSource("src-statcenter"),
    tags: ["football", "form", "Sterling FC"],
  },
  {
    id: "news-9",
    title: "Meridian City объявили состав на матч с Sterling FC",
    slug: "meridian-city-squad-announcement",
    excerpt: "Клуб подтвердил, что вся основная обойма игроков доступна к отбору.",
    content:
      "Meridian City не имеют кадровых проблем перед домашней игрой с Sterling FC — тренерский штаб подтвердил, что вся основная обойма игроков в строю и готова к матчу.",
    image: "/images/football.jpg",
    sport: "football",
    competition: "comp-football-1",
    relatedTeamIds: ["team-football-6"],
    publishedAt: daysFromNow(0, 8, 30),
    updatedAt: daysFromNow(0, 8, 30),
    source: getSource("src-sportswire"),
    tags: ["football", "lineup", "Meridian City"],
  },
  {
    id: "news-10",
    title: "Arctic Kings подтвердили травму защитника перед игрой со Steel Bears",
    slug: "arctic-kings-defenseman-injury",
    excerpt: "Дмитрий Орлов пропустит матч — его место в первой паре защитников займёт Andre Silva.",
    content:
      "Клуб подтвердил, что защитник Дмитрий Орлов получил повреждение запястья в предыдущей игре и не сыграет против Steel Bears. Тренерский штаб рассчитывает закрыть образовавшуюся брешь силами Andre Silva.",
    image: "/images/hockey.jpg",
    sport: "hockey",
    competition: "comp-hockey-1",
    relatedTeamIds: ["team-hockey-3", "team-hockey-2"],
    publishedAt: daysFromNow(-1, 11, 0),
    updatedAt: daysFromNow(-1, 11, 0),
    source: getSource("src-sportswire"),
    tags: ["hockey", "injury", "Arctic Kings"],
  },
  {
    id: "news-11",
    title: "Redline HC и Southern Comets сыграли вничью в равной игре",
    slug: "redline-southern-comets-draw",
    excerpt: "Команды обменялись голами по ходу встречи — итоговый счёт 2:2.",
    content:
      "Матч между Redline HC и Southern Comets получился результативным: обе команды по очереди выходили вперёд, а итоговый счёт 2:2 отражает равную борьбу на протяжении всей игры.",
    image: "/images/hockey.jpg",
    sport: "hockey",
    competition: "comp-hockey-1",
    relatedTeamIds: ["team-hockey-4", "team-hockey-5"],
    publishedAt: daysFromNow(0, 12, 0),
    updatedAt: daysFromNow(0, 12, 0),
    source: getSource("src-statcenter"),
    tags: ["hockey", "Redline HC", "Southern Comets"],
  },
  {
    id: "news-12",
    title: "Vulcan Reign проанализировали поражение от Frost Wolves",
    slug: "vulcan-reign-loss-review",
    excerpt: "Тренерский штаб назвал реализацию большинства главной проблемой встречи.",
    content:
      "После поражения 3:5 от Frost Wolves тренерский штаб Vulcan Reign отметил, что команда реализовала только одно из пяти большинств — именно это, по их мнению, стало решающим фактором матча.",
    image: "/images/hockey.jpg",
    sport: "hockey",
    competition: "comp-hockey-1",
    relatedTeamIds: ["team-hockey-6", "team-hockey-1"],
    publishedAt: daysFromNow(-3, 10, 0),
    updatedAt: daysFromNow(-3, 10, 0),
    source: getSource("src-statcenter"),
    tags: ["hockey", "review", "Vulcan Reign"],
  },
  {
    id: "news-13",
    title: "Andersson дебютирует в основной сетке Grand Circuit Masters",
    slug: "andersson-main-draw-debut",
    excerpt: "Молодой игрок впервые сыграет в основной сетке турнира этого уровня.",
    content:
      "L. Andersson получил wildcard в основную сетку Grand Circuit Masters и сыграет свой дебютный матч на турнире такого уровня против R. Costa. Аналитики отмечают быструю подачу как главное оружие спортсмена.",
    image: "/images/tennis.jpg",
    sport: "tennis",
    competition: "comp-tennis-1",
    relatedTeamIds: ["team-tennis-5"],
    publishedAt: daysFromNow(-1, 10, 0),
    updatedAt: daysFromNow(-1, 10, 0),
    source: getSource("src-sportswire"),
    tags: ["tennis", "debut", "Andersson"],
  },
  {
    id: "news-14",
    title: "Okafor восстановился после перерыва и готов к матчу с Costa",
    slug: "okafor-return-from-break",
    excerpt: "Спортсмен пропустил один турнир из-за перегрузки и возвращается на корт.",
    content:
      "J. Okafor подтвердил готовность к матчу против R. Costa после короткого перерыва, вызванного мышечной перегрузкой. Тренерский штаб не ожидает ограничений по нагрузке.",
    image: "/images/tennis.jpg",
    sport: "tennis",
    competition: "comp-tennis-1",
    relatedTeamIds: ["team-tennis-4"],
    publishedAt: daysFromNow(-2, 9, 0),
    updatedAt: daysFromNow(-2, 9, 0),
    source: getSource("src-statcenter"),
    tags: ["tennis", "Okafor"],
  },
  {
    id: "news-15",
    title: "Ferreira нацелена на серию побед после уверенного выхода в следующий круг",
    slug: "ferreira-momentum-after-win",
    excerpt: "Игрок отмечает уверенность в игре с задней линии как ключевой фактор недавних побед.",
    content:
      "M. Ferreira продолжает уверенную серию выступлений на Grand Circuit Masters и рассчитывает продолжить её в предстоящих матчах против Andersson и Volkov.",
    image: "/images/tennis.jpg",
    sport: "tennis",
    competition: "comp-tennis-1",
    relatedTeamIds: ["team-tennis-2"],
    publishedAt: daysFromNow(-3, 12, 0),
    updatedAt: daysFromNow(-3, 12, 0),
    source: getSource("src-sportswire"),
    tags: ["tennis", "form", "Ferreira"],
  },
  {
    id: "news-16",
    title: "Iron Sight представили дебютную карту в пуле перед Apex Championship Series",
    slug: "iron-sight-map-pool-debut",
    excerpt: "Команда добавила новую карту в турнирный пул за неделю до старта серии.",
    content:
      "Iron Sight объявили о добавлении новой карты в соревновательный пул. По словам капитана команды, изменение отражает смещение приоритетов в тренировочном процессе последних недель.",
    image: "/images/cs2.jpg",
    sport: "cs2",
    competition: "comp-cs2-1",
    relatedTeamIds: ["team-cs2-6"],
    publishedAt: daysFromNow(-1, 13, 0),
    updatedAt: daysFromNow(-1, 13, 0),
    source: getSource("src-statcenter"),
    tags: ["cs2", "Iron Sight"],
  },
  {
    id: "news-17",
    title: "Crimson Wolves подтвердили состав на игру с Iron Sight",
    slug: "crimson-wolves-lineup-confirmed",
    excerpt: "Основной состав команды остаётся неизменным перед матчем.",
    content:
      "Crimson Wolves подтвердили, что выйдут на матч против Iron Sight в неизменном составе — том же, что принёс победу над Obsidian Five в предыдущем туре.",
    image: "/images/cs2.jpg",
    sport: "cs2",
    competition: "comp-cs2-1",
    relatedTeamIds: ["team-cs2-4"],
    publishedAt: daysFromNow(0, 9, 0),
    updatedAt: daysFromNow(0, 9, 0),
    source: getSource("src-sportswire"),
    tags: ["cs2", "lineup", "Crimson Wolves"],
  },
  {
    id: "news-18",
    title: "Vertex Gaming проанализировали поражение от Nova Sentinel",
    slug: "vertex-gaming-loss-analysis",
    excerpt: "Тренерский штаб отметил слабую игру на закрытых позициях как ключевую проблему.",
    content:
      "После поражения от Nova Sentinel тренерский штаб Vertex Gaming назвал игру на закрытых позициях главной точкой роста перед предстоящими матчами турнира.",
    image: "/images/cs2.jpg",
    sport: "cs2",
    competition: "comp-cs2-1",
    relatedTeamIds: ["team-cs2-3"],
    publishedAt: daysFromNow(-2, 15, 0),
    updatedAt: daysFromNow(-2, 15, 0),
    source: getSource("src-statcenter"),
    tags: ["cs2", "review", "Vertex Gaming"],
  },
  {
    id: "news-19",
    title: "Void Legion и Ashen Pact встретятся в дебютном матче турнира",
    slug: "void-legion-ashen-pact-debut",
    excerpt: "Обе команды проведут первую игру турнира друг против друга.",
    content:
      "Void Legion и Ashen Pact сыграют свои дебютные матчи Global Rift Invitational друг против друга — аналитики называют встречу труднопредсказуемой из-за отсутствия статистики личных встреч.",
    image: "/images/dota-2.jpg",
    sport: "dota-2",
    competition: "comp-dota-2-1",
    relatedTeamIds: ["team-dota-2-5", "team-dota-2-6"],
    publishedAt: daysFromNow(-1, 14, 0),
    updatedAt: daysFromNow(-1, 14, 0),
    source: getSource("src-sportswire"),
    tags: ["dota-2", "Void Legion", "Ashen Pact"],
  },
  {
    id: "news-20",
    title: "Null Pointer одержали победу над Shadow Circuit в стартовом раунде",
    slug: "null-pointer-opening-round-win",
    excerpt: "Уверенная игра на драфте принесла команде победу со счётом 2:0.",
    content:
      "Null Pointer обыграли Shadow Circuit со счётом 2:0 в стартовом раунде турнира. Аналитики отмечают сильный контроль карты во второй половине обеих игр как ключевой фактор победы.",
    image: "/images/dota-2.jpg",
    sport: "dota-2",
    competition: "comp-dota-2-1",
    relatedTeamIds: ["team-dota-2-4", "team-dota-2-2"],
    publishedAt: daysFromNow(-2, 16, 0),
    updatedAt: daysFromNow(-2, 16, 0),
    source: getSource("src-statcenter"),
    tags: ["dota-2", "Null Pointer"],
  },
  {
    id: "news-21",
    title: "Titan Forge усилили состав перед матчем с Null Pointer",
    slug: "titan-forge-roster-boost",
    excerpt: "Команда объявила о временном усилении состава на ближайшие игры турнира.",
    content:
      "Titan Forge объявили об изменении в составе перед предстоящей игрой с Null Pointer. Руководство организации рассчитывает, что перестановка добавит команде вариативности на драфте.",
    image: "/images/dota-2.jpg",
    sport: "dota-2",
    competition: "comp-dota-2-1",
    relatedTeamIds: ["team-dota-2-3"],
    publishedAt: daysFromNow(-1, 9, 30),
    updatedAt: daysFromNow(-1, 9, 30),
    source: getSource("src-sportswire"),
    tags: ["dota-2", "roster", "Titan Forge"],
  },
  {
    id: "news-22",
    title: "Crimson Tide дебютируют в Bracket Royale Series матчем против Storm Vanguard",
    slug: "crimson-tide-series-debut",
    excerpt: "Новая команда турнира проведёт первую игру в основной сетке.",
    content:
      "Crimson Tide сыграют свой дебютный матч Bracket Royale Series против Storm Vanguard. Обе команды новички основной сетки турнира в этом сезоне.",
    image: "/images/mobile-legends.jpg",
    sport: "mobile-legends",
    competition: "comp-mlbb-1",
    relatedTeamIds: ["team-mlbb-5", "team-mlbb-6"],
    publishedAt: daysFromNow(-1, 10, 0),
    updatedAt: daysFromNow(-1, 10, 0),
    source: getSource("src-sportswire"),
    tags: ["mobile-legends", "Crimson Tide", "Storm Vanguard"],
  },
  {
    id: "news-23",
    title: "Nightfall Squad проанализировали победу над Rapid Fang",
    slug: "nightfall-squad-win-review",
    excerpt: "Команда отмечает уверенную игру на позднем этапе матча.",
    content:
      "После победы над Rapid Fang тренерский штаб Nightfall Squad отметил уверенную командную игру на позднем этапе матча как главный фактор успеха.",
    image: "/images/mobile-legends.jpg",
    sport: "mobile-legends",
    competition: "comp-mlbb-1",
    relatedTeamIds: ["team-mlbb-4", "team-mlbb-2"],
    publishedAt: daysFromNow(-2, 11, 0),
    updatedAt: daysFromNow(-2, 11, 0),
    source: getSource("src-statcenter"),
    tags: ["mobile-legends", "review", "Nightfall Squad"],
  },
  {
    id: "news-24",
    title: "Solar Flare готовятся к очному матчу с Crimson Tide",
    slug: "solar-flare-prepare-crimson-tide",
    excerpt: "Действующие финалисты турнира начали подготовку к следующему сопернику.",
    content:
      "Solar Flare начали подготовку к предстоящему матчу с Crimson Tide. Тренерский штаб отмечает, что команда изучает игровой стиль нового соперника турнира.",
    image: "/images/mobile-legends.jpg",
    sport: "mobile-legends",
    competition: "comp-mlbb-1",
    relatedTeamIds: ["team-mlbb-1"],
    publishedAt: daysFromNow(0, 9, 0),
    updatedAt: daysFromNow(0, 9, 0),
    source: getSource("src-sportswire"),
    tags: ["mobile-legends", "Solar Flare"],
  },
  {
    id: "news-25",
    title: "Zima по очкам обыграл Osei в главном событии карда",
    slug: "zima-defeats-osei-decision",
    excerpt: "Viktor Zima взял верх над Kenji Osei по итогам трёх раундов на UFC Fight Night.",
    content:
      "Viktor Zima одержал победу единогласным решением судей над Kenji Osei в главном бою вечера. Бой прошёл все три раунда без явного преимущества ни одного из бойцов до заключительных минут, когда Zima сумел выйти вперёд по значимым ударам.",
    image: "/images/ufc.jpg",
    sport: "ufc",
    competition: "comp-ufc-1",
    relatedTeamIds: ["team-ufc-3", "team-ufc-4"],
    publishedAt: daysFromNow(-4, 23, 30),
    updatedAt: daysFromNow(-4, 23, 30),
    source: getSource("src-sportswire"),
    tags: ["ufc", "Viktor Zima", "Kenji Osei"],
  },
  {
    id: "news-26",
    title: "Salvatore подтвердил форму перед боем с Banks",
    slug: "salvatore-form-preview-banks",
    excerpt: "4 победы в последних 5 боях — Rocco Salvatore подходит к поединку с Tyrell Banks фаворитом.",
    content:
      "Rocco Salvatore выиграл 4 из последних 5 боёв и, по данным тренерского штаба, полностью готов к предстоящему поединку с Tyrell Banks. Команда отмечает, что лагерь прошёл без сбоев и без смены веса в последнюю неделю.",
    image: "/images/ufc.jpg",
    sport: "ufc",
    competition: "comp-ufc-1",
    relatedTeamIds: ["team-ufc-6"],
    publishedAt: daysFromNow(-1, 10, 0),
    updatedAt: daysFromNow(-1, 10, 0),
    source: getSource("src-statcenter"),
    tags: ["ufc", "form", "Rocco Salvatore"],
  },
  {
    id: "news-27",
    title: "Banks выходит на бой с Vance на серии из трёх побед",
    slug: "banks-win-streak-vance-preview",
    excerpt: "Tyrell Banks не проигрывает три боя подряд перед поединком с Dominic Vance.",
    content:
      "Tyrell Banks подходит к бою с Dominic Vance в лучшей форме за последний год — три победы подряд, включая две досрочные. Тренерский штаб называет уверенность бойца ключевым фактором перед выходом в клетку против одного из лидеров дивизиона.",
    image: "/images/ufc.jpg",
    sport: "ufc",
    competition: "comp-ufc-1",
    relatedTeamIds: ["team-ufc-5", "team-ufc-1"],
    publishedAt: daysFromNow(0, 11, 0),
    updatedAt: daysFromNow(0, 11, 0),
    source: getSource("src-sportswire"),
    tags: ["ufc", "Tyrell Banks", "Dominic Vance"],
  },
  {
    id: "news-28",
    title: "Vance и Osei провели официальное взвешивание перед боем",
    slug: "vance-osei-weigh-in",
    excerpt: "Оба бойца уложились в лимит дивизиона на взвешивании накануне UFC Fight Night.",
    content:
      "Dominic Vance и Kenji Osei успешно прошли официальное взвешивание накануне поединка — оба бойца уложились в лимит дивизиона с первой попытки. Бой возглавит следующий кард UFC Fight Night.",
    image: "/images/ufc.jpg",
    sport: "ufc",
    competition: "comp-ufc-1",
    relatedTeamIds: ["team-ufc-1", "team-ufc-3"],
    publishedAt: daysFromNow(3, 18, 0),
    updatedAt: daysFromNow(3, 18, 0),
    source: getSource("src-statcenter"),
    tags: ["ufc", "Dominic Vance", "Kenji Osei"],
  },
];

/** Every free-text field lives in Russian directly on NEWS; this is the
 * one seam where an English request gets the translated copy instead —
 * see mock-data/i18n/news.en.ts and helpers.ts `localize`. */
function localizeNews(item: News, locale: AppLocale): News {
  return localize(item, locale, { en: NEWS_EN });
}

export function getNewsBySport(sport: string, limit?: number, locale: AppLocale = "ru"): News[] {
  const filtered = NEWS.filter((n) => n.sport === sport).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const page = limit ? filtered.slice(0, limit) : filtered;
  return page.map((n) => localizeNews(n, locale));
}

export function getNewsByTeam(teamId: string, limit?: number, locale: AppLocale = "ru"): News[] {
  const filtered = NEWS.filter((n) => n.relatedTeamIds?.includes(teamId)).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const page = limit ? filtered.slice(0, limit) : filtered;
  return page.map((n) => localizeNews(n, locale));
}

export function getLatestNews(limit?: number, locale: AppLocale = "ru"): News[] {
  const sorted = [...NEWS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const page = limit ? sorted.slice(0, limit) : sorted;
  return page.map((n) => localizeNews(n, locale));
}

export function getNewsBySlug(slug: string, locale: AppLocale = "ru"): News | undefined {
  const found = NEWS.find((n) => n.slug === slug);
  return found ? localizeNews(found, locale) : undefined;
}

export function getAllNews(locale: AppLocale = "ru"): News[] {
  return NEWS.map((n) => localizeNews(n, locale));
}
