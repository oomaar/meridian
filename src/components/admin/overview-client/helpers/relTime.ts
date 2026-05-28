export function relTime(ts: string): string {
  const NOW_MS = new Date("2026-05-17T10:00:00Z").getTime();
  const mins = Math.floor((NOW_MS - new Date(ts).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
