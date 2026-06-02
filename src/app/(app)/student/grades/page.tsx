import { getStudentGradesWithHistory } from "@/fake-db/dashboards";
import { GradesClient } from "@/components/student/grades-client/grades-client";

export default function StudentGradesPage() {
  const semesterGrades = getStudentGradesWithHistory();

  return <GradesClient semesterGrades={semesterGrades} />;
}
