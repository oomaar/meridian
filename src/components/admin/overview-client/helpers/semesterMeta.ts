import type { Semester } from "@/fake-db";

export function semesterMeta(sem: Semester) {
  const NOW_MS = new Date("2026-05-17T10:00:00Z").getTime();
  const start = new Date(sem.startDate).getTime();
  const end = new Date(sem.endDate + "T23:59:59Z").getTime();
  const elapsed = Math.max(0, NOW_MS - start);
  const total = end - start;
  const progress = Math.min(1, elapsed / total);
  const totalWeeks = Math.ceil(total / (7 * 86_400_000));
  const weekNumber = Math.min(
    totalWeeks,
    Math.ceil(elapsed / (7 * 86_400_000)),
  );
  return { progress, weekNumber, totalWeeks };
}
