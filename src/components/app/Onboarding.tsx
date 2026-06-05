import { useMemo, useState } from "react";
import { BRAND } from "@/config";
import { COPY } from "@/copy";
import { funnel } from "@/lib/funnel";
import { haptic, hapticSelection, useBackButton } from "@/lib/telegram";
import type { Prefs } from "@/lib/store";
import { IOSButton } from "./ui";

interface Props {
  onDone: (prefs: Prefs) => void;
  onJoin: () => void;
}

export function Onboarding({ onDone, onJoin }: Props) {
  const [step, setStep] = useState(0);
  const [sport, setSport] = useState<string | undefined>();
  const [leagues, setLeagues] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);

  const wantsFootball = sport === "Football" || sport === "Both";
  const wantsEsports = sport === "Esports" || sport === "Both";

  const suggestions = useMemo(() => {
    const out = new Set<string>();
    Object.entries(BRAND.sport.teamSuggestions).forEach(([key, list]) => {
      if (key === "Football" && wantsFootball) list.forEach((t) => out.add(t));
      if (key !== "Football" && wantsEsports) list.forEach((t) => out.add(t));
    });
    return [...out];
  }, [wantsFootball, wantsEsports]);

  const persist = () => onDone({ sport, leagues, games, teams });

  useBackButton(step > 0, () => setStep((s) => Math.max(0, s - 1)));

  const toggle = (arr: string[], set: (v: string[]) => void, item: string) => {
    hapticSelection();
    set(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  return (
    <div
      className="min-h-dvh grid-bg flex flex-col"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-8 rounded-full transition-all"
                style={{
                  background: i <= step ? BRAND.theme.accent : "var(--color-border)",
                  boxShadow: i === step ? `0 0 8px ${BRAND.theme.accent}` : undefined,
                }}
              />
            ))}
          </div>
          <button
            onClick={() => {
              haptic("light");
              persist();
            }}
            className="press text-xs font-semibold"
            style={{ color: BRAND.theme.muted }}
          >
            {COPY.onb.skip}
          </button>
        </div>

        <div className="mt-10 flex-1">
          {step === 0 && (
            <div className="tab-fade">
              <h2 className="font-display text-2xl">{COPY.onb.step0Title}</h2>
              <p className="mt-1 text-sm" style={{ color: BRAND.theme.muted }}>
                {COPY.onb.step0Sub}
              </p>
              <div className="mt-6 grid gap-3">
                {BRAND.sport.sportOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      hapticSelection();
                      setSport(s);
                    }}
                    className="press tap-44 py-4 rounded-2xl border font-display tracking-widest text-sm"
                    style={{
                      borderColor: sport === s ? BRAND.theme.accent : "var(--color-border)",
                      background: "var(--color-surface)",
                      color: sport === s ? BRAND.theme.accent : "var(--color-foreground)",
                      boxShadow:
                        sport === s ? `0 0 18px -4px ${BRAND.theme.accent}` : undefined,
                    }}
                  >
                    {COPY.sportLabel[s] ?? s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="tab-fade">
              <h2 className="font-display text-2xl">{COPY.onb.step1Title}</h2>
              <p className="mt-1 text-sm" style={{ color: BRAND.theme.muted }}>
                {COPY.onb.step1Sub}
              </p>

              {wantsFootball && (
                <>
                  <SectionLabel>{COPY.onb.leagues}</SectionLabel>
                  <Chips
                    items={BRAND.sport.footballLeagues}
                    selected={leagues}
                    onToggle={(i) => toggle(leagues, setLeagues, i)}
                  />
                </>
              )}
              {wantsEsports && (
                <>
                  <SectionLabel>{COPY.onb.disciplines}</SectionLabel>
                  <Chips
                    items={BRAND.sport.esportsGames}
                    selected={games}
                    onToggle={(i) => toggle(games, setGames, i)}
                  />
                </>
              )}

              <SectionLabel>{COPY.onb.favTeams}</SectionLabel>
              <Chips
                items={suggestions}
                selected={teams}
                onToggle={(i) => toggle(teams, setTeams, i)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="tab-fade text-center">
              <div
                className="text-6xl mb-3 inline-block"
                style={{ filter: `drop-shadow(0 0 16px ${BRAND.theme.accent})` }}
              >
                📣
              </div>
              <h2 className="font-display text-2xl" style={{ color: BRAND.theme.accent }}>
                {COPY.onb.finalTitle}
              </h2>
              <p className="mt-2 text-sm" style={{ color: BRAND.theme.muted }}>
                {COPY.onb.finalSub}
              </p>

              <IOSButton
                variant="filled"
                fullWidth
                className="mt-6"
                onClick={() => {
                  void funnel.event("cta_tap", { surface: "onboarding_final" });
                  onJoin();
                  persist();
                }}
              >
                {COPY.onb.joinAndEnter}
              </IOSButton>
              <button
                onClick={() => {
                  haptic("light");
                  persist();
                }}
                className="press mt-3 text-xs font-semibold"
                style={{ color: BRAND.theme.muted }}
              >
                {COPY.onb.later}
              </button>
            </div>
          )}
        </div>

        {step < 2 && (
          <div
            className="pt-6 flex gap-2"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {step > 0 && (
              <IOSButton
                variant="tinted"
                className="flex-1"
                hapticStyle="light"
                onClick={() => setStep(step - 1)}
              >
                {COPY.onb.back}
              </IOSButton>
            )}
            <IOSButton
              variant="filled"
              className="flex-[2]"
              disabled={step === 0 && !sport}
              onClick={() => setStep(step + 1)}
            >
              {step === 0 ? COPY.onb.next : COPY.onb.done}
            </IOSButton>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-6 mb-2 font-display text-[10px] tracking-widest"
      style={{ color: BRAND.theme.muted }}
    >
      {children}
    </div>
  );
}

function Chips({
  items,
  selected,
  onToggle,
}: {
  items: string[];
  selected: string[];
  onToggle: (i: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => {
        const on = selected.includes(i);
        return (
          <button
            key={i}
            onClick={() => onToggle(i)}
            className="press px-3 py-1.5 rounded-full text-xs border"
            style={{
              borderColor: on ? BRAND.theme.accent : "var(--color-border)",
              color: on ? BRAND.theme.accent : "var(--color-foreground)",
              background: on
                ? `color-mix(in oklab, ${BRAND.theme.accent} 14%, transparent)`
                : "var(--color-surface)",
            }}
          >
            {i}
          </button>
        );
      })}
    </div>
  );
}
