import { useEffect, useMemo, useState } from "react";
import { funnel, type BackendMatch } from "@/lib/funnel";
import { BRAND } from "@/config";
import { COPY } from "@/copy";
import {
  Card,
  Empty,
  GameTag,
  PullToRefresh,
  Segmented,
  Skeleton,
  formatCountdown,
  formatLocalTime,
} from "./ui";
import { haptic } from "@/lib/telegram";

export function TodayTab({ onJoin }: { onJoin: () => void }) {
  const [matches, setMatches] = useState<BackendMatch[] | null>(null);
  const [, force] = useState(0);
  const [day, setDay] = useState<"today" | "tomorrow" | "later">("today");

  const load = async () => {
    try {
      const d = await funnel.upcoming();
      setMatches(
        (d.matches || [])
          .slice()
          .sort((a, b) => +new Date(a.begin_at || 0) - +new Date(b.begin_at || 0)),
      );
    } catch {
      setMatches([]);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(() => force((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const grouped = useMemo(() => {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startTomorrow = startToday + 86_400_000;
    const startLater = startTomorrow + 86_400_000;
    const list = matches || [];
    return {
      today: list.filter((m) => {
        const t = +new Date(m.begin_at || 0);
        return t >= startToday && t < startTomorrow;
      }),
      tomorrow: list.filter((m) => {
        const t = +new Date(m.begin_at || 0);
        return t >= startTomorrow && t < startLater;
      }),
      later: list.filter((m) => +new Date(m.begin_at || 0) >= startLater),
    };
  }, [matches]);

  if (matches === null) {
    return (
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  const list = grouped[day];

  return (
    <PullToRefresh onRefresh={load}>
      <div className="space-y-3 tab-fade">
        <Segmented
          value={day}
          onChange={setDay}
          options={[
            { value: "today", label: `${COPY.today.today} · ${grouped.today.length}` },
            { value: "tomorrow", label: `${COPY.today.tomorrow} · ${grouped.tomorrow.length}` },
            { value: "later", label: `${COPY.today.later} · ${grouped.later.length}` },
          ]}
        />

        {list.length === 0 ? (
          <Empty icon="📅" title={COPY.today.empty} hint={COPY.today.emptyHint} />
        ) : (
          list.map((m, idx) => (
            <Card key={m.id ?? idx}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GameTag game={m.game} />
                  {m.league && (
                    <span className="text-[11px]" style={{ color: BRAND.theme.muted }}>
                      {m.league}
                    </span>
                  )}
                </div>
                {m.begin_at && (
                  <span
                    className="text-[11px] font-display tracking-widest"
                    style={{ color: BRAND.theme.accentAlt }}
                  >
                    {formatLocalTime(m.begin_at)}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="text-sm font-semibold truncate">
                  {m.team1} <span style={{ color: BRAND.theme.muted }}>{COPY.today.vs}</span> {m.team2}
                </div>
                {m.begin_at && (
                  <div
                    className="font-display text-[11px] px-2 py-1 rounded-md"
                    style={{
                      color: BRAND.theme.accent,
                      background: "var(--color-surface-2)",
                    }}
                  >
                    ⏱ {formatCountdown(m.begin_at)}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  haptic("medium");
                  void funnel.event("cta_tap", { surface: "today_match" });
                  onJoin();
                }}
                className="press tap-44 mt-3 w-full rounded-xl text-[12px] font-semibold"
                style={{
                  color: BRAND.theme.accent,
                  background: `color-mix(in oklab, ${BRAND.theme.accent} 10%, transparent)`,
                }}
              >
                {COPY.today.getPick}
              </button>
            </Card>
          ))
        )}
      </div>
    </PullToRefresh>
  );
}
