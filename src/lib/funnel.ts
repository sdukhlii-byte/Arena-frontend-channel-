// Single integration point with the backend. No component fetches directly.
import { API_BASE, BOT_USERNAME, BRAND, CHANNEL_HANDLE } from "@/config";

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

  /** Открывает канал напрямую (рантайм-конфиг → build-time fallback). */
  openJoinViaBot(): void {
    void funnel.event("channel_open");
    const tg = getTG();
    // Канал: рантайм /api/config → build-time env (VITE_CHANNEL_HANDLE) → brand.config.
    const handleUrl = CHANNEL_HANDLE ? `https://t.me/${CHANNEL_HANDLE}` : "";
    const channelUrl = _cfg?.cta?.channel_url || handleUrl || BRAND.cta.channelUrl || "";
    // 1) основной путь — открыть сам канал (то, что ждёт пользователь)
    if (channelUrl && !channelUrl.includes("your_channel")) {
      if (tg?.openTelegramLink) tg.openTelegramLink(channelUrl);
      else if (typeof window !== "undefined") window.open(channelUrl, "_blank", "noopener,noreferrer");
      return;
    }
    // 2) fallback — deep-link в бота с верификацией подписки
    const bot = (_cfg?.cta?.bot_username || BOT_USERNAME).replace(/^@/, "");
    const url = `https://t.me/${bot}?start=join`;
    try {
      if (tg?.openTelegramLink) tg.openTelegramLink(url);
      else if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
    }
  },
};
