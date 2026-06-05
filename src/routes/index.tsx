import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BRAND } from "@/config";
import { useTelegram } from "@/lib/telegram";
import { usePrefs } from "@/lib/store";
import { useFunnel } from "@/hooks/useFunnel";
import { LANG } from "@/copy";
import { Header } from "@/components/app/Header";
import { BottomNav, type TabId } from "@/components/app/BottomNav";
import { LiveTab } from "@/components/app/LiveTab";
import { TodayTab } from "@/components/app/TodayTab";
import { PicksTab } from "@/components/app/PicksTab";
import { RankTab } from "@/components/app/RankTab";
import { PlayTab } from "@/components/app/PlayTab";
import { Onboarding } from "@/components/app/Onboarding";
import { StickyCTA } from "@/components/app/StickyCTA";
import { ToastHost } from "@/components/app/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND.displayName} — ${BRAND.tagline.en}` },
      { name: "description", content: BRAND.tagline.en },
      { property: "og:title", content: BRAND.displayName },
      { property: "og:description", content: BRAND.tagline.en },
      { name: "theme-color", content: BRAND.theme.bg },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1",
      },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    scripts: [{ src: "https://telegram.org/js/telegram-web-app.js", async: true }],
  }),
  component: App,
});

function App() {
  const { user } = useTelegram();
  const { onboarded, save, finishOnboarding } = usePrefs();
  const f = useFunnel(LANG);
  const [tab, setTab] = useState<TabId>("picks");

  if (!onboarded) {
    return (
      <div className="scanlines">
        <Onboarding
          onDone={(p) => {
            save(p);
            finishOnboarding();
          }}
          onJoin={f.startJoin}
        />
      </div>
    );
  }

  const wallVisible = !!f.gate?.enabled && !f.member;

  return (
    <div className="scanlines min-h-dvh">
      <Header user={user} stats={f.stats} />
      <main className="px-4 pt-4 pb-32 max-w-[480px] mx-auto">
        {tab === "live" && <LiveTab onJoin={f.startJoin} />}
        {tab === "picks" && (
          <PicksTab
            picks={f.picks}
            gate={f.gate}
            member={f.member}
            loading={f.loading}
            source={f.source}
            onJoin={f.startJoin}
          />
        )}
        {tab === "today" && <TodayTab onJoin={f.startJoin} />}
        {tab === "rank" && (
          <RankTab stats={f.stats} member={f.member} onJoin={f.startJoin} />
        )}
        <div style={{ display: tab === "play" ? "block" : "none" }}>
          <PlayTab
            active={tab === "play"}
            stats={f.stats}
            member={f.member}
            channelHandle={f.channel.handle}
            onJoin={f.startJoin}
          />
        </div>
      </main>
      <StickyCTA hidden={tab === "play" || !wallVisible} onJoin={f.startJoin} />
      <BottomNav active={tab} onChange={setTab} />
      <ToastHost />
    </div>
  );
}
