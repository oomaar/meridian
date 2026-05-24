const TL_START_MS = new Date("2025-01-01").getTime();
const TL_END_MS = new Date("2027-07-01").getTime();
const TL_SPAN_MS = TL_END_MS - TL_START_MS;

export function computeBar(startIso: string, endIso: string) {
  const left =
    ((new Date(startIso).getTime() - TL_START_MS) / TL_SPAN_MS) * 100;
  const right = ((new Date(endIso).getTime() - TL_START_MS) / TL_SPAN_MS) * 100;
  return {
    tlLeft: Math.max(0, left),
    tlWidth: Math.max(0, Math.min(100, right) - Math.max(0, left)),
  };
}
