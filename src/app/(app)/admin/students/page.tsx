import { getAdminStudentsPage } from "@/fake-db/dashboards";
import { StudentsClient } from "@/components/admin/students-client";

export default function AdminStudentsPage() {
  const { rows, total } = getAdminStudentsPage();
  return <StudentsClient rows={rows} total={total} />;
}
