import { getStudentDashboard } from "@/fake-db/dashboards";
import { StudentDashboardClient } from "@/components/student/dashboard-client/dashboard-client";

export default function StudentDashboardPage() {
  const data = getStudentDashboard();

  if (!data) return null;

  return <StudentDashboardClient data={data} />;
}
