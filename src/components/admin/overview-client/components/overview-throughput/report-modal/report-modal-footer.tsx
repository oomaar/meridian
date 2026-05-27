import { DownloadIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type ReportModalFooterProps = {
  setReportOpen: Dispatch<SetStateAction<boolean>>;
};

export function ReportModalFooter({ setReportOpen }: ReportModalFooterProps) {
  return (
    <div className="m-modal__foot">
      <span style={{ fontSize: 12, color: "var(--m-text-3)" }}>
        Based on 847 active assignments across 1,184 sections
      </span>
      <div className="m-spacer" />
      <button className="m-btn m-btn--ghost m-btn--sm">
        <DownloadIcon size={13} /> Download CSV
      </button>
      <button
        className="m-btn m-btn--primary m-btn--sm"
        onClick={() => setReportOpen(false)}
      >
        Close
      </button>
    </div>
  );
}
