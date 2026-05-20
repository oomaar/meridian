import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { getAdminCoursesPage } from "@/fake-db/dashboards";
import { CoursesTable } from "@/components/admin/courses-table";

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
          <button className="m-btn">
            <RefreshCwIcon size={14} /> Sync with SIS
          </button>
          <button className="m-btn m-btn--primary">
            <PlusIcon size={14} /> New course
          </button>
        </div>
      </div>

      <div className="m-page__body">
        <CoursesTable rows={rows} total={total} />
      </div>
    </>
  );
}
