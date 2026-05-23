import { notFound } from "next/navigation";
import { getAdminCourseDetail } from "@/fake-db/dashboards";
import { CourseDetailClient } from "@/components/admin/course-detail-client/course-detail-client";

type AdminCourseDetailPageParams = {
  params: Promise<{ code: string }>;
};

export default async function AdminCourseDetailPage({
  params,
}: AdminCourseDetailPageParams) {
  const { code } = await params;

  const data = getAdminCourseDetail(code);

  if (!data) notFound();

  return <CourseDetailClient data={data} />;
}
