import { getStudentCourseDetail } from "@/fake-db/dashboards";
import { StudentCourseDetailClient } from "@/components/student/course-detail-client/course-detail-client";

type StudentCourseDetailPageProps = {
  params: Promise<{ code: string }>;
};

export default async function StudentCourseDetailPage({
  params,
}: StudentCourseDetailPageProps) {
  const { code } = await params;
  const data = getStudentCourseDetail(decodeURIComponent(code));

  if (!data) return <p>Course not found.</p>;

  return <StudentCourseDetailClient data={data} />;
}
