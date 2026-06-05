// localStorage-backed user state: prefs, locked picks, results
import { useEffect, useState, useCallback } from "react";

const PREFS_KEY = "mp_prefs_v1";
const PICKS_KEY = "mp_userpicks_v1";
const ONBOARD_KEY = "mp_onboarded_v1";

export interface Prefs {
  sport?: string;
  leagues: string[];
  games: string[];
  teams: string[];
}
export interface UserPick {
  id: string; // game|match|pick
  game: string;
  match: string;
  pick: string;
  status: "pending" | "won" | "lost";
  lockedAt: number;
}

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* noop */
  }
}

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>({ leagues: [], games: [], teams: [] });
  const [onboarded, setOnboarded] = useState(true);
  useEffect(() => {
    setPrefs(read<Prefs>(PREFS_KEY, { leagues: [], games: [], teams: [] }));
    setOnboarded(read<boolean>(ONBOARD_KEY, false));
  }, []);
  const save = useCallback((p: Prefs) => {
    setPrefs(p);
    write(PREFS_KEY, p);
  }, []);
  const finishOnboarding = useCallback(() => {
    setOnboarded(true);
    write(ONBOARD_KEY, true);
  }, []);
  return { prefs, save, onboarded, finishOnboarding };
}

export function useUserPicks() {
  const [picks, setPicks] = useState<UserPick[]>([]);
  useEffect(() => {
    setPicks(read<UserPick[]>(PICKS_KEY, []));
  }, []);
  const lock = useCallback((p: Omit<UserPick, "status" | "lockedAt">) => {
    setPicks((prev) => {
      if (prev.some((x) => x.id === p.id)) return prev;
      const next = [...prev, { ...p, status: "pending" as const, lockedAt: Date.now() }];
      write(PICKS_KEY, next);
      return next;
    });
  }, []);
  const setStatus = useCallback((id: string, status: "won" | "lost" | "pending") => {
    setPicks((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, status } : x));
      write(PICKS_KEY, next);
      return next;
    });
  }, []);
  const remove = useCallback((id: string) => {
    setPicks((prev) => {
      const next = prev.filter((x) => x.id !== id);
      write(PICKS_KEY, next);
      return next;
    });
  }, []);

  const decided = picks.filter((p) => p.status !== "pending");
  const won = decided.filter((p) => p.status === "won").length;
  const rate = decided.length ? Math.round((won / decided.length) * 100) : 0;

  // streak: consecutive wins from most recent decided
  const sorted = [...decided].sort((a, b) => b.lockedAt - a.lockedAt);
  let streak = 0;
  for (const p of sorted) {
    if (p.status === "won") streak++;
    else break;
  }

  return { picks, lock, setStatus, remove, won, total: decided.length, rate, streak };
}
