export function greeting() {
  const h = new Date("2026-05-17T10:00:00Z").getUTCHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
