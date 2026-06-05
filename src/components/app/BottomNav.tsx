import { BRAND } from "@/brand.config";
import { COPY } from "@/copy";
import { hapticSelection } from "@/lib/telegram";

export type TabId = "live" | "picks" | "today" | "rank" | "play";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "live", label: COPY.nav.live, icon: "●" },
  { id: "picks", label: COPY.nav.picks, icon: "◎" },
  { id: "today", label: COPY.nav.today, icon: "◐" },
  { id: "rank", label: COPY.nav.rank, icon: "▲" },
  { id: "play", label: COPY.nav.play, icon: "★" },
];

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl"
      style={{
        background: "color-mix(in oklab, var(--color-background) 78%, transparent)",
        borderColor: "var(--color-border)",
        paddingBottom: "env(safe-area-inset-bottom)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <ul className="grid grid-cols-5 max-w-[480px] mx-auto">
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <li key={t.id}>
              <button
                onClick={() => {
                  hapticSelection();
                  onChange(t.id);
                }}
                className="press w-full flex flex-col items-center gap-1 pt-2 pb-1.5 relative"
                style={{
                  color: isActive ? BRAND.theme.accent : BRAND.theme.muted,
                }}
              >
                <span
                  className="text-[16px] leading-none transition-transform"
                  style={{
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                    filter: isActive ? `drop-shadow(0 0 6px ${BRAND.theme.accent})` : "none",
                  }}
                >
                  {t.icon}
                </span>
                <span className="text-[10px] font-semibold tracking-wide">{t.label}</span>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full"
                    style={{
                      background: BRAND.theme.accent,
                      boxShadow: `0 0 10px ${BRAND.theme.accent}`,
                    }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
