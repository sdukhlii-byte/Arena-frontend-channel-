import { useEffect, useMemo, useRef, useState } from "react";
import { BRAND } from "@/config";
import { LANG } from "@/copy";
import {
  funnel,
  type NewsCategory,
  type NewsItem,
  type NewsMarket,
} from "@/lib/funnel";
import { Card, Empty, PullToRefresh, Segmented, Skeleton } from "./ui";
import { haptic, openExternal } from "@/lib/telegram";

/* ── localized copy (self-contained so it doesn't touch the global CopyShape) ── */
const FEED_COPY = {
  en: {
    tabs: { all: "All", crypto: "Crypto", casino: "Casino", esports: "Esports" },
    empty: "Feed is warming up",
    emptyHint: "Live crypto, casino & esports headlines land here.",
    refreshing: "Refreshing…",
    fng: "Fear & Greed",
    updated: (s: string) => `Updated ${s}`,
    now: "now",
  },
  ru: {
    tabs: { all: "Все", crypto: "Крипто", casino: "Казино", esports: "Киберспорт" },
    empty: "Лента прогревается",
    emptyHint: "Свежие новости крипто, казино и киберспорта появятся здесь.",
    refreshing: "Обновляю…",
    fng: "Страх и жадность",
    updated: (s: string) => `Обновлено ${s}`,
    now: "сейчас",
  },
  es: {
    tabs: { all: "Todo", crypto: "Cripto", casino: "Casino", esports: "Esports" },
    empty: "El feed se está calentando",
    emptyHint: "Aquí aparecen titulares de cripto, casino y esports.",
    refreshing: "Actualizando…",
    fng: "Miedo y Codicia",
    updated: (s: string) => `Actualizado ${s}`,
    now: "ahora",
  },
}[LANG === "ru" || LANG === "es" ? LANG : "en"];

const CATEGORY_COLOR: Record<string, string> = {
  crypto: BRAND.theme.accentAlt, // cyan
  casino: "#f4a832", // gold
  esports: "#ff4655", // valorant red
};

const CATEGORY_LABEL: Record<string, string> = {
  crypto: "CRYPTO",
  casino: "CASINO",
  esports: "ESPORTS",
};

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (!isFinite(diff)) return "";
  const m = Math.floor(diff / 60000);
  if (m < 1) return FEED_COPY.now;
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function fmtPrice(p: number | null): string {
  if (p == null) return "—";
  if (p >= 1000) return `$${Math.round(p).toLocaleString("en-US")}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

function fngColor(v: number): string {
  if (v >= 75) return "#00ff88"; // extreme greed
  if (v >= 55) return "#9ad34a";
  if (v >= 45) return "#f4d03f";
  if (v >= 25) return "#f4a832";
  return "#ff4655"; // extreme fear
}

/* ── market strip ─────────────────────────────────────────────────────────── */
function MarketStrip({ market }: { market: NewsMarket | null }) {
  if (!market) return null;
  const hasCoins = market.coins && market.coins.length > 0;
  if (!hasCoins && !market.fng) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
      {market.fng && (
        <div
          className="shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 border"
          style={{
            background: "var(--color-surface)",
            borderColor: `color-mix(in oklab, ${fngColor(market.fng.value)} 45%, transparent)`,
          }}
        >
          <div
            className="grid place-items-center rounded-full font-display text-[12px]"
            style={{
              width: 30,
              height: 30,
              color: "#001b0e",
              background: fngColor(market.fng.value),
              boxShadow: `0 0 12px -2px ${fngColor(market.fng.value)}`,
            }}
          >
            {market.fng.value}
          </div>
          <div className="leading-tight">
            <div className="text-[9px] tracking-widest" style={{ color: BRAND.theme.muted }}>
              {FEED_COPY.fng.toUpperCase()}
            </div>
            <div className="text-[11px] font-semibold" style={{ color: fngColor(market.fng.value) }}>
              {market.fng.label}
            </div>
          </div>
        </div>
      )}

      {market.coins.map((c) => {
        const up = (c.change_24h ?? 0) >= 0;
        const col = up ? "#00ff88" : "#ff4655";
        return (
          <div
            key={c.symbol}
            className="shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 border"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div className="leading-tight">
              <div className="text-[10px] font-display tracking-widest" style={{ color: BRAND.theme.muted }}>
                {c.symbol}
              </div>
              <div className="text-[12px] font-semibold">{fmtPrice(c.price)}</div>
            </div>
            <div className="text-[11px] font-display tracking-wide" style={{ color: col }}>
              {up ? "▲" : "▼"} {Math.abs(c.change_24h ?? 0).toFixed(1)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── news card ────────────────────────────────────────────────────────────── */
function NewsCard({ item }: { item: NewsItem }) {
  const col = CATEGORY_COLOR[item.category] ?? BRAND.theme.accent;
  const open = () => {
    haptic("light");
    void funnel.event("cta_tap", { surface: "feed_item", source: item.source });
    openExternal(item.url);
  };

  return (
    <Card onClick={open} className="tab-fade">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded font-display text-[9px] tracking-widest"
            style={{
              color: col,
              background: `color-mix(in oklab, ${col} 14%, transparent)`,
              border: `1px solid color-mix(in oklab, ${col} 40%, transparent)`,
            }}
          >
            {CATEGORY_LABEL[item.category] ?? item.category.toUpperCase()}
          </span>
          <span className="text-[11px]" style={{ color: BRAND.theme.muted }}>
            {item.source}
          </span>
        </div>
        <span className="text-[10px] font-display tracking-widest" style={{ color: BRAND.theme.muted }}>
          {relTime(item.published_at)}
        </span>
      </div>

      <div className="mt-2 flex gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold leading-snug line-clamp-2">{item.title}</div>
          {item.summary && (
            <div
              className="mt-1 text-[12px] leading-snug line-clamp-2"
              style={{ color: BRAND.theme.muted }}
            >
              {item.summary}
            </div>
          )}
        </div>
        {item.image && (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            onError={(e) => ((e.currentTarget.style.display = "none"))}
            className="shrink-0 rounded-lg object-cover"
            style={{ width: 64, height: 64, background: "var(--color-surface-2)" }}
          />
        )}
      </div>
    </Card>
  );
}

/* ── tab ──────────────────────────────────────────────────────────────────── */
export function FeedTab() {
  const [cat, setCat] = useState<NewsCategory>("all");
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [market, setMarket] = useState<NewsMarket | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const reqId = useRef(0);

  const load = async (category: NewsCategory) => {
    const my = ++reqId.current;
    try {
      const d = await funnel.news(category, 40);
      if (my !== reqId.current) return; // a newer request superseded this one
      setItems(d.items || []);
      setMarket(d.market || null);
      setUpdatedAt(d.updated_at || null);
    } catch {
      if (my !== reqId.current) return;
      setItems([]);
    }
  };

  // load on category switch
  useEffect(() => {
    setItems(null);
    void load(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat]);

  // silent auto-refresh every 5 min (no skeleton flash)
  useEffect(() => {
    const id = setInterval(() => void load(cat), 5 * 60 * 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat]);

  const updatedLabel = useMemo(
    () => (updatedAt ? FEED_COPY.updated(relTime(updatedAt)) : ""),
    [updatedAt],
  );

  return (
    <PullToRefresh onRefresh={() => load(cat)}>
      <div className="space-y-3 tab-fade">
        <MarketStrip market={market} />

        <Segmented
          value={cat}
          onChange={setCat}
          options={[
            { value: "all", label: FEED_COPY.tabs.all },
            { value: "crypto", label: FEED_COPY.tabs.crypto },
            { value: "casino", label: FEED_COPY.tabs.casino },
            { value: "esports", label: FEED_COPY.tabs.esports },
          ]}
        />

        {items === null ? (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <Empty icon="📡" title={FEED_COPY.empty} hint={FEED_COPY.emptyHint} />
        ) : (
          <>
            {updatedLabel && (
              <div
                className="text-center text-[10px] font-display tracking-widest"
                style={{ color: BRAND.theme.muted }}
              >
                {updatedLabel}
              </div>
            )}
            {items.map((it) => (
              <NewsCard key={it.id} item={it} />
            ))}
          </>
        )}
      </div>
    </PullToRefresh>
  );
}
