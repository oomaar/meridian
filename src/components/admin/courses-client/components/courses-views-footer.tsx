import { AdminCourseRow } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction } from "react";
import { COURSES_PAGE_SIZE } from "./courses-views";

type CoursesViewsFooterProps = {
  hasMore: boolean;
  displayed: AdminCourseRow[];
  footerTotal: number;
  footerSuffix: "" | " matching";
  setVisible: Dispatch<SetStateAction<number>>;
  loadMoreCount: number;
};

export function CoursesViewsFooter({
  hasMore,
  displayed,
  footerTotal,
  footerSuffix,
  setVisible,
  loadMoreCount,
}: CoursesViewsFooterProps) {
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
        onClick={() => setVisible((v) => v + COURSES_PAGE_SIZE)}
      >
        {hasMore ? `Load ${loadMoreCount} more` : "All loaded"}
      </button>
    </div>
  );
}
