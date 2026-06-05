import { useEffect, useState } from "react";
import { BRAND } from "@/config";
import { COPY } from "@/copy";
import { Card, IOSButton, Skeleton } from "./ui";
import { FeedTab } from "./FeedTab";
import type { BackendPick, BackendGate } from "@/lib/funnel";
import { funnel } from "@/lib/funnel";
import { haptic } from "@/lib/telegram";

interface Props {
  picks: BackendPick[] | null;
  gate: BackendGate | null;
  member: boolean;
  loading: boolean;
  source: "real" | "no_matches" | null;
  onJoin: () => void;
}

export function PicksTab({ picks, gate, member, loading, source, onJoin }: Props) {
  const lockedCount = (picks || []).filter((p) => p.locked).length;
  const wallShown = !!gate?.enabled && !member && lockedCount > 0;

  // Fire cta_view once per mount when the subscription wall is visible.
  const [viewed, setViewed] = useState(false);
  useEffect(() => {
    if (wallShown && !viewed) {
      setViewed(true);
      void funnel.event("cta_view", { surface: "picks_lock" });
    }
  }, [wallShown, viewed]);

  if (loading && !picks) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  }

  const list = picks ?? [];

  return (
    <div className="space-y-3 tab-fade">
      {list.length === 0 ? (
        // No analyst picks right now → keep the surface alive with the live feed
        // (crypto / casino / esports). When real picks arrive, they take over.
        <FeedTab />
      ) : (
        list.map((p, i) => (
          <PickCard
            key={`${p.game}-${p.match}-${i}`}
            pick={p}
            onJoin={() => {
              haptic("medium");
              void funnel.event("cta_tap", { surface: "pick_lock", match: p.match });
              onJoin();
            }}
          />
        ))
      )}
    </div>
  );
}

function PickCard({ pick, onJoin }: { pick: BackendPick; onJoin: () => void }) {
  const confColor =
    pick.confidence === "High" ? BRAND.theme.accent : BRAND.theme.accentAlt;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded font-display text-[10px] tracking-widest"
            style={{
              color: BRAND.sport.gameColors[pick.game] ?? BRAND.theme.accent,
              background: `color-mix(in oklab, ${BRAND.sport.gameColors[pick.game] ?? BRAND.theme.accent} 14%, transparent)`,
              border: `1px solid color-mix(in oklab, ${BRAND.sport.gameColors[pick.game] ?? BRAND.theme.accent} 40%, transparent)`,
            }}
          >
            {pick.game}
          </span>
        </div>
        <span
          className="text-[10px] font-display tracking-widest"
          style={{ color: confColor }}
        >
          {String(pick.confidence).toUpperCase()}
        </span>
      </div>
      <div className="mt-2 text-sm font-semibold">{pick.match}</div>
      <div
        className="mt-1 font-display text-base"
        style={{ color: BRAND.theme.accent }}
      >
        → {pick.pick}
      </div>

      {pick.locked ? (
        <div className="relative mt-2">
          <div
            className="text-[12px] leading-snug select-none"
            style={{
              color: BRAND.theme.muted,
              filter: "blur(5px)",
              userSelect: "none",
            }}
            aria-hidden
          >
            {pick.reasoning || COPY.picks.lockedFallback}
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold"
              style={{
                background: "color-mix(in oklab, var(--color-surface) 88%, transparent)",
                border: `1px solid color-mix(in oklab, ${BRAND.theme.accent} 40%, transparent)`,
                color: BRAND.theme.accent,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              {COPY.picks.lockedBadge}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="mt-2 text-[12px] leading-snug"
          style={{ color: BRAND.theme.muted }}
        >
          {pick.reasoning}
        </div>
      )}

      {pick.locked && (
        <IOSButton variant="filled" fullWidth className="mt-3" onClick={onJoin}>
          {COPY.picks.unlockButton}
        </IOSButton>
      )}
    </Card>
  );
}
