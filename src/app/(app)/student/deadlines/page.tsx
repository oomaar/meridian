import { getStudentDeadlines } from "@/fake-db/dashboards";
import { DeadlinesClient } from "@/components/student/deadlines-client/deadlines-client";

export default function StudentDeadlinesPage() {
  const deadlines = getStudentDeadlines();

  return <DeadlinesClient deadlines={deadlines} />;
}
