import { getStudentCoursesPage } from "@/fake-db/dashboards";
import { StudentCoursesClient } from "@/components/student/courses-client/courses-client";

export default function StudentCoursesPage() {
  const data = getStudentCoursesPage();
  if (!data) return null;
  return <StudentCoursesClient data={data} />;
}
