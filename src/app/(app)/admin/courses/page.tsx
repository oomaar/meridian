import { getAdminCoursesPage } from "@/fake-db/dashboards";
import { CoursesClient } from "@/components/admin/courses-client/courses-client";

export default function AdminCoursesPage() {
  const { rows, total } = getAdminCoursesPage();

  return <CoursesClient rows={rows} total={total} />;
}
