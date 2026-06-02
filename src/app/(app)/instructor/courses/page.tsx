import { getInstructorCoursesPageData } from "@/fake-db/dashboards";
import { CoursesClient } from "@/components/instructor/courses-client/courses-client";

export default function InstructorCoursesPage() {
  const data = getInstructorCoursesPageData();
  if (!data) return <p>No instructor data.</p>;
  return <CoursesClient data={data} />;
}
