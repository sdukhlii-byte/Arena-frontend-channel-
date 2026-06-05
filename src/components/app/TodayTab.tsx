// "Today" surface = live content feed (crypto / casino / esports), divided by
// category. Match scheduling lives on Live; real-match analysis lives on Picks.
// The feed implementation is in FeedTab.tsx so it stays reusable.
import { FeedTab } from "./FeedTab";

// `onJoin` is accepted for call-site compatibility with index.tsx but unused:
// the feed opens external news links rather than the channel-join flow.
export function TodayTab(_props: { onJoin: () => void }) {
  return <FeedTab />;
}
