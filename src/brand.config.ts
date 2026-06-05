// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  ⚠️  ВПИШИ СВОЙ КАНАЛ ЗДЕСЬ — ОДНА СТРОКА.                                  ║
// ║  Пример: "@metaplay_signals". Должен совпадать с CHANNEL_URL на бэкенде.   ║
// ║  Это то, что показывается в мини-аппе и куда ведёт кнопка «Join».          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
export const MY_CHANNEL = "@your_channel";
const MY_CHANNEL_URL = `https://t.me/${MY_CHANNEL.replace(/^@/, "")}`;

export type CTAMode = "product" | "channel";

export interface Brand {
  id: string;
  displayName: string;
  botUsername: string;
  logo: { primary: string; secondary: string };
  tagline: { en: string; es: string };
  character: { name: string; role: string };
  theme: {
    accent: string;
    accentAlt: string;
    bg: string;
    surface: string;
    border: string;
    muted: string;
  };
  sport: {
    vertical: "esports" | "football" | "both";
    sportOptions: string[];
    esportsGames: string[];
    footballLeagues: string[];
    teamSuggestions: Record<string, string[]>;
    gameColors: Record<string, string>;
  };
  offer: {
    bonusPct: number;
    bonusMax: number;
    freeSpins: number;
    minDeposit: number;
    cashbackPct: number;
    currencies: number;
    currency: string;
  };
  cta: {
    mode: CTAMode;
    productUrl: string;
    sections: Record<string, string>;
    partnerName: string;
    licenseLabel: string;
    licenseUrl: string;
    since: string;
    channelUrl: string;
    channelHandle: string;
    buttonLabel: { en: string; es: string };
    headline: { en: string; es: string };
    subline: { en: string; es: string };
  };
  privacyUrl: string;
}

const GAME_COLORS: Record<string, string> = {
  CS2: "#f4a832",
  LoL: "#00d4ff",
  "Dota 2": "#c23b22",
  Valorant: "#ff4655",
  Football: "#39d353",
};

export const BRANDS: Record<string, Brand> = {
  metaplay: {
    id: "metaplay",
    displayName: "MetaPlay",
    botUsername: "metaplay_bot",
    logo: { primary: "META", secondary: "PLAY" },
    tagline: {
      en: "Live esports & football, AI-curated.",
      es: "Esports y fútbol en vivo, curado por IA.",
    },
    character: { name: "Mateo", role: "Analyst" },
    theme: {
      accent: "#00ff88",
      accentAlt: "#00d4ff",
      bg: "#0a0c10",
      surface: "#0d1018",
      border: "#1c2230",
      muted: "#8892a6",
    },
    sport: {
      vertical: "both",
      sportOptions: ["Football", "Esports", "Both"],
      esportsGames: ["CS2", "LoL", "Dota 2", "Valorant"],
      footballLeagues: [
        "Premier League",
        "La Liga",
        "Serie A",
        "Bundesliga",
        "Champions League",
        "MLS",
      ],
      teamSuggestions: {
        Football: ["Real Madrid", "Barcelona", "Man City", "Liverpool", "PSG", "Bayern"],
        CS2: ["NAVI", "FaZe", "Vitality", "G2", "Spirit", "MOUZ"],
        LoL: ["T1", "G2", "Fnatic", "GenG", "JDG", "BLG"],
        "Dota 2": ["Team Spirit", "Gaimin Gladiators", "Tundra", "LGD", "Liquid"],
        Valorant: ["Sentinels", "Fnatic", "Loud", "DRX", "Paper Rex"],
      },
      gameColors: GAME_COLORS,
    },
    offer: {
      bonusPct: 0,
      bonusMax: 0,
      freeSpins: 0,
      minDeposit: 0,
      cashbackPct: 0,
      currencies: 0,
      currency: "",
    },
    cta: {
      mode: "channel",
      productUrl: "",
      sections: {},
      partnerName: "",
      licenseLabel: "",
      licenseUrl: "",
      since: "",
      // ┌────────────────────────────────────────────────────────────────────┐
      // │  ⚠️  РЕАЛЬНЫЙ КАНАЛ ЗАДАЁТСЯ ЗДЕСЬ (front) или через env             │
      // │  VITE_CHANNEL_HANDLE. Должен совпадать с каналом в backend/brand.py. │
      // └────────────────────────────────────────────────────────────────────┘
      channelUrl: MY_CHANNEL_URL,
      channelHandle: MY_CHANNEL,
      buttonLabel: { en: "📣 Join the channel", es: "📣 Unirme al canal" },
      headline: {
        en: "Live esports & football",
        es: "Esports y fútbol en vivo",
      },
      subline: {
        en: "Full breakdowns, early signals and results — in the channel.",
        es: "Análisis completos, señales tempranas y resultados — en el canal.",
      },
    },
    privacyUrl: "https://arenafronend.s26636274.workers.dev/privacy",
  },
  goalcast: {
    id: "goalcast",
    displayName: "GoalCast",
    botUsername: "goalcast_bot",
    logo: { primary: "GOAL", secondary: "CAST" },
    tagline: {
      en: "Football picks, live on Telegram.",
      es: "Pronósticos de fútbol, en vivo en Telegram.",
    },
    character: { name: "Coach", role: "Football Analyst" },
    theme: {
      accent: "#39d353",
      accentAlt: "#00d4ff",
      bg: "#0a0c10",
      surface: "#0d1018",
      border: "#1c2230",
      muted: "#8892a6",
    },
    sport: {
      vertical: "football",
      sportOptions: ["Football"],
      esportsGames: [],
      footballLeagues: [
        "Premier League",
        "La Liga",
        "Serie A",
        "Bundesliga",
        "Ligue 1",
        "Champions League",
      ],
      teamSuggestions: {
        Football: [
          "Real Madrid",
          "Barcelona",
          "Man City",
          "Arsenal",
          "Liverpool",
          "PSG",
          "Bayern",
          "Inter",
        ],
      },
      gameColors: GAME_COLORS,
    },
    offer: {
      bonusPct: 0,
      bonusMax: 0,
      freeSpins: 0,
      minDeposit: 0,
      cashbackPct: 0,
      currencies: 0,
      currency: "USD",
    },
    cta: {
      mode: "channel",
      productUrl: "",
      sections: {},
      partnerName: "GoalCast",
      licenseLabel: "",
      licenseUrl: "",
      since: "2023",
      channelUrl: "https://t.me/goalcast_picks",
      channelHandle: "@goalcast_picks",
      buttonLabel: { en: "Join the channel", es: "Únete al canal" },
      headline: {
        en: "Daily football picks, free.",
        es: "Pronósticos de fútbol diarios, gratis.",
      },
      subline: {
        en: "Get every pick the moment it drops.",
        es: "Recibe cada pronóstico al instante.",
      },
    },
    privacyUrl: "https://example.com/goalcast/privacy",
  },
};

const ACTIVE_ID = (import.meta.env.VITE_BRAND_ID as string) || "metaplay";
export const BRAND: Brand = BRANDS[ACTIVE_ID] ?? BRANDS.metaplay;
export const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string) || "https://arena-api.onrender.com";
