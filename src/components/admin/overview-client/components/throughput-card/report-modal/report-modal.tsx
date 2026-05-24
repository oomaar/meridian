import { AreaChart } from "@/components/charts/area";
import { Dispatch, SetStateAction } from "react";
import type { TpWindow } from "../../../types/TpWindow";
import type { SubmissionThroughputPoint } from "@/fake-db";
import { ReportModalBreakdown } from "./report-modal-breakdown";
import { ReportModalInsights } from "./report-modal-insights";
import { ReportModalFooter } from "./report-modal-footer";
import { ReportModalKeyStats } from "./report-modal-key-stats";
import { ReportModalHeader } from "./report-modal-header";

type ReportModalProps = {
  setReportOpen: Dispatch<SetStateAction<boolean>>;
  win: TpWindow;
  total: number;
  data: SubmissionThroughputPoint[];
  peakPt: SubmissionThroughputPoint;
  median: number;
};

export function ReportModal({
  setReportOpen,
  total,
  win,
  data,
  peakPt,
  median,
}: ReportModalProps) {
  return (
    <>
      <div className="m-modal-overlay" onClick={() => setReportOpen(false)} />
      <div
        className="m-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Submission throughput report"
      >
        <ReportModalHeader setReportOpen={setReportOpen} win={win} />
        <div className="m-modal__body">
          <AreaChart data={data} height={240} />
          <ReportModalKeyStats
            median={median}
            total={total}
            win={win}
            peakPt={peakPt}
          />
          <hr className="m-rule" />
          <ReportModalBreakdown />
          <hr className="m-rule" />
          <ReportModalInsights />
        </div>
        <ReportModalFooter setReportOpen={setReportOpen} />
      </div>
    </>
  );
}
