import type { Semester, SemesterAnalytics } from "@/fake-db";
import type { Meta } from "../types/Meta";
import { NewCourseSheet } from "../../courses-client/sheets/new-course-sheet/new-course-sheet";
import { PostAnnouncementSheet } from "../sheets/post-announcement-sheet";
import { greeting } from "../helpers/greeting";
import { ExportButton } from "@/components/export-button";

type OverviewHeaderProps = {
  analytics: SemesterAnalytics | null;
  meta: Meta;
  activeSemester?: Semester;
};

export function OverviewHeader({
  analytics,
  activeSemester,
  meta,
}: OverviewHeaderProps) {
  return (
    <div className="m-page__header">
      <div className="m-page__title">
        <span className="m-page__eyebrow">
          Operations
          {activeSemester && meta
            ? ` · ${activeSemester.name} · Week ${meta.weekNumber} of ${meta.totalWeeks}`
            : ""}
        </span>
        <h1 className="m-page__h">{greeting()}, Ines.</h1>
        <p className="m-page__sub">
          All systems nominal.{" "}
          {analytics && (
            <>
              <b className="text-m-text">
                {analytics.openAssignmentsCount} open assignments
              </b>{" "}
              across {analytics.totalCourses} active sections, and FA26
              registration opens after commencement.
            </>
          )}
        </p>
      </div>
      <div className="m-page__actions">
        <ExportButton />
        <PostAnnouncementSheet />
        <NewCourseSheet />
      </div>
    </div>
  );
}
