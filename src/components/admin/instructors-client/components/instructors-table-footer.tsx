import { Dispatch, SetStateAction } from "react";
import { PAGE_SIZE } from "./instructors-table";
import type { AdminInstructorRow } from "@/fake-db/dashboards";

type InstructorsTableFooterProps = {
  footerTotal: number;
  visible: number;
  setVisible: Dispatch<SetStateAction<number>>;
  hasMore: boolean;
  isFiltered: boolean;
  displayed: AdminInstructorRow[];
  filtered: AdminInstructorRow[];
};

export function InstructorsTableFooter({
  footerTotal,
  visible,
  setVisible,
  hasMore,
  isFiltered,
  displayed,
  filtered,
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
        onClick={() => setVisible((v) => v + PAGE_SIZE)}
      >
        {hasMore
          ? `Load ${Math.min(PAGE_SIZE, filtered.length - visible)} more`
          : "All loaded"}
      </button>
    </div>
  );
}
