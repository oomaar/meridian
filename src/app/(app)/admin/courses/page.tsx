import { getAdminCoursesPage } from "@/fake-db/dashboards";
import { CoursesTable } from "@/components/admin/courses-table";
import { NewCourseButton } from "@/components/admin/new-course-button";
import { SyncSISButton } from "@/components/admin/sync-sis-button";

export default function AdminCoursesPage() {
  const { rows, total } = getAdminCoursesPage();

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Academics</span>
          <h1 className="m-page__h">Courses</h1>
          <p className="m-page__sub">
            {total.toLocaleString()} sections across 47 programs. Catalog locks Nov 28 for SP26.
          </p>
        </div>
        <div className="m-page__actions">
          <SyncSISButton />
          <NewCourseButton />
        </div>
      </div>

      <div className="m-page__body">
        <CoursesTable rows={rows} total={total} />
      </div>
    </>
  );
}
