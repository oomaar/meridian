import { getInstructorOverview } from "@/fake-db/dashboards";
import { OverviewClient } from "@/components/instructor/overview-client/overview-client";

export default function InstructorDashboardPage() {
  const data = getInstructorOverview();
  if (!data) return <p>No instructor data.</p>;
  return <OverviewClient data={data} />;
}
