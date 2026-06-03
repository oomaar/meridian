import { getInstructorGradingData } from "@/fake-db/dashboards";
import { GradingClient } from "@/components/instructor/grading-client/grading-client";

export default function InstructorGradingPage() {
  const data = getInstructorGradingData();
  if (!data || !data.queue.length) return <p>No grading data.</p>;
  return <GradingClient data={data} />;
}
