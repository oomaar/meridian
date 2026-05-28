import { AdminCourseRosterRow } from "@/fake-db/dashboards";

export function generateGradesValues(roster: AdminCourseRosterRow[]) {
  // ── computed grades
  const gradeData = roster
    .map((r) => r.grade)
    .filter((g): g is number => g != null);
  const computedDist = Array.from({ length: 11 }, (_, i) => {
    const lo = 50 + i * 5;
    const hi = lo + 5;
    return gradeData.filter((g) => (i === 10 ? g >= lo : g >= lo && g < hi))
      .length;
  });
  const maxDist = Math.max(...computedDist, 1);
  const gradeMean = gradeData.length
    ? gradeData.reduce((a, b) => a + b, 0) / gradeData.length
    : 0;
  const gradeSorted = [...gradeData].sort((a, b) => a - b);
  const gradeMedian = gradeSorted[Math.floor(gradeSorted.length / 2)] ?? 0;
  const gradeStdev = gradeData.length
    ? Math.sqrt(
        gradeData.reduce((a, g) => a + (g - gradeMean) ** 2, 0) /
          gradeData.length,
      )
    : 0;
  const gradeFailRate =
    (gradeData.filter((g) => g < 60).length / (gradeData.length || 1)) * 100;

  return {
    gradeData,
    computedDist,
    maxDist,
    gradeMean,
    gradeSorted,
    gradeMedian,
    gradeStdev,
    gradeFailRate,
  };
}
