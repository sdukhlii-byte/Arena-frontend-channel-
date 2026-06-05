import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/brand.config";
import { openExternal } from "@/lib/telegram";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy — ${BRAND.displayName}` },
      { name: "description", content: `Privacy policy for ${BRAND.displayName}.` },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-dvh px-6 py-10 max-w-[480px] mx-auto">
      <h1 className="font-display text-2xl" style={{ color: BRAND.theme.accent }}>
        Privacy
      </h1>
      <p className="mt-3 text-sm" style={{ color: BRAND.theme.muted }}>
        {BRAND.displayName} stores your preferences and pick history only in your device's
        local storage. We do not collect personal data inside this Mini App.
      </p>
      <p className="mt-3 text-sm" style={{ color: BRAND.theme.muted }}>
        Full policy at the link below.
      </p>
      <button
        onClick={() => openExternal(BRAND.privacyUrl)}
        className="mt-6 w-full py-3 rounded-xl font-display text-xs tracking-widest"
        style={{
          background: BRAND.theme.accent,
          color: "#001b0e",
          boxShadow: `0 0 18px -4px ${BRAND.theme.accent}`,
        }}
      >
        Open full privacy policy
      </button>
    </div>
  );
}
