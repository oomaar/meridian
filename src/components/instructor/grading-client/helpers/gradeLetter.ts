import type { GradeLetter } from "../types/GradeLetter";

export function gradeLetter(score: number, max: number): GradeLetter {
  const pct = score / max;
  if (pct >= 0.93) return { label: "A", tone: "success" };
  if (pct >= 0.9) return { label: "A-", tone: "success" };
  if (pct >= 0.87) return { label: "B+", tone: "success" };
  if (pct >= 0.83) return { label: "B", tone: "info" };
  if (pct >= 0.8) return { label: "B-", tone: "info" };
  if (pct >= 0.77) return { label: "C+", tone: "info" };
  if (pct >= 0.7) return { label: "C", tone: "" };

  return { label: "D", tone: "warning" };
}
