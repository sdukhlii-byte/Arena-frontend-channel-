// ============================================================================
// copy.ts — ВСЕ тексты интерфейса + i18n.
// ----------------------------------------------------------------------------
// Язык выбирается по language_code из профиля Telegram пользователя.
// Приоритет/дефолт — английский (любой неподдерживаемый язык → en).
// Поддержка: en, ru, es. Чтобы добавить язык — добавь ветку в DICT + map в
// detectLang. Компоненты импортируют { COPY } и НЕ меняются.
// ============================================================================

export type Lang = "en" | "ru" | "es";

/** Язык контента из профиля Telegram (en — приоритетный дефолт). */
export function detectLang(): Lang {
  let code = "";
  try {
    const tg = (window as unknown as {
      Telegram?: { WebApp?: { initDataUnsafe?: { user?: { language_code?: string } } } };
    })?.Telegram?.WebApp;
    code =
      tg?.initDataUnsafe?.user?.language_code ||
      (typeof navigator !== "undefined" ? navigator.language : "") ||
      "";
  } catch {
    /* noop */
  }
  const base = code.split("-")[0].toLowerCase();
  const map: Record<string, Lang> = {
    en: "en",
    ru: "ru", uk: "ru", be: "ru", kk: "ru",
    es: "es",
  };
  return map[base] ?? "en"; // English priority
}

export const LANG: Lang = detectLang();

interface CopyShape {
  nav: { live: string; picks: string; today: string; rank: string; play: string };
  sportLabel: Record<string, string>;
  header: { statsAccruing: string; rate: (rate: number, correct: number, total: number) => string };
  cta: { join: string; subscribe: string; subscribeArrow: string; fullReadsInChannel: string; stickySub: string };
  play: {
    heroEmoji: string; heroTitle: string; heroSubtitle: string; accruing: string;
    winRate: (rate: number, correct: number, total: number) => string;
    rowForm: string; rowChannel: string; rowContent: string; contentValue: string;
    rowAccess: string; accessOpen: string; accessLocked: string;
    joinButton: string; alreadyMember: string; footnote: string;
  };
  rank: {
    performance: string; correctOf: (correct: number, total: number) => string;
    accruingTitle: string; accruingHint: string; ctaTitle: string; ctaHint: string;
  };
  onb: {
    skip: string; step0Title: string; step0Sub: string; step1Title: string; step1Sub: string;
    leagues: string; disciplines: string; favTeams: string; finalTitle: string; finalSub: string;
    joinAndEnter: string; later: string; back: string; next: string; done: string;
  };
  live: { signalLost: string; noLive: string; retryHint: string; checkToday: string; liveBadge: string; getPick: string };
  today: { today: string; tomorrow: string; later: string; empty: string; emptyHint: string; vs: string; getPick: string };
  picks: { noMatches: string; loading: string; scouting: (name: string) => string; lockedFallback: string; lockedBadge: string; unlockButton: string };
  pull: { pull: string; release: string; refreshing: string };
}

const DICT: Record<Lang, CopyShape> = {
  // ── ENGLISH (default) ──────────────────────────────────────────────────────
  en: {
    nav: { live: "Live", picks: "Picks", today: "Today", rank: "Rank", play: "Channel" },
    sportLabel: { Football: "Football", Esports: "Esports", Both: "Both" },
    header: {
      statsAccruing: "Accruing stats",
      rate: (r, c, t) => `${r}% · ${c}/${t}`,
    },
    cta: {
      join: "📣 Subscribe",
      subscribe: "Subscribe",
      subscribeArrow: "Subscribe →",
      fullReadsInChannel: "Full reads — in the channel",
      stickySub: `One subscription → full access`,
    },
    play: {
      heroEmoji: "📣",
      heroTitle: "Live esports & football — analyst-curated.",
      heroSubtitle: `Full pick breakdowns, early signals and results — in the channel.`,
      accruing: "Accruing stats…",
      winRate: (r, c, t) => `${r}% correct · ${c}/${t}`,
      rowForm: "Current form",
      rowChannel: "Channel",
      rowContent: "Content",
      contentValue: "Picks, breakdowns, results",
      rowAccess: "Access",
      accessOpen: "✓ OPEN",
      accessLocked: "🔒 LOCKED",
      joinButton: "📣 Join the channel",
      alreadyMember: "✓ You're subscribed",
      footnote: "Free. Subscribing unlocks full breakdowns and early signals.",
    },
    rank: {
      performance: "Performance",
      correctOf: (c, t) => `${c}/${t} correct picks`,
      accruingTitle: "Accruing stats",
      accruingHint: "Win rate appears after the first settled matches.",
      ctaTitle: "Want to watch this number build?",
      ctaHint: "Every breakdown and result is in the channel.",
    },
    onb: {
      skip: "Skip",
      step0Title: "Pick your arena.",
      step0Sub: "What do you follow more?",
      step1Title: "Tune your feed.",
      step1Sub: "Mark what you follow. You can skip.",
      leagues: "Leagues",
      disciplines: "Disciplines",
      favTeams: "Favourite teams",
      finalTitle: "Full reads — in the channel",
      finalSub: `We open the first read right away. Full breakdowns, early signals and results — in the channel.`,
      joinAndEnter: "Subscribe & enter",
      later: "Later — open the app",
      back: "Back",
      next: "Next",
      done: "Done",
    },
    live: {
      signalLost: "Signal lost",
      noLive: "No live matches",
      retryHint: "Pull down to refresh.",
      checkToday: "Check the Today tab.",
      liveBadge: "LIVE",
      getPick: "Get the match read →",
    },
    today: {
      today: "Today", tomorrow: "Tomorrow", later: "Later",
      empty: "Empty", emptyHint: "New matches will appear soon.",
      vs: "vs", getPick: "Get the read in Telegram →",
    },
    picks: {
      noMatches: "No matches today",
      loading: "Loading reads…",
      scouting: (name) => `${name} is lining up the next set.`,
      lockedFallback: "The full read is for channel subscribers: trends, form, head-to-head and key factors.",
      lockedBadge: "🔒 Full read — in the channel",
      unlockButton: "🔓 Open in the channel",
    },
    pull: { pull: "PULL", release: "RELEASE", refreshing: "REFRESHING…" },
  },

  // ── РУССКИЙ ──────────────────────────────────────────────────────────────────
  ru: {
    nav: { live: "Лайв", picks: "Пики", today: "Сегодня", rank: "Рейтинг", play: "Канал" },
    sportLabel: { Football: "Футбол", Esports: "Киберспорт", Both: "Всё вместе" },
    header: {
      statsAccruing: "Набор статистики",
      rate: (r, c, t) => `${r}% · ${c}/${t}`,
    },
    cta: {
      join: "📣 Подписаться",
      subscribe: "Подписаться",
      subscribeArrow: "Подписаться →",
      fullReadsInChannel: "Полные разборы — в канале",
      stickySub: `Одна подписка → весь доступ`,
    },
    play: {
      heroEmoji: "📣",
      heroTitle: "Киберспорт и футбол в прямом эфире — разбор от аналитика.",
      heroSubtitle: `Полные разборы пиков, ранние сигналы и итоги — в канале.`,
      accruing: "Набираем статистику…",
      winRate: (r, c, t) => `${r}% верных · ${c}/${t}`,
      rowForm: "Текущая форма",
      rowChannel: "Канал",
      rowContent: "Тип контента",
      contentValue: "Пики, разборы, итоги",
      rowAccess: "Доступ",
      accessOpen: "✓ ОТКРЫТ",
      accessLocked: "🔒 ЗАБЛОКИРОВАН",
      joinButton: "📣 Подписаться на канал",
      alreadyMember: "✓ Вы уже подписаны",
      footnote: "Бесплатно. Подписка открывает полные разборы и ранние сигналы.",
    },
    rank: {
      performance: "Статистика",
      correctOf: (c, t) => `${c}/${t} верных пиков`,
      accruingTitle: "Набираем статистику",
      accruingHint: "Винрейт появится после первых закрытых матчей.",
      ctaTitle: "Хочешь видеть, как формируется этот процент?",
      ctaHint: "В канале — каждый разбор и итог матча.",
    },
    onb: {
      skip: "Пропустить",
      step0Title: "Выбери арену.",
      step0Sub: "За чем следишь чаще?",
      step1Title: "Настрой ленту.",
      step1Sub: "Отметь то, за чем следишь. Можно пропустить.",
      leagues: "Лиги",
      disciplines: "Дисциплины",
      favTeams: "Любимые команды",
      finalTitle: "Полные разборы — в канале",
      finalSub: `Первый разбор открываем сразу. Полные разборы, ранние сигналы и итоги — в канале.`,
      joinAndEnter: "Подписаться и войти",
      later: "Позже — открыть приложение",
      back: "Назад",
      next: "Дальше",
      done: "Готово",
    },
    live: {
      signalLost: "Сигнал потерян",
      noLive: "Нет матчей в эфире",
      retryHint: "Потяни вниз, чтобы обновить.",
      checkToday: "Загляни во вкладку «Сегодня».",
      liveBadge: "В ЭФИРЕ",
      getPick: "Получить разбор матча →",
    },
    today: {
      today: "Сегодня", tomorrow: "Завтра", later: "Позже",
      empty: "Пусто", emptyHint: "Новые матчи появятся скоро.",
      vs: "—", getPick: "Получить разбор в Telegram →",
    },
    picks: {
      noMatches: "Нет матчей сегодня",
      loading: "Загружаем разборы…",
      scouting: (name) => `${name} готовит следующую подборку.`,
      lockedFallback: "Полный разбор доступен подписчикам канала: тренды, форма, очные встречи и ключевые факторы.",
      lockedBadge: "🔒 Полный разбор — в канале",
      unlockButton: "🔓 Открыть в канале",
    },
    pull: { pull: "ПОТЯНИ", release: "ОТПУСТИ", refreshing: "ОБНОВЛЯЮ…" },
  },

  // ── ESPAÑOL ──────────────────────────────────────────────────────────────────
  es: {
    nav: { live: "En vivo", picks: "Picks", today: "Hoy", rank: "Ranking", play: "Canal" },
    sportLabel: { Football: "Fútbol", Esports: "Esports", Both: "Ambos" },
    header: {
      statsAccruing: "Acumulando datos",
      rate: (r, c, t) => `${r}% · ${c}/${t}`,
    },
    cta: {
      join: "📣 Suscribirme",
      subscribe: "Suscribirme",
      subscribeArrow: "Suscribirme →",
      fullReadsInChannel: "Análisis completos — en el canal",
      stickySub: `Una suscripción → acceso total`,
    },
    play: {
      heroEmoji: "📣",
      heroTitle: "Esports y fútbol en vivo — curado por un analista.",
      heroSubtitle: `Análisis completos de picks, señales tempranas y resultados — en el canal.`,
      accruing: "Acumulando datos…",
      winRate: (r, c, t) => `${r}% acertados · ${c}/${t}`,
      rowForm: "Forma actual",
      rowChannel: "Canal",
      rowContent: "Contenido",
      contentValue: "Picks, análisis, resultados",
      rowAccess: "Acceso",
      accessOpen: "✓ ABIERTO",
      accessLocked: "🔒 BLOQUEADO",
      joinButton: "📣 Unirme al canal",
      alreadyMember: "✓ Ya estás suscrito",
      footnote: "Gratis. La suscripción desbloquea los análisis completos y las señales tempranas.",
    },
    rank: {
      performance: "Rendimiento",
      correctOf: (c, t) => `${c}/${t} picks acertados`,
      accruingTitle: "Acumulando datos",
      accruingHint: "El win rate aparece tras los primeros partidos cerrados.",
      ctaTitle: "¿Querés ver cómo se forma este porcentaje?",
      ctaHint: "Cada análisis y resultado está en el canal.",
    },
    onb: {
      skip: "Saltar",
      step0Title: "Elegí tu arena.",
      step0Sub: "¿Qué seguís más?",
      step1Title: "Ajustá tu feed.",
      step1Sub: "Marcá lo que seguís. Podés saltar.",
      leagues: "Ligas",
      disciplines: "Disciplinas",
      favTeams: "Equipos favoritos",
      finalTitle: "Análisis completos — en el canal",
      finalSub: `Abrimos el primer análisis al instante. Análisis completos, señales tempranas y resultados — en el canal.`,
      joinAndEnter: "Suscribirme y entrar",
      later: "Más tarde — abrir la app",
      back: "Atrás",
      next: "Siguiente",
      done: "Listo",
    },
    live: {
      signalLost: "Señal perdida",
      noLive: "No hay partidos en vivo",
      retryHint: "Deslizá para actualizar.",
      checkToday: "Mirá la pestaña Hoy.",
      liveBadge: "EN VIVO",
      getPick: "Recibir el análisis del partido →",
    },
    today: {
      today: "Hoy", tomorrow: "Mañana", later: "Más tarde",
      empty: "Vacío", emptyHint: "Pronto aparecerán nuevos partidos.",
      vs: "vs", getPick: "Recibir el análisis en Telegram →",
    },
    picks: {
      noMatches: "No hay partidos hoy",
      loading: "Cargando análisis…",
      scouting: (name) => `${name} está armando la próxima selección.`,
      lockedFallback: "El análisis completo es para suscriptores del canal: tendencias, forma, head-to-head y factores clave.",
      lockedBadge: "🔒 Análisis completo — en el canal",
      unlockButton: "🔓 Abrir en el canal",
    },
    pull: { pull: "DESLIZÁ", release: "SOLTÁ", refreshing: "ACTUALIZANDO…" },
  },
};

export const COPY = DICT[LANG];
