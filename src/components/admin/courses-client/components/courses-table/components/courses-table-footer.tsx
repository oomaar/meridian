import { AdminCourseRow } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction } from "react";

type CoursesTableFooterProps = {
  hasMore: boolean;
  displayed: AdminCourseRow[];
  footerTotal: number;
  footerSuffix: "" | " matching";
  PAGE_SIZE: number;
  visible: number;
  setVisible: Dispatch<SetStateAction<number>>;
  total: number;
};

export function CoursesTableFooter({
  hasMore,
  displayed,
  footerTotal,
  footerSuffix,
  PAGE_SIZE,
  visible,
  setVisible,
  total,
}: CoursesTableFooterProps) {
  return (
    <div className="m-card__foot">
      <span>
        Showing <b>{displayed.length}</b> of{" "}
        <b>{footerTotal.toLocaleString()}</b>
        {footerSuffix}
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
