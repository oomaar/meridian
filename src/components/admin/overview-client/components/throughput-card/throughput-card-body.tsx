import { AreaChart } from "@/components/charts/area";
import type { SubmissionThroughputPoint } from "@/fake-db";
import type { TpWindow } from "../../types/TpWindow";
import { ArrowUpRightIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type ThroughputCardBodyProps = {
  data: SubmissionThroughputPoint[];
  win: TpWindow;
  peakPt: SubmissionThroughputPoint;
  median: number;
  setReportOpen: Dispatch<SetStateAction<boolean>>;
};

export function ThroughputCardBody({
  data,
  win,
  peakPt,
  median,
  setReportOpen,
}: ThroughputCardBodyProps) {
  return (
    <div className="m-card__body">
      <AreaChart data={data} height={200} />
      <div className="m-chart-foot">
        <div className="m-chart-foot__stat">
          <div className="m-chart-foot__label">
            Peak {win === "7d" ? "day" : "week"}
          </div>
          <div className="m-chart-foot__val">
            {peakPt.l.toUpperCase()} · {peakPt.v}
          </div>
        </div>
        <div className="m-chart-foot__stat">
          <div className="m-chart-foot__label">Median</div>
          <div className="m-chart-foot__val">{median}</div>
        </div>
        <div className="m-chart-foot__stat">
          <div className="m-chart-foot__label">Late submissions</div>
          <div className="m-chart-foot__val">4.2%</div>
        </div>
        <div className="m-spacer" />
        <button
          className="m-btn m-btn--ghost m-btn--sm"
          onClick={() => setReportOpen(true)}
        >
          Open report <ArrowUpRightIcon size={12} />
        </button>
      </div>
    </div>
  );
}
