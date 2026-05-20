import { getAdminInstructorsPage } from "@/fake-db/dashboards";
import { InstructorsTable } from "@/components/admin/instructors-table";
import { InviteInstructorButton } from "@/components/admin/invite-instructor-button";
import { ExportStudentsButton } from "@/components/admin/export-students-button";

export default function AdminInstructorsPage() {
  const { rows, total } = getAdminInstructorsPage();

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Academics · Spring 2026</span>
          <h1 className="m-page__h">Instructors</h1>
          <p className="m-page__sub">
            {total.toLocaleString()} faculty across 15 departments.
          </p>
        </div>
        <div className="m-page__actions">
          <ExportStudentsButton />
          <InviteInstructorButton />
        </div>
      </div>
      <div className="m-page__body">
        <InstructorsTable rows={rows} total={total} />
      </div>
    </>
  );
}
