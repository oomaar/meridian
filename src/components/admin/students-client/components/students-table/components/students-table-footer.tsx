import { AdminStudentRow } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction } from "react";
import { STUDENTS_TABLE_PAGE_SIZE } from "../students-table";

type StudentsTableFooterProps = {
  displayed: AdminStudentRow[];
  footerTotal: number;
  isFiltered: boolean;
  hasMore: boolean;
  setVisible: Dispatch<SetStateAction<number>>;
  loadMoreCount: number;
};

export function StudentsTableFooter({
  displayed,
  footerTotal,
  isFiltered,
  hasMore,
  setVisible,
  loadMoreCount,
}: StudentsTableFooterProps) {
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
        onClick={() => setVisible((v) => v + STUDENTS_TABLE_PAGE_SIZE)}
      >
        {hasMore ? `Load ${loadMoreCount} more` : "All loaded"}
      </button>
    </div>
  );
}
