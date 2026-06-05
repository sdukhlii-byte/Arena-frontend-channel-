import { useEffect, useState } from "react";
import { BRAND } from "@/config";
import { COPY } from "@/copy";
import { funnel } from "@/lib/funnel";
import { haptic } from "@/lib/telegram";

interface Props {
  hidden: boolean;
  onJoin: () => void;
}

export function StickyCTA({ hidden, onJoin }: Props) {
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    if (!hidden && !viewed) {
      setViewed(true);
      void funnel.event("cta_view", { surface: "sticky" });
    }
  }, [hidden, viewed]);

  if (hidden) return null;

  return (
    <div
      className="fixed left-0 right-0 z-30 px-3 sticky-pop"
      style={{ bottom: `calc(64px + env(safe-area-inset-bottom))` }}
    >
      <div
        className="mx-auto max-w-[460px] flex items-center gap-2 rounded-2xl border px-3 py-2.5 backdrop-blur-xl"
        style={{
          background: "color-mix(in oklab, var(--color-surface) 88%, transparent)",
          borderColor: "var(--color-border)",
          boxShadow: `0 10px 30px -12px rgba(0,0,0,0.7), 0 0 20px -8px ${BRAND.theme.accent}`,
        }}
      >
        <div
          className="text-xl"
          style={{ filter: `drop-shadow(0 0 8px ${BRAND.theme.accent})` }}
        >
          📣
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold truncate text-foreground">
            {COPY.cta.fullReadsInChannel}
          </div>
          <div className="text-[10px] truncate" style={{ color: BRAND.theme.muted }}>
            {COPY.cta.stickySub}
          </div>
        </div>
        <button
          onClick={() => {
            haptic("medium");
            void funnel.event("cta_tap", { surface: "sticky" });
            onJoin();
          }}
          className="press tap-44 rounded-xl px-3 font-semibold text-[12px]"
          style={{
            background: BRAND.theme.accent,
            color: "#001b0e",
            boxShadow: `0 0 16px -4px ${BRAND.theme.accent}`,
          }}
        >
          {COPY.cta.subscribe}
        </button>
      </div>
    </div>
  );
}
