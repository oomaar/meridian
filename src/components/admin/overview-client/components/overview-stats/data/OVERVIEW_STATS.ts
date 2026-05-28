import { OverviewStats } from "../types/OverviewStats";

export function generateOverviewStats(
  studentsTotal: number,
  submissionsLast7dTotal: number,
) {
  const OVERVIEW_STATS: OverviewStats[] = [
    {
      label: "Active enrollment",
      total: studentsTotal,
      statistics: {
        delta: "+1.8% vs SP25",
        spark: [420, 440, 460, 520, 580, 640, 690, 710, 748, 760, 780, 798],
        deltaType: "up",
      },
    },
    {
      label: "Assignments submitted (7d)",
      total: submissionsLast7dTotal,
      statistics: {
        delta: " wk-over-wk",
        spark: [180, 210, 260, 288, 320, 360, 402],
        deltaType: "up",
      },
    },
    {
      label: "Avg. grading turnaround",
      total: 38,
      valueSub: "hrs",
      statistics: {
        delta: "−6h vs target",
        spark: [58, 54, 49, 46, 44, 42, 38],
        deltaType: "up",
      },
    },
    {
      label: "Open petitions",
      total: 23,
      statistics: {
        delta: "7 high-priority",
        spark: [14, 18, 21, 19, 22, 25, 23],
        deltaType: "down",
      },
    },
  ];

  return { OVERVIEW_STATS };
}
