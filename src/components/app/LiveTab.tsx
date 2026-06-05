import { useEffect, useMemo, useState } from "react";
import { funnel, type BackendMatch } from "@/lib/funnel";
import { BRAND } from "@/config";
import { COPY } from "@/copy";
import { Card, Empty, GameTag, PullToRefresh, Segmented, Skeleton } from "./ui";
import { haptic } from "@/lib/telegram";

export function LiveTab({ onJoin }: { onJoin: () => void }) {
  const [matches, setMatches] = useState<BackendMatch[] | null>(null);
  const [err, setErr] = useState(false);
  const [filter, setFilter] = useState<string>("ALL");

  const load = async () => {
    try {
      const d = await funnel.live();
      setMatches(d.matches || []);
      setErr(false);
    } catch {
      setMatches([]);
      setErr(true);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  const games = useMemo(() => {
    const s = new Set<string>();
    (matches || []).forEach((m) => s.add(m.game));
    return ["ALL", ...Array.from(s)];
  }, [matches]);

  const filtered = (matches || []).filter((m) => filter === "ALL" || m.game === filter);

  if (matches === null) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <PullToRefresh onRefresh={load}>
        <div className="space-y-3 tab-fade">
          {games.length > 2 && (
            <Segmented
              value={filter}
              onChange={setFilter}
              options={games.map((g) => ({ value: g, label: g }))}
            />
          )}

          {filtered.length === 0 ? (
            <Empty
              icon="📡"
              title={err ? COPY.live.signalLost : COPY.live.noLive}
              hint={err ? COPY.live.retryHint : COPY.live.checkToday}
            />
          ) : (
            filtered.map((m, idx) => (
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
                  <span className="flex items-center gap-1.5 text-[10px] font-display tracking-widest text-destructive">
                    <span className="live-dot" /> {COPY.live.liveBadge}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <div className="text-sm font-semibold truncate text-right">{m.team1}</div>
                  <div
                    className="font-display text-2xl px-3 py-1 rounded-md text-center"
                    style={{
                      color: BRAND.theme.accent,
                      background: "var(--color-surface-2)",
                      minWidth: 76,
                    }}
                  >
                    {m.score1 ?? 0} <span style={{ color: BRAND.theme.muted }}>–</span>{" "}
                    {m.score2 ?? 0}
                  </div>
                  <div className="text-sm font-semibold truncate">{m.team2}</div>
                </div>
                <button
                  onClick={() => {
                    haptic("medium");
                    void funnel.event("cta_tap", { surface: "live_match" });
                    onJoin();
                  }}
                  className="press tap-44 mt-3 w-full rounded-xl text-[12px] font-semibold border"
                  style={{
                    color: BRAND.theme.accent,
                    borderColor: `color-mix(in oklab, ${BRAND.theme.accent} 35%, transparent)`,
                    background: `color-mix(in oklab, ${BRAND.theme.accent} 8%, transparent)`,
                  }}
                >
                  {COPY.live.getPick}
                </button>
              </Card>
            ))
          )}
        </div>
      </PullToRefresh>
    </div>
  );
}
