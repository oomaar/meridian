import { getAdminStudentsPage } from "@/fake-db/dashboards";
import { StudentsTable } from "@/components/admin/students-table";
import { AddStudentButton } from "@/components/admin/add-student-button";
import { ImportRosterButton } from "@/components/admin/import-roster-button";
import { ExportStudentsButton } from "@/components/admin/export-students-button";

export default function AdminStudentsPage() {
  const { rows, total } = getAdminStudentsPage();

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Academics · Spring 2026</span>
          <h1 className="m-page__h">Students</h1>
          <p className="m-page__sub">
            {total.toLocaleString()} enrolled across 47 programs.
          </p>
        </div>
        <div className="m-page__actions">
          <ImportRosterButton />
          <ExportStudentsButton />
          <AddStudentButton />
        </div>
      </div>
      <div className="m-page__body">
        <StudentsTable rows={rows} total={total} />
      </div>
    </>
  );
}
