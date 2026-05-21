import { getAdminActivityPage } from "@/fake-db/dashboards";
import { ActivityClient } from "@/components/admin/activity-client";

export default function AdminActivityPage() {
  const { events } = getAdminActivityPage();
  return <ActivityClient events={events} />;
}
