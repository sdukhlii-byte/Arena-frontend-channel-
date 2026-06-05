// Telegram WebApp minimal types + helpers + hooks
interface TGUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}
interface TGButton {
  text: string;
  color?: string;
  textColor?: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible?: boolean;
  setText: (text: string) => TGButton;
  onClick: (cb: () => void) => TGButton;
  offClick: (cb: () => void) => TGButton;
  show: () => TGButton;
  hide: () => TGButton;
  enable: () => TGButton;
  disable: () => TGButton;
  setParams?: (p: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => TGButton;
}
interface TGBackButton {
  isVisible: boolean;
  onClick: (cb: () => void) => TGBackButton;
  offClick: (cb: () => void) => TGBackButton;
  show: () => TGBackButton;
  hide: () => TGBackButton;
}
interface TGCloudStorage {
  setItem: (key: string, value: string, cb?: (err: Error | null, ok?: boolean) => void) => void;
  getItem: (key: string, cb: (err: Error | null, value?: string) => void) => void;
  removeItem: (key: string, cb?: (err: Error | null, ok?: boolean) => void) => void;
}
interface TGWebApp {
  ready: () => void;
  expand: () => void;
  close?: () => void;
  initData?: string;
  initDataUnsafe?: { user?: TGUser; start_param?: string };
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    selectionChanged?: () => void;
    notificationOccurred?: (type: "error" | "success" | "warning") => void;
  };
  MainButton?: TGButton;
  BackButton?: TGBackButton;
  SettingsButton?: { show: () => void; hide: () => void; onClick: (cb: () => void) => void; offClick: (cb: () => void) => void };
  CloudStorage?: TGCloudStorage;
  openLink?: (url: string, opts?: { try_instant_view?: boolean }) => void;
  openTelegramLink?: (url: string) => void;
  shareMessage?: (msgId: string, cb?: (ok: boolean) => void) => void;
  switchInlineQuery?: (query: string, chatTypes?: string[]) => void;
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  viewportStableHeight?: number;
  viewportHeight?: number;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
  enableClosingConfirmation?: () => void;
  disableVerticalSwipes?: () => void;
  platform?: string;
  version?: string;
}
declare global {
  interface Window {
    Telegram?: { WebApp?: TGWebApp };
  }
}

import { useEffect, useRef, useState } from "react";

export function getTG(): TGWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function isTelegram(): boolean {
  return !!getTG()?.initData;
}

export function haptic(style: "light" | "medium" | "heavy" = "light") {
  try {
    getTG()?.HapticFeedback?.impactOccurred(style);
  } catch {
    /* noop */
  }
}

export function hapticSelection() {
  try {
    getTG()?.HapticFeedback?.selectionChanged?.();
  } catch {
    /* noop */
  }
}

export function hapticNotify(type: "success" | "error" | "warning") {
  try {
    getTG()?.HapticFeedback?.notificationOccurred?.(type);
  } catch {
    /* noop */
  }
}

export function openExternal(url: string) {
  if (!url) return;
  const tg = getTG();
  if (tg?.openLink) tg.openLink(url);
  else if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
}

export function openTelegram(url: string) {
  if (!url) return;
  const tg = getTG();
  if (tg?.openTelegramLink) tg.openTelegramLink(url);
  else if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
}

export function shareToTelegram(text: string, url?: string) {
  const tg = getTG();
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url || "https://t.me")}&text=${encodeURIComponent(text)}`;
  if (tg?.openTelegramLink) tg.openTelegramLink(shareUrl);
  else if (typeof window !== "undefined") window.open(shareUrl, "_blank", "noopener,noreferrer");
}

export interface AppUser {
  name: string;
  initial: string;
  username?: string;
  photoUrl?: string;
}

export function useTelegram() {
  const [user, setUser] = useState<AppUser>({ name: "Guest", initial: "G" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tg = getTG();
    if (tg) {
      try {
        tg.ready();
        tg.expand();
        tg.setBackgroundColor?.("#0a0c10");
        tg.setHeaderColor?.("#0a0c10");
        tg.setBottomBarColor?.("#0a0c10");
        tg.disableVerticalSwipes?.();
      } catch {
        /* noop */
      }
      const u = tg.initDataUnsafe?.user;
      if (u) {
        const name = u.first_name || u.username || "Player";
        setUser({
          name,
          initial: (name[0] || "P").toUpperCase(),
          username: u.username,
          photoUrl: u.photo_url,
        });
      }
    }
    setReady(true);
  }, []);

  return { user, ready };
}

/** Bind Telegram MainButton to a CTA. No-op outside Telegram. */
export function useMainButton(opts: {
  text: string;
  visible: boolean;
  color?: string;
  textColor?: string;
  onClick: () => void;
}) {
  const cbRef = useRef(opts.onClick);
  cbRef.current = opts.onClick;

  useEffect(() => {
    const tg = getTG();
    const mb = tg?.MainButton;
    if (!mb) return;
    const handler = () => cbRef.current();
    try {
      mb.setParams?.({
        text: opts.text,
        color: opts.color ?? "#00ff88",
        text_color: opts.textColor ?? "#001b0e",
        is_active: true,
        is_visible: opts.visible,
      });
      if (!mb.setParams) mb.setText(opts.text);
      mb.onClick(handler);
      if (opts.visible) mb.show();
      else mb.hide();
    } catch {
      /* noop */
    }
    return () => {
      try {
        mb.offClick(handler);
        mb.hide();
      } catch {
        /* noop */
      }
    };
  }, [opts.text, opts.visible, opts.color, opts.textColor]);
}

/** Bind Telegram BackButton. No-op outside Telegram. */
export function useBackButton(visible: boolean, onClick: () => void) {
  const cbRef = useRef(onClick);
  cbRef.current = onClick;
  useEffect(() => {
    const bb = getTG()?.BackButton;
    if (!bb) return;
    const handler = () => cbRef.current();
    try {
      bb.onClick(handler);
      if (visible) bb.show();
      else bb.hide();
    } catch {
      /* noop */
    }
    return () => {
      try {
        bb.offClick(handler);
        bb.hide();
      } catch {
        /* noop */
      }
    };
  }, [visible]);
}
