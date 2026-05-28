import type { SubmissionThroughputPoint } from "@/fake-db";
import type { TpWindow } from "../../../types/TpWindow";

type ReportModalKeyStatsProps = {
  total: number;
  win: TpWindow;
  peakPt: SubmissionThroughputPoint;
  median: number;
};

export function ReportModalKeyStats({
  total,
  win,
  peakPt,
  median,
}: ReportModalKeyStatsProps) {
  return (
    <div className="m-modal-stats">
      <div className="m-modal-stat">
        <div className="m-modal-stat__label">Total submissions</div>
        <div className="m-modal-stat__value">{total.toLocaleString()}</div>
      </div>
      <div className="m-modal-stat">
        <div className="m-modal-stat__label">
          Peak {win === "7d" ? "day" : "week"}
        </div>
        <div className="m-modal-stat__value">
          {peakPt.l.toUpperCase()} · {peakPt.v}
        </div>
      </div>
      <div className="m-modal-stat">
        <div className="m-modal-stat__label">Median / period</div>
        <div className="m-modal-stat__value">{median}</div>
      </div>
      <div className="m-modal-stat">
        <div className="m-modal-stat__label">Late rate</div>
        <div
          className="m-modal-stat__value"
          style={{ color: "var(--m-success)" }}
        >
          4.2%
        </div>
      </div>
      <div className="m-modal-stat">
        <div className="m-modal-stat__label">Target late rate</div>
        <div className="m-modal-stat__value">6.0%</div>
      </div>
      <div className="m-modal-stat">
        <div className="m-modal-stat__label">YoY change</div>
        <div
          className="m-modal-stat__value"
          style={{ color: "var(--m-success)" }}
        >
          +11.4%
        </div>
      </div>
    </div>
  );
}
