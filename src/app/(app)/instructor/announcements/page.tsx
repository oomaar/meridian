import { getInstructorAnnouncementsData } from "@/fake-db/dashboards";
import { AnnouncementsClient } from "@/components/instructor/announcements-client/announcements-client";

export default function InstructorAnnouncementsPage() {
  const data = getInstructorAnnouncementsData();
  if (!data) return <p>No data.</p>;
  return <AnnouncementsClient data={data} />;
}
