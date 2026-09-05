import type { Article } from "@/lib/types";
import type { AppLocale } from "@/i18n/routing";
import { daysFromNow, localize } from "./helpers";
import { ARTICLES_EN } from "./i18n/articles.en";

/** The one fully-authored demo article required by the brief. */
export const ARTICLES: Article[] = [
  {
    id: "article-1",
    title: "Northbridge United — Real Alcazar: тактический разбор перед решающим матчем",
    slug: "northbridge-united-real-alcazar-tactical-preview",
    category: "Аналитика",
    sport: "football",
    image: "/images/football.jpg",
    publishedAt: daysFromNow(-1, 9, 0),
    updatedAt: daysFromNow(0, 8, 0),
    author: "SportsNew Editorial",
    excerpt:
      "Northbridge United принимают Real Alcazar в матче, который может определить лидера турнирной таблицы. Разбираем ключевые факторы: форму команд, потери в составе и статистику личных встреч.",
    intro:
      "Northbridge United примут Real Alcazar в одном из самых ожидаемых матчей тура. Обе команды подходят к игре в хорошей форме, но неожиданная потеря в составе хозяев может серьёзно повлиять на ход встречи.",
    body: [
      "Northbridge United набрали 10 очков в последних 5 матчах турнира и уверенно закрепились в верхней части таблицы. Команда демонстрирует одну из лучших домашних серий в лиге — 4 победы в последних 5 играх на своём поле.",
      "Однако накануне матча стало известно, что ключевой нападающий команды Марко Делич получил травму задней поверхности бедра на тренировке и пропустит игру. На счету Делича 40% голов команды в этом сезоне, поэтому его отсутствие — главный фактор неопределённости перед матчем.",
      "Real Alcazar, в свою очередь, подходят к игре в лучшей форме сезона: три победы и одна ничья в последних четырёх матчах во всех турнирах. Оборона гостей стала заметно стабильнее в последних играх, что подтверждается статистикой пропущенных моментов.",
      "Личные встречи команд в последних сезонах складывались упорно: из последних пяти очных матчей у хозяев две победы, у гостей одна, ещё две завершились вничью. В четырёх из этих пяти встреч был забит гол в каждом из таймов — фактор, который стоит учитывать при прогнозировании результативности.",
      "С учётом всех факторов — небольшого преимущества в форме и на своём поле у хозяев, но ощутимой потери в атаке — матч выглядит равным. Полный AI Match Analysis с разбивкой вероятностей исходов доступен на странице события.",
    ],
    stats: [
      { label: "Форма Northbridge United (5 матчей)", value: "W-W-D-L-W" },
      { label: "Форма Real Alcazar (5 матчей)", value: "L-W-W-W-D" },
      { label: "Личные встречи (последние 5)", value: "2-2-1" },
      { label: "Голы Марко Делича в сезоне", value: "40% от общих голов команды" },
    ],
    relatedEventIds: ["evt-football-featured"],
    relatedArticleSlugs: ["premier-league-form-guide-round-review"],
    tags: ["football", "preview", "tactics", "Northbridge United", "Real Alcazar"],
  },
  {
    id: "article-2",
    title: "Steel Bears — Arctic Kings: почему травма Орлова может решить исход матча",
    slug: "steel-bears-arctic-kings-preview",
    category: "Аналитика",
    sport: "hockey",
    image: "/images/hockey.jpg",
    publishedAt: daysFromNow(-1, 11, 0),
    updatedAt: daysFromNow(0, 9, 0),
    author: "SportsNew Editorial",
    excerpt:
      "Steel Bears принимают Arctic Kings в матче, где обе команды выглядят равными по статистике — но потеря ключевого защитника гостей может нарушить баланс.",
    intro:
      "Steel Bears и Arctic Kings подходят к очной встрече с похожими показателями результативности, а исход последних четырёх матчей команд не выявляет явного фаворита. Однако накануне игры стало известно об отсутствии ключевого защитника гостей — и это может изменить расклад.",
    body: [
      "По статистике сезона Steel Bears и Arctic Kings забивают в среднем 3.4 и 3.1 шайбы за матч соответственно, а пропускают 2.6 и 2.9 — разница минимальна, и по общей результативности команды выглядят равными.",
      "Ключевой новостью перед игрой стало повреждение запястья у защитника Arctic Kings Дмитрия Орлова — лидера обороны команды по среднему игровому времени в этом сезоне. Его место в первой паре защитников займёт Andre Silva, для которого это будет заметное повышение игрового времени.",
      "У хозяев в статусе under review находится нападающий Viktor Lindqvist — он играет через лёгкий дискомфорт в плече, но тренерский штаб не ожидает ограничений по времени на льду.",
      "Личные встречи команд в последних четырёх играх складывались очень плотно: три из четырёх матчей завершились с разницей в одну шайбу. С учётом ослабленной обороны гостей матч может сместиться в сторону Steel Bears, но статистика говорит о высокой вероятности равной игры до последних минут.",
      "Полный AI Match Analysis с разбивкой вероятностей исходов и всеми факторами доступен на странице события.",
    ],
    stats: [
      { label: "Форма Steel Bears (5 матчей)", value: "L-D-W-W-W" },
      { label: "Форма Arctic Kings (5 матчей)", value: "W-L-W-L-W" },
      { label: "Личные встречи (последние 4)", value: "2-2, 3 из 4 — разница в 1 шайбу" },
      { label: "Статус Дмитрия Орлова", value: "Пропускает матч (травма запястья)" },
    ],
    relatedEventIds: ["evt-hockey-3"],
    relatedArticleSlugs: [],
    tags: ["hockey", "preview", "Steel Bears", "Arctic Kings"],
  },
  {
    id: "article-3",
    title: "Volkov — Takahashi: обзор перед матчем на центральном корте",
    slug: "volkov-takahashi-preview",
    category: "Аналитика",
    sport: "tennis",
    image: "/images/tennis.jpg",
    publishedAt: daysFromNow(-2, 10, 0),
    updatedAt: daysFromNow(-1, 9, 0),
    author: "SportsNew Editorial",
    excerpt:
      "D. Volkov и A. Takahashi встретятся на центральном корте Grand Circuit Masters — Volkov ведёт в личных встречах, но соперник подходит к игре на серии побед.",
    intro:
      "Матч D. Volkov против A. Takahashi станет одним из самых ожидаемых на этой стадии Grand Circuit Masters. Volkov подходит к игре в статусе фаворита по статистике личных встреч, но форма Takahashi в последних неделях заставляет относиться к прогнозу осторожно.",
    body: [
      "Volkov выиграл 4 из последних 5 матчей на этом покрытии и продолжает одну из лучших серий сезона. Стабильная подача остаётся главным оружием спортсмена в решающих геймах.",
      "Takahashi, в свою очередь, идёт с чередованием побед и поражений в последних пяти матчах, но именно победы дались в матчах против соперников из топ-20, что говорит о высоком потолке игрока в текущей форме.",
      "В личных встречах Volkov ведёт со счётом 3-1, включая победу в последнем очном матче в двух сетах. Это статистическое преимущество — один из факторов, которые учитывает демонстрационная модель прогноза на странице события.",
    ],
    stats: [
      { label: "Личные встречи", value: "Volkov ведёт 3-1" },
      { label: "Форма Volkov (5 матчей)", value: "W-W-W-L-W" },
      { label: "Форма Takahashi (5 матчей)", value: "L-W-W-L-W" },
    ],
    relatedEventIds: ["evt-tennis-3"],
    relatedArticleSlugs: [],
    tags: ["tennis", "preview", "Volkov", "Takahashi"],
  },
  {
    id: "article-4",
    title: "Nova Sentinel — Vertex Gaming: разбор карт перед матчем Apex Championship Series",
    slug: "nova-sentinel-vertex-gaming-preview",
    category: "Аналитика",
    sport: "cs2",
    image: "/images/cs2.jpg",
    publishedAt: daysFromNow(-1, 12, 0),
    updatedAt: daysFromNow(0, 10, 0),
    author: "SportsNew Editorial",
    excerpt:
      "Nova Sentinel подходят к матчу на серии из четырёх побед подряд, но пул карт Vertex Gaming делает встречу менее предсказуемой, чем кажется на первый взгляд.",
    intro:
      "Nova Sentinel встретятся с Vertex Gaming в одном из ключевых матчей группового этапа Apex Championship Series. Обе команды прошли ротацию состава в последних неделях, что добавляет неопределённости в разбор пула карт.",
    body: [
      "Nova Sentinel выиграли 4 из последних 5 карт подряд и подходят к матчу в статусе фаворита по текущей форме. Команда также объявила ротацию состава за неделю до старта турнира, но, по заявлениям тренерского штаба, это не повлияло на стабильность игры.",
      "Vertex Gaming традиционно сильнее на картах с закрытыми позициями — это ключевой фактор, который стоит учитывать при разборе возможного пула карт серии.",
      "С учётом текущей формы и статистики по картам, демонстрационная модель оценивает шансы Nova Sentinel как немного более высокие, но с заметной долей неопределённости из-за пула карт.",
    ],
    stats: [
      { label: "Серия побед Nova Sentinel", value: "4 карты подряд" },
      { label: "Сильная сторона Vertex Gaming", value: "Карты с закрытыми позициями" },
    ],
    relatedEventIds: ["evt-cs2-3"],
    relatedArticleSlugs: [],
    tags: ["cs2", "preview", "Nova Sentinel", "Vertex Gaming"],
  },
  {
    id: "article-5",
    title: "Ember Guard — Titan Forge: что решит исход встречи Global Rift Invitational",
    slug: "ember-guard-titan-forge-preview",
    category: "Аналитика",
    sport: "dota-2",
    image: "/images/dota-2.jpg",
    publishedAt: daysFromNow(-1, 13, 0),
    updatedAt: daysFromNow(0, 9, 30),
    author: "SportsNew Editorial",
    excerpt:
      "Ember Guard выиграли последнюю серию со счётом 2:0 и подходят к матчу с Titan Forge в статусе фаворита — но соперник силён на ранней стадии игры.",
    intro:
      "Ember Guard встретятся с Titan Forge в матче, который может определить положение команд в турнирной таблице Global Rift Invitational. Обе команды делают ставку на агрессивный ранний драфт, что обещает динамичную игру.",
    body: [
      "Ember Guard выиграли последнюю серию со счётом 2:0 и в последних показательных играх чаще выбирают агрессивный ранний драфт — эта стратегия уже принесла команде две уверенные победы подряд.",
      "Titan Forge демонстрируют сильную раннюю игру в последних турнирах, что делает предстоящий матч потенциально скоротечным в случае успешного старта одной из команд.",
      "Демонстрационная модель оценивает шансы команд как практически равные, с небольшим перевесом в пользу Ember Guard за счёт текущей формы.",
    ],
    stats: [
      { label: "Последняя серия Ember Guard", value: "Победа 2:0" },
      { label: "Сильная сторона Titan Forge", value: "Ранняя игра" },
    ],
    relatedEventIds: ["evt-dota-2-3"],
    relatedArticleSlugs: [],
    tags: ["dota-2", "preview", "Ember Guard", "Titan Forge"],
  },
  {
    id: "article-6",
    title: "Solar Flare — Golden Spire: разбор полуфинала Bracket Royale Series",
    slug: "solar-flare-golden-spire-preview",
    category: "Аналитика",
    sport: "mobile-legends",
    image: "/images/mobile-legends.jpg",
    publishedAt: daysFromNow(-1, 9, 30),
    updatedAt: daysFromNow(0, 8, 0),
    author: "SportsNew Editorial",
    excerpt:
      "Solar Flare подходят к полуфиналу на волне камбэк-победы и выигранных 4 из последних 5 матчей — Golden Spire предстоит искать ответ на их позднюю игру.",
    intro:
      "Solar Flare встретятся с Golden Spire в матче, который определит положение команд перед финалом Bracket Royale Series. Хозяева турнирной сетки подходят к игре в уверенной форме после недавней камбэк-победы.",
    body: [
      "Solar Flare выиграли 4 из последних 5 матчей турнира, включая камбэк-победу в предыдущем раунде, где команда отыгралась после отставания в первой карте.",
      "Golden Spire — команда с более ровными результатами по сезону, но статистика личных встреч последних двух игр в пользу Solar Flare.",
      "Демонстрационная модель отдаёт заметное предпочтение Solar Flare с учётом текущей формы и статистики личных встреч, но подчёркивает, что это лишь один из сценариев развития матча.",
    ],
    stats: [
      { label: "Форма Solar Flare (5 матчей)", value: "W-W-W-L-W" },
      { label: "Личные встречи (последние 2)", value: "Solar Flare — 2 победы" },
    ],
    relatedEventIds: ["evt-mlbb-3"],
    relatedArticleSlugs: [],
    tags: ["mobile-legends", "preview", "Solar Flare", "Golden Spire"],
  },
  {
    id: "article-7",
    title: "Форма команд Continental Premier League: обзор перед новым туром",
    slug: "premier-league-form-guide-round-review",
    category: "Обзор",
    sport: "football",
    image: "/images/football.jpg",
    publishedAt: daysFromNow(0, 8, 0),
    updatedAt: daysFromNow(0, 8, 0),
    author: "SportsNew Editorial",
    excerpt:
      "Перед новым туром Continental Premier League разбираем форму шести клубов лиги — от уверенной серии Real Alcazar до нестабильных результатов Vantage Athletic.",
    intro:
      "Continental Premier League подходит к новому туру с плотной турнирной борьбой сразу нескольких команд. Разбираем форму каждого клуба и на что стоит обратить внимание в ближайших матчах.",
    body: [
      "Real Alcazar подходят к туру в лучшей форме сезона — три победы и одна ничья в последних четырёх матчах во всех турнирах, с заметно укрепившейся обороной.",
      "Northbridge United сохраняют высокий темп на своём поле, но потеря ключевого нападающего перед ближайшим матчем добавляет неопределённости в атакующие построения команды.",
      "Sterling FC не проигрывают три матча подряд и подходят к встрече с Meridian City в одной из лучших серий сезона по надёжности обороны.",
      "Vantage Athletic и Iron Coast SC показывают более нестабильные результаты — обе команды чередуют победы и поражения без выраженной серии.",
      "Meridian City объявили, что вся основная обойма игроков доступна к отбору на ближайший матч — редкий случай отсутствия кадровых проблем на этом отрезке сезона.",
    ],
    stats: [
      { label: "Лучшая серия тура", value: "Real Alcazar — 3W-1D за 4 матча" },
      { label: "Без поражений подряд", value: "Sterling FC — 3 матча" },
    ],
    relatedEventIds: ["evt-football-6", "evt-football-7"],
    relatedArticleSlugs: ["northbridge-united-real-alcazar-tactical-preview"],
    tags: ["football", "review", "Continental Premier League"],
  },
  {
    id: "article-8",
    title: "Vance — Osei: разбор перед главным событием UFC Fight Night",
    slug: "vance-osei-ufc-fight-night-preview",
    category: "Аналитика",
    sport: "ufc",
    image: "/images/ufc.jpg",
    publishedAt: daysFromNow(-1, 9, 0),
    updatedAt: daysFromNow(0, 8, 0),
    author: "SportsNew Editorial",
    excerpt:
      "Dominic Vance и Kenji Osei подходят к бою в практически одинаковой форме — 4 победы в последних 5 боях у каждого. Разбираем, что может стать решающим фактором.",
    intro:
      "Главным событием следующего UFC Fight Night станет поединок Dominic Vance и Kenji Osei — оба бойца подходят к встрече на серии уверенных результатов, и по форме между ними почти невозможно найти разницу.",
    body: [
      "Vance выиграл 4 из последних 5 боёв, ровно тот же результат — у Osei. По итогам последних выступлений форма бойцов практически идентична, и явного фаворита по этому показателю не выделить.",
      "Разница обнаруживается в статистике завершения боёв: Vance чаще доводит поединок до досрочной победы, тогда как Osei в последних боях чаще шёл до решения судей. Демонстрационная модель считает это небольшим, но реальным преимуществом Vance.",
      "Оба бойца успешно прошли официальное взвешивание без проблем с лимитом дивизиона — вопрос веса в этот раз не станет фактором неопределённости, как иногда бывает перед подобными боями.",
      "С учётом практически равной формы и небольшого преимущества Vance в статистике завершения боёв, демонстрационная модель отдаёт ему умеренное предпочтение, но подчёркивает, что поединок выглядит одним из самых равных на карде. Полный AI Match Analysis доступен на странице события.",
    ],
    stats: [
      { label: "Форма Vance (5 боёв)", value: "W-W-L-W-W" },
      { label: "Форма Osei (5 боёв)", value: "W-L-W-W-W" },
      { label: "Статус на взвешивании", value: "Оба уложились в лимит" },
    ],
    relatedEventIds: ["evt-ufc-3"],
    relatedArticleSlugs: [],
    tags: ["ufc", "preview", "Dominic Vance", "Kenji Osei"],
  },
];

function localizeArticle(article: Article, locale: AppLocale): Article {
  return localize(article, locale, { en: ARTICLES_EN });
}

export function getArticleBySlug(slug: string, locale: AppLocale = "ru"): Article | undefined {
  const found = ARTICLES.find((a) => a.slug === slug);
  return found ? localizeArticle(found, locale) : undefined;
}

export function getLatestArticles(limit?: number, locale: AppLocale = "ru"): Article[] {
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const page = limit ? sorted.slice(0, limit) : sorted;
  return page.map((a) => localizeArticle(a, locale));
}

export function getArticlesBySport(sport: string, limit?: number, locale: AppLocale = "ru"): Article[] {
  const filtered = ARTICLES.filter((a) => a.sport === sport);
  const page = limit ? filtered.slice(0, limit) : filtered;
  return page.map((a) => localizeArticle(a, locale));
}

export function getAllArticles(locale: AppLocale = "ru"): Article[] {
  return ARTICLES.map((a) => localizeArticle(a, locale));
}
