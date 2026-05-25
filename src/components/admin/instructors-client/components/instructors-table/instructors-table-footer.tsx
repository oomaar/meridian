import { Dispatch, SetStateAction } from "react";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import { INSTRUCTORS_TABLE_PAGE_SIZE } from "./instructors-table";

type InstructorsTableFooterProps = {
  footerTotal: number;
  setVisible: Dispatch<SetStateAction<number>>;
  hasMore: boolean;
  isFiltered: boolean;
  displayed: AdminInstructorRow[];
  loadMoreCount: number;
};

export function InstructorsTableFooter({
  footerTotal,
  setVisible,
  hasMore,
  isFiltered,
  displayed,
  loadMoreCount,
}: InstructorsTableFooterProps) {
  return (
    <div className="m-card__foot">
      <span>
        Showing <b>{displayed.length}</b> of{" "}
        <b>{footerTotal.toLocaleString()}</b>
        {isFiltered ? " matching" : ""}
      </span>
      <div className="m-spacer" />
      <button
        className="m-btn m-btn--ghost m-btn--sm"
        disabled={!hasMore}
        onClick={() => setVisible((v) => v + INSTRUCTORS_TABLE_PAGE_SIZE)}
      >
        {hasMore ? `Load ${loadMoreCount} more` : "All loaded"}
      </button>
    </div>
  );
}
