import { getInstructorRosterData } from "@/fake-db/dashboards";
import { RosterClient } from "@/components/instructor/roster-client/roster-client";

export default function InstructorRosterPage() {
  const data = getInstructorRosterData();
  if (!data) return <p>No roster data.</p>;
  return <RosterClient data={data} />;
}
