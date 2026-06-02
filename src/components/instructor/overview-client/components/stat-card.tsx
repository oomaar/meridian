import { Spark } from "@/components/charts/spark";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  delta: string;
  deltaDir?: "up" | "down";
  spark?: number[];
  sparkColor?: string;
};

export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaDir,
  spark,
  sparkColor,
}: StatCardProps) {
  return (
    <div className="m-card">
      <div className="m-stat">
        <div className="m-stat__label">{label}</div>
        <div className="m-stat__value">
          {value}
          {unit && <sub>{unit}</sub>}
        </div>
        {deltaDir ? (
          <div className={`m-stat__delta m-stat__delta--${deltaDir}`}>
            {deltaDir === "up" ? (
              <ChevronUpIcon size={12} />
            ) : (
              <ChevronDownIcon size={12} />
            )}
            {delta}
          </div>
        ) : (
          <div className="m-stat__delta">{delta}</div>
        )}
        {spark && (
          <div className="m-stat__spark">
            <Spark data={spark} color={sparkColor} />
          </div>
        )}
      </div>
    </div>
  );
}
