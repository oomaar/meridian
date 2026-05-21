import { TimeRangeId } from "../types/TimeRangeId";

export const TIME_RANGES: { id: TimeRangeId; label: string; mins: number }[] = [
  { id: "1h", label: "Last hour", mins: 60 },
  { id: "6h", label: "Last 6 hours", mins: 360 },
  { id: "24h", label: "Last 24 hours", mins: 1_440 },
  { id: "7d", label: "Last 7 days", mins: 10_080 },
  { id: "30d", label: "Last 30 days", mins: 43_200 },
];
