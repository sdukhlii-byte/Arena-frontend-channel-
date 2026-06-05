import { BRAND } from "@/config";
import { COPY } from "@/copy";
import { Card, IOSButton } from "./ui";
import type { BackendStats } from "@/lib/funnel";

interface Props {
  stats: BackendStats | null;
  member: boolean;
  onJoin: () => void;
}

export function RankTab({ stats, member, onJoin }: Props) {
  const hasReal = stats && stats.rate != null && stats.note === "real";

  return (
    <div className="space-y-4 tab-fade">
      <div className="text-center">
        <div
          className="font-display text-[10px] tracking-widest"
          style={{ color: BRAND.theme.muted }}
        >
          {COPY.rank.performance}
        </div>
        <div className="font-display text-xl" style={{ color: BRAND.theme.accent }}>
          🏆 {BRAND.character.name}
        </div>
        <div className="text-xs mt-1" style={{ color: BRAND.theme.muted }}>
          {BRAND.character.role}
        </div>
      </div>

      <Card className="text-center !py-6">
        {hasReal ? (
          <>
            <div className="font-display text-4xl" style={{ color: BRAND.theme.accent }}>
              {stats!.rate}%
            </div>
            <div className="text-xs mt-1" style={{ color: BRAND.theme.muted }}>
              {COPY.rank.correctOf(stats!.correct, stats!.total)}
            </div>
          </>
        ) : (
          <>
            <div className="font-display text-3xl" style={{ color: BRAND.theme.accentAlt }}>
              {COPY.rank.accruingTitle}
            </div>
            <div className="text-xs mt-2" style={{ color: BRAND.theme.muted }}>
              {COPY.rank.accruingHint}
            </div>
          </>
        )}
      </Card>

      {!member && (
        <>
          <Card
            className="text-center"
            style={{
              borderColor: `color-mix(in oklab, ${BRAND.theme.accent} 35%, transparent)`,
              background: `color-mix(in oklab, ${BRAND.theme.accent} 6%, transparent)`,
            }}
          >
            <div className="text-sm font-semibold">{COPY.rank.ctaTitle}</div>
            <div className="text-[11px] mt-1" style={{ color: BRAND.theme.muted }}>
              {COPY.rank.ctaHint}
            </div>
            <IOSButton variant="filled" className="mt-3 mx-auto" onClick={onJoin}>
              {COPY.cta.join}
            </IOSButton>
          </Card>

          <button
            onClick={onJoin}
            className="w-full press flex items-center justify-between rounded-xl px-3 py-2.5 border text-left"
            style={{
              borderColor: "var(--color-border)",
              background: "var(--color-surface)",
            }}
          >
            <span className="text-[12px]" style={{ color: BRAND.theme.muted }}>
              {COPY.cta.fullReadsInChannel}
            </span>
            <span
              className="text-[11px] font-display"
              style={{ color: BRAND.theme.accent }}
            >
              {COPY.cta.subscribeArrow}
            </span>
          </button>
        </>
      )}
    </div>
  );
}
