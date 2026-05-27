import { Spark } from "@/components/charts/spark";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { generateOverviewStats } from "./data/OVERVIEW_STATS";

type OverviewStatsProps = {
  totals: {
    students: number;
    instructors: number;
    courses: number;
    activeCourses: number;
  };
  submissionsLast7d: number;
};

export function OverviewStats({
  totals,
  submissionsLast7d,
}: OverviewStatsProps) {
  const { OVERVIEW_STATS } = generateOverviewStats(
    totals.students,
    submissionsLast7d,
  );

  return (
    <div className="m-grid m-grid-4">
      {OVERVIEW_STATS.map((card, index) => (
        <div className="m-card" key={index}>
          <div className="m-stat">
            <div className="m-stat__label">{card.label}</div>
            <div className="m-stat__value">
              {card.total}
              <sub>{card.valueSub}</sub>
            </div>
            <div
              className={`m-stat__delta ${card.statistics.deltaType === "up" ? "m-stat__delta--up" : "m-stat__delta--down"}`}
            >
              {card.statistics.deltaType === "up" ? (
                <ChevronUpIcon size={12} />
              ) : (
                <ChevronDownIcon size={12} />
              )}
              {card.statistics.delta}
            </div>
            <div className="m-stat__spark">
              <Spark data={card.statistics.spark} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
