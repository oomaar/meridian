import { DownloadIcon, PlusIcon, UploadIcon } from "lucide-react";
import { getAdminStudentsPage } from "@/fake-db/dashboards";
import { StudentsTable } from "@/components/admin/students-table";

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
          <button className="m-btn">
            <UploadIcon size={14} /> Import roster
          </button>
          <button className="m-btn">
            <DownloadIcon size={14} /> Export
          </button>
          <button className="m-btn m-btn--primary">
            <PlusIcon size={14} /> Add student
          </button>
        </div>
      </div>
      <div className="m-page__body">
        <StudentsTable rows={rows} total={total} />
      </div>
    </>
  );
}
