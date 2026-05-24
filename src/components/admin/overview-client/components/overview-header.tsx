import type { Semester, SemesterAnalytics } from "@/fake-db";
import type { Meta } from "../types/Meta";
import { ExportButton } from "../../activity-client/ExportButton";
import { NewCourseButton } from "../../courses-client/components/new-course-button";
import { PostAnnouncementButton } from "../../post-announcement-button";
import { greeting } from "../helpers/greeting";

type OverviewHeaderProps = {
  analytics: SemesterAnalytics | null;
  meta: Meta;
  sem?: Semester;
};

export function OverviewHeader({ analytics, sem, meta }: OverviewHeaderProps) {
  return (
    <div className="m-page__header">
      <div className="m-page__title">
        <span className="m-page__eyebrow">
          Operations
          {sem && meta
            ? ` · ${sem.name} · Week ${meta.weekNumber} of ${meta.totalWeeks}`
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
        <PostAnnouncementButton />
        <NewCourseButton />
      </div>
    </div>
  );
}
