import { notFound } from "next/navigation";
import { getAdminCourseDetail } from "@/fake-db/dashboards";
import { CourseDetailClient } from "@/components/admin/course-detail-client";

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const data = getAdminCourseDetail(code);
  if (!data) notFound();
  return <CourseDetailClient data={data} />;
}
