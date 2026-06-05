// Single source of truth for runtime config + brand tokens.
// All values referenced here MUST NOT be duplicated elsewhere.
import { BRAND as BRAND_TOKENS } from "@/brand.config";

// TODO: set VITE_API_BASE / VITE_BOT_USERNAME / VITE_CHANNEL_HANDLE in env.
export const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string) || "https://arena-api.onrender.com";

export const BOT_USERNAME: string = (
  (import.meta.env.VITE_BOT_USERNAME as string) || BRAND_TOKENS.botUsername || "metaplay_bot"
).replace(/^@/, "");

// Реальный канал: задаётся в brand.config (cta.channelHandle) ИЛИ через env
// VITE_CHANNEL_HANDLE. Должен совпадать с каналом в backend/brand.py.
export const CHANNEL_HANDLE: string = (
  (import.meta.env.VITE_CHANNEL_HANDLE as string) || BRAND_TOKENS.cta.channelHandle || "@your_channel"
).replace(/^@/, "");

export const BRAND = BRAND_TOKENS;
