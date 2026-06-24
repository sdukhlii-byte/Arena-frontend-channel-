// Single integration point with the backend. No component fetches directly.
import { API_BASE, BOT_USERNAME } from "@/config";

export type EventName = "cta_view" | "cta_tap" | "channel_open";

export interface BackendPick {
  match: string;
  game: string;
  pick: string;
  reasoning: string;
  confidence: "High" | "Medium" | "Low" | string;
  locked: boolean;
}
export interface BackendStats {
  correct: number;
  total: number;
  rate: number | null;
  note: "accumulating" | "real";
}
export interface BackendGate {
  enabled: boolean;
  locked: boolean;
  is_member: boolean;
  channel: string;
}
export interface PicksResponse {
  picks: BackendPick[];
  stats: BackendStats;
  source: "real" | "no_matches";
  gate: BackendGate;
}
export interface MembershipResponse {
  uid: number | null;
  member: boolean;
  gate: BackendGate;
  channel: string;
  configured: boolean;
}
export type NewsCategory = "all" | "crypto" | "casino" | "esports";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  category: Exclude<NewsCategory, "all">;
  published_at: string; // ISO
  image: string | null;
  summary: string;
}
export interface NewsCoin {
  symbol: string;
  name?: string;
  price: number | null;
  change_24h: number | null;
  image?: string | null;
}
export interface NewsMarket {
  coins: NewsCoin[];
  fng: { value: number; label: string } | null;
  mcap_change_24h: number | null;
  btc_dominance: number | null;
}
export interface NewsResponse {
  items: NewsItem[];
  market: NewsMarket;
  updated_at: string;
}

export interface BackendMatch {
  game: string;
  team1: string;
  team2: string;
  league?: string;
  score1?: number | null;
  score2?: number | null;
  begin_at?: string;
  format?: string;
  id?: number | string;
}

export interface ConfigResponse {
  brand: string;
  display_name: string;
  mode: "product" | "channel";
  cta: {
    label: { en?: string; ru?: string; es?: string };
    url: string;
    channel: string;       // @handle (raw)
    channel_url: string;
    gate: boolean;
    bot_username: string;
    partner_name: string;
  };
  privacy_url?: string;
}

// Кэш публичного конфига бэка — единый источник канала/бота в рантайме,
// чтобы канал задавался ТОЛЬКО на бэке (без пересборки фронта).
let _cfg: ConfigResponse | null = null;

function getTG() {
  if (typeof window === "undefined") return null;
  return (window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id?: number } }; openTelegramLink?: (u: string) => void } } }).Telegram?.WebApp ?? null;
}

export function getUid(): number | null {
  const id = getTG()?.initDataUnsafe?.user?.id;
  return typeof id === "number" ? id : null;
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

function withUid(qs: string): string {
  const uid = getUid();
  if (!uid) return qs;
  return `${qs}${qs.includes("?") ? "&" : "?"}uid=${uid}`;
}

export const funnel = {
  getUid,

  /** Fire-and-forget analytics event. Never throws. */
  async event(name: EventName, meta?: Record<string, unknown>): Promise<void> {
    try {
      const body = JSON.stringify({ event: name, uid: getUid(), meta: meta ?? {} });
      // keepalive so navigations don't drop the request
      await fetch(`${API_BASE}/api/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    } catch {
      /* swallow */
    }
  },

  picks(lang: "en" | "ru" | "es" = "en"): Promise<PicksResponse> {
    return getJSON<PicksResponse>(withUid(`/api/picks?lang=${lang}`));
  },

  membership(): Promise<MembershipResponse> {
    return getJSON<MembershipResponse>(withUid(`/api/membership`));
  },

  stats(): Promise<BackendStats> {
    return getJSON<BackendStats>(`/api/stats`);
  },

  /** Публичный конфиг бэка (канал, бот, режим). Кэшируется. */
  async config(): Promise<ConfigResponse | null> {
    try {
      _cfg = await getJSON<ConfigResponse>(`/api/config`);
      return _cfg;
    } catch {
      return null;
    }
  },

  live(): Promise<{ matches: BackendMatch[] }> {
    return getJSON(`/api/live`);
  },

  upcoming(): Promise<{ matches: BackendMatch[] }> {
    return getJSON(`/api/upcoming`);
  },

  /** Авто-лента: крипто/казино/киберспорт новости + крипто-рынок. Не гейтится. */
  news(category: NewsCategory = "all", limit = 40): Promise<NewsResponse> {
    return getJSON<NewsResponse>(`/api/news?category=${category}&limit=${limit}`);
  },

  /**
   * Открывает канал. Источник ссылки — ТОЛЬКО рантайм:
   * проп из стейта (state.channel.url) → кэш /api/config. Без build-time
   * реконструкции t.me/<handle> — она давала старый/неверный линк (особенно
   * для инвайт-ссылок t.me/+hash, которые из handle не собрать).
   * Если рантайм-канал ещё не подгрузился — уходим в deep-link бота,
   * который знает реальный канал, а не угадываем URL.
   */
  openJoinViaBot(runtimeChannelUrl?: string): void {
    void funnel.event("channel_open");
    const tg = getTG();
    const channelUrl = runtimeChannelUrl || _cfg?.cta?.channel_url || "";
    const bot = (_cfg?.cta?.bot_username || BOT_USERNAME).replace(/^@/, "");
    const botJoin = bot ? `https://t.me/${bot}?start=join` : "";

    // Приватный инвайт (t.me/+hash, /joinchat) вебвью часто НЕ открывает через
    // openTelegramLink. Ведём в бота: он админ канала, шлёт нативную кнопку входа
    // + «✅ Я подписался» с верификацией. Публичный t.me/<username> открываем прямо.
    const isInvite = /\/(\+|joinchat\/)/.test(channelUrl);
    const target =
      isInvite && botJoin
        ? botJoin
        : channelUrl && !channelUrl.includes("your_channel")
          ? channelUrl
          : botJoin || channelUrl;

    if (!target) return;
    try {
      if (tg?.openTelegramLink) tg.openTelegramLink(target);
      else if (typeof window !== "undefined") window.open(target, "_blank", "noopener,noreferrer");
    } catch {
      if (typeof window !== "undefined") window.open(target, "_blank", "noopener,noreferrer");
    }
  },
};
