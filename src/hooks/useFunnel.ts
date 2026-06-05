import { useCallback, useEffect, useRef, useState } from "react";
import {
  funnel,
  type BackendPick,
  type BackendStats,
  type BackendGate,
} from "@/lib/funnel";

export interface FunnelState {
  picks: BackendPick[] | null;
  stats: BackendStats | null;
  gate: BackendGate | null;
  member: boolean;
  source: "real" | "no_matches" | null;
  loading: boolean;
  error: boolean;
  channel: { handle: string; url: string };
}

const DEFAULT_GATE: BackendGate = {
  enabled: false,
  locked: false,
  is_member: true,
  channel: "",
};

export function useFunnel(lang: "en" | "ru" | "es" = "en") {
  const [state, setState] = useState<FunnelState>({
    picks: null,
    stats: null,
    gate: null,
    member: false,
    source: null,
    loading: true,
    error: false,
    channel: { handle: "", url: "" },
  });
  const mounted = useRef(false);

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const [p, s] = await Promise.all([
        funnel.picks(lang).catch(() => null),
        funnel.stats().catch(() => null),
      ]);
      setState((prev) => ({
        ...prev,
        picks: p?.picks ?? [],
        stats: s ?? p?.stats ?? null,
        gate: p?.gate ?? prev.gate ?? DEFAULT_GATE,
        member: funnel.getUid() != null && p?.gate?.is_member === true,
        source: p?.source ?? null,
        loading: false,
        error: !p && !s,
      }));
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: true }));
    }
  }, [lang]);

  const checkMembership = useCallback(async () => {
    try {
      const m = await funnel.membership();
      const confirmed = funnel.getUid() != null && m.member === true;
      setState((prev) => ({
        ...prev,
        member: confirmed,
        gate: m.gate ?? prev.gate,
      }));
      if (confirmed && (state.gate?.locked || !state.gate?.is_member)) {
        await refresh();
      }
      return confirmed;
    } catch {
      return state.member;
    }
  }, [refresh, state.gate, state.member]);

  const startJoin = useCallback(() => {
    funnel.openJoinViaBot();
  }, []);

  // Initial load
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    void refresh();
    // Канал/бот берём из бэка в рантайме (один источник правды — backend).
    void funnel.config().then((cfg) => {
      if (cfg?.cta) {
        setState((prev) => ({
          ...prev,
          channel: { handle: cfg.cta.channel || "", url: cfg.cta.channel_url || "" },
        }));
      }
    });
  }, [refresh]);

  // Re-check membership when user returns from bot/channel.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onFocus = () => {
      if (!state.gate?.enabled) return;
      if (state.member) return;
      void checkMembership();
    };
    const onVis = () => {
      if (document.visibilityState === "visible") onFocus();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [checkMembership, state.gate?.enabled, state.member]);

  return {
    ...state,
    refresh,
    checkMembership,
    startJoin,
    event: funnel.event,
  };
}
