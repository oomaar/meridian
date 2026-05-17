export default async function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <h1>Course: {code}</h1>;
}
