import { BRAND, CHANNEL_HANDLE } from "@/config";
import { COPY } from "@/copy";
import { funnel, type BackendStats } from "@/lib/funnel";
import { Card, IOSButton } from "./ui";
import { useEffect, useMemo, useState } from "react";
import { haptic } from "@/lib/telegram";

interface Props {
  active: boolean;
  stats: BackendStats | null;
  member: boolean;
  channelHandle?: string;
  onJoin: () => void;
}

export function PlayTab({ active, stats, member, channelHandle, onJoin }: Props) {
  const [viewed, setViewed] = useState(false);
  useEffect(() => {
    if (active && !viewed) {
      setViewed(true);
      void funnel.event("cta_view", { surface: "play" });
    }
  }, [active, viewed]);

  const rateLine = useMemo(() => {
    if (!stats || stats.rate == null || stats.note === "accumulating") {
      return COPY.play.accruing;
    }
    return COPY.play.winRate(stats.rate, stats.correct, stats.total);
  }, [stats]);

  const tap = () => {
    haptic("medium");
    void funnel.event("cta_tap", { surface: "play" });
    onJoin();
  };

  return (
    <div className="space-y-4 tab-fade pb-4">
      <div className="text-center pt-2">
        <div
          className="text-5xl mb-2 inline-block"
          style={{ filter: `drop-shadow(0 0 14px ${BRAND.theme.accent})` }}
        >
          {COPY.play.heroEmoji}
        </div>
        <h2 className="font-display text-xl" style={{ color: BRAND.theme.accent }}>
          {COPY.play.heroTitle}
        </h2>
        <p className="mt-2 text-sm px-4" style={{ color: BRAND.theme.muted }}>
          {COPY.play.heroSubtitle}
        </p>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row label={COPY.play.rowForm} value={rateLine} />
          <Row label={COPY.play.rowChannel} value={channelHandle || `@${CHANNEL_HANDLE}`} />
          <Row label={COPY.play.rowContent} value={COPY.play.contentValue} />
          <Row label={COPY.play.rowAccess} value={member ? COPY.play.accessOpen : COPY.play.accessLocked} />
        </div>
      </Card>

      {member ? (
        <IOSButton variant="filled" fullWidth disabled>
          {COPY.play.alreadyMember}
        </IOSButton>
      ) : (
        <IOSButton variant="filled" fullWidth onClick={tap}>
          {COPY.play.joinButton}
        </IOSButton>
      )}

      <div className="text-center text-[11px]" style={{ color: BRAND.theme.muted }}>
        {COPY.play.footnote}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div style={{ color: BRAND.theme.muted }}>{label}</div>
      <div className="text-right font-display" style={{ color: BRAND.theme.accent }}>
        {value}
      </div>
    </>
  );
}
