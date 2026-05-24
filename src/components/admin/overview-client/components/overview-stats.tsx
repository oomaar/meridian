import { Spark } from "@/components/charts/spark";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

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
  return (
    <div className="m-grid m-grid-4">
      <div className="m-card">
        <div className="m-stat">
          <div className="m-stat__label">Active enrollment</div>
          <div className="m-stat__value">
            {totals.students.toLocaleString()}
          </div>
          <div className="m-stat__delta m-stat__delta--up">
            <ChevronUpIcon size={12} />
            +1.8% vs SP25
          </div>
          <div className="m-stat__spark">
            <Spark
              data={[
                420, 440, 460, 520, 580, 640, 690, 710, 748, 760, 780, 798,
              ]}
            />
          </div>
        </div>
      </div>

      <div className="m-card">
        <div className="m-stat">
          <div className="m-stat__label">Assignments submitted (7d)</div>
          <div className="m-stat__value">
            {submissionsLast7d.toLocaleString()}
          </div>
          <div className="m-stat__delta m-stat__delta--up">
            <ChevronUpIcon size={12} />
            wk-over-wk
          </div>
          <div className="m-stat__spark">
            <Spark
              data={[180, 210, 260, 288, 320, 360, 402]}
              color="var(--m-success)"
            />
          </div>
        </div>
      </div>

      <div className="m-card">
        <div className="m-stat">
          <div className="m-stat__label">Avg. grading turnaround</div>
          <div className="m-stat__value">
            38<sub>hrs</sub>
          </div>
          <div className="m-stat__delta m-stat__delta--up">
            <ChevronUpIcon size={12} />
            −6h vs target
          </div>
          <div className="m-stat__spark">
            <Spark data={[58, 54, 49, 46, 44, 42, 38]} color="var(--m-info)" />
          </div>
        </div>
      </div>

      <div className="m-card">
        <div className="m-stat">
          <div className="m-stat__label">Open petitions</div>
          <div className="m-stat__value">23</div>
          <div className="m-stat__delta m-stat__delta--down">
            <ChevronDownIcon size={12} />7 high-priority
          </div>
          <div className="m-stat__spark">
            <Spark
              data={[14, 18, 21, 19, 22, 25, 23]}
              color="var(--m-warning)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
