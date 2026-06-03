export function fmt(t: string) {
  const [h, m] = t.split(":").map(Number);

  const ampm = h >= 12 ? "PM" : "AM";

  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}
