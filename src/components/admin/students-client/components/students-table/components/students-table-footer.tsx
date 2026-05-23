import { AdminStudentRow } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction } from "react";

type StudentsTableFooterProps = {
  displayed: AdminStudentRow[];
  footerTotal: number;
  isFiltered: boolean;
  hasMore: boolean;
  PAGE_SIZE: number;
  visible: number;
  setVisible: Dispatch<SetStateAction<number>>;
  total: number;
};

export function StudentsTableFooter({
  displayed,
  footerTotal,
  isFiltered,
  hasMore,
  PAGE_SIZE,
  visible,
  setVisible,
  total,
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
        onClick={() => setVisible((v) => v + PAGE_SIZE)}
      >
        {hasMore
          ? `Load ${Math.min(PAGE_SIZE, total - visible)} more`
          : "All loaded"}
      </button>
    </div>
  );
}
