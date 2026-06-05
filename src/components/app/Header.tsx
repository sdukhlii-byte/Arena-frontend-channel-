import { useEffect, useState } from "react";
import { BRAND } from "@/config";
import { COPY } from "@/copy";
import type { AppUser } from "@/lib/telegram";
import type { BackendStats } from "@/lib/funnel";

interface Props {
  user: AppUser;
  stats: BackendStats | null;
}

export function Header({ user, stats }: Props) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rateLabel =
    !stats || stats.rate == null || stats.note === "accumulating"
      ? COPY.header.statsAccruing
      : COPY.header.rate(stats.rate, stats.correct, stats.total);

  return (
    <header
      className="sticky top-0 z-40 border-b transition-all"
      style={{
        background: scrolled
          ? "color-mix(in oklab, var(--color-background) 78%, transparent)"
          : "var(--color-background)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderColor: scrolled ? "var(--color-border)" : "transparent",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-[2px] h-5 pr-1">
            <span className="signal-bar" style={{ height: "40%", animationDelay: "0ms" }} />
            <span className="signal-bar" style={{ height: "70%", animationDelay: "150ms" }} />
            <span className="signal-bar" style={{ height: "100%", animationDelay: "300ms" }} />
            <span className="signal-bar" style={{ height: "60%", animationDelay: "450ms" }} />
          </div>
          <div className="font-display text-base leading-none">
            <span className="neon-text" style={{ color: BRAND.theme.accent }}>
              {BRAND.logo.primary}
            </span>
            <span className="text-foreground">{BRAND.logo.secondary}</span>
          </div>
        </div>

        <div
          className="press flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
        >
          {user.photoUrl ? (
            <img src={user.photoUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <div
              className="h-7 w-7 rounded-full grid place-items-center font-display text-xs"
              style={{
                background: `color-mix(in oklab, ${BRAND.theme.accent} 18%, transparent)`,
                color: BRAND.theme.accent,
              }}
            >
              {user.initial}
            </div>
          )}
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-foreground font-semibold truncate max-w-[80px]">
              {user.name}
            </span>
            <span className="text-[10px]" style={{ color: BRAND.theme.muted }}>
              {rateLabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
