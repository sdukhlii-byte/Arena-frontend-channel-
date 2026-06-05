import { useEffect, useRef, useState } from "react";
import { COPY } from "@/copy";
import { BRAND } from "@/brand.config";
import { haptic, hapticSelection } from "@/lib/telegram";

export function GameTag({ game }: { game: string }) {
  const color = BRAND.sport.gameColors[game] ?? BRAND.theme.accent;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded font-display text-[10px] tracking-widest"
      style={{
        color,
        background: `color-mix(in oklab, ${color} 14%, transparent)`,
        border: `1px solid color-mix(in oklab, ${color} 40%, transparent)`,
      }}
    >
      {game}
    </span>
  );
}

export function Card({
  children,
  className = "",
  style,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-3 ${onClick ? "press cursor-pointer" : ""} ${className}`}
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Empty({
  icon,
  title,
  hint,
  cta,
}: {
  icon: string;
  title: string;
  hint?: string;
  cta?: { label: string; onClick: () => void };
}) {
  return (
    <div className="text-center py-14 px-6">
      <div className="text-5xl mb-3">{icon}</div>
      <div className="font-display text-sm tracking-widest text-foreground">{title}</div>
      {hint && (
        <div className="mt-2 text-xs" style={{ color: BRAND.theme.muted }}>
          {hint}
        </div>
      )}
      {cta && (
        <IOSButton
          variant="tinted"
          className="mt-5 mx-auto"
          onClick={cta.onClick}
        >
          {cta.label}
        </IOSButton>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: "var(--color-surface-2)" }}
    />
  );
}

export function formatCountdown(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = t - Date.now();
  if (diff <= 0) return "soon";
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

export function formatLocalTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/* ===== iOS button ===== */
type IOSVariant = "filled" | "tinted" | "plain" | "destructive";
export function IOSButton({
  children,
  onClick,
  variant = "filled",
  className = "",
  disabled,
  fullWidth,
  hapticStyle = "medium",
  type = "button",
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: IOSVariant;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  hapticStyle?: "light" | "medium" | "heavy";
  type?: "button" | "submit";
  style?: React.CSSProperties;
}) {
  const base =
    "press tap-44 inline-flex items-center justify-center gap-2 rounded-xl px-5 font-semibold text-[15px] tracking-tight disabled:opacity-40 disabled:pointer-events-none";
  let variantStyle: React.CSSProperties = {};
  if (variant === "filled") {
    variantStyle = {
      background: BRAND.theme.accent,
      color: "#001b0e",
      boxShadow: `0 0 22px -6px ${BRAND.theme.accent}`,
    };
  } else if (variant === "tinted") {
    variantStyle = {
      background: `color-mix(in oklab, ${BRAND.theme.accent} 16%, transparent)`,
      color: BRAND.theme.accent,
    };
  } else if (variant === "plain") {
    variantStyle = { color: BRAND.theme.accent, background: "transparent" };
  } else {
    variantStyle = {
      background: "var(--color-destructive)",
      color: "var(--color-destructive-foreground)",
    };
  }
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        haptic(hapticStyle);
        onClick?.();
      }}
      className={`${base} ${fullWidth ? "w-full" : ""} ${className}`}
      style={{ ...variantStyle, ...style }}
    >
      {children}
    </button>
  );
}

/* ===== Segmented control ===== */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button
          key={o.value}
          data-on={o.value === value}
          onClick={() => {
            hapticSelection();
            onChange(o.value);
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ===== Toast ===== */
let toastSetter: ((msg: string | null) => void) | null = null;
export function showToast(msg: string) {
  toastSetter?.(msg);
}
export function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    toastSetter = setMsg;
    return () => {
      toastSetter = null;
    };
  }, []);
  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(() => setMsg(null), 2400);
    return () => clearTimeout(id);
  }, [msg]);
  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}

/* ===== Confidence ring ===== */
export function ConfidenceRing({ confidence }: { confidence: "High" | "Medium" }) {
  const isHigh = confidence === "High";
  const color = isHigh ? BRAND.theme.accent : BRAND.theme.accentAlt;
  const pct = isHigh ? 88 : 62;
  return (
    <div
      className="ring-conf font-display"
      style={{
        color,
        background: `conic-gradient(${color} ${pct * 3.6}deg, color-mix(in oklab, ${color} 12%, transparent) 0)`,
        boxShadow: `0 0 10px -2px ${color}`,
      }}
    >
      <span
        className="rounded-full grid place-items-center"
        style={{
          width: 22,
          height: 22,
          background: "var(--color-surface)",
        }}
      >
        {isHigh ? "H" : "M"}
      </span>
    </div>
  );
}

/* ===== Countdown pill (client-side, session bonus) ===== */
const BONUS_KEY = "mp_bonus_expires_v1";
export function getBonusExpiry(): number {
  if (typeof window === "undefined") return Date.now() + 86_400_000;
  try {
    const v = localStorage.getItem(BONUS_KEY);
    const t = v ? parseInt(v, 10) : 0;
    if (!t || t < Date.now()) {
      const next = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(BONUS_KEY, String(next));
      return next;
    }
    return t;
  } catch {
    return Date.now() + 86_400_000;
  }
}
export function CountdownPill({ until }: { until: number }) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, until - Date.now());
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-display tracking-widest"
      style={{
        background: "color-mix(in oklab, var(--color-destructive) 14%, transparent)",
        color: "var(--color-destructive)",
        border: "1px solid color-mix(in oklab, var(--color-destructive) 40%, transparent)",
      }}
    >
      <span className="live-dot" style={{ width: 6, height: 6 }} />
      OFFER · {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}

/* ===== Pull-to-refresh wrapper ===== */
export function PullToRefresh({
  onRefresh,
  children,
}: {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startRef = useRef<{ y: number; active: boolean }>({ y: 0, active: false });

  return (
    <div
      onTouchStart={(e) => {
        if (typeof window === "undefined") return;
        if (window.scrollY > 0 || refreshing) return;
        startRef.current = { y: e.touches[0].clientY, active: true };
      }}
      onTouchMove={(e) => {
        if (!startRef.current.active) return;
        const dy = e.touches[0].clientY - startRef.current.y;
        if (dy > 0) setPull(Math.min(80, dy * 0.5));
      }}
      onTouchEnd={async () => {
        if (!startRef.current.active) return;
        startRef.current.active = false;
        if (pull > 50) {
          setRefreshing(true);
          haptic("medium");
          try {
            await onRefresh();
          } finally {
            setRefreshing(false);
          }
        }
        setPull(0);
      }}
      style={{
        transform: `translateY(${pull}px)`,
        transition: pull === 0 ? "transform 220ms cubic-bezier(0.2,0.8,0.2,1)" : "none",
      }}
    >
      {(pull > 0 || refreshing) && (
        <div
          className="absolute left-0 right-0 flex justify-center"
          style={{ top: -28, color: BRAND.theme.accent }}
        >
          <div className="text-[10px] font-display tracking-widest">
            {refreshing ? COPY.pull.refreshing : pull > 50 ? COPY.pull.release : COPY.pull.pull}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
