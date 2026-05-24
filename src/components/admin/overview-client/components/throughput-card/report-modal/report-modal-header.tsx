import { XIcon } from "lucide-react";
import { WIN_LABEL } from "../../../data/WIN_LABEL";
import { Dispatch, SetStateAction } from "react";
import type { TpWindow } from "../../../types/TpWindow";

type ReportModalHeaderProps = {
  setReportOpen: Dispatch<SetStateAction<boolean>>;
  win: TpWindow;
};

export function ReportModalHeader({
  setReportOpen,
  win,
}: ReportModalHeaderProps) {
  return (
    <div className="m-modal__head">
      <div>
        <div className="m-modal__title">Submission throughput report</div>
        <div className="m-modal__sub">
          {WIN_LABEL[win]} · Spring 2026 · all departments
        </div>
      </div>
      <button
        className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
        onClick={() => setReportOpen(false)}
      >
        <XIcon size={15} />
      </button>
    </div>
  );
}
