import { getStudentNotifications } from "@/fake-db/dashboards";
import { RoleNotificationsClient } from "@/components/shared/notifications-client/role-notifications-client";

export default function StudentNotificationsPage() {
  const notifications = getStudentNotifications();
  return <RoleNotificationsClient notifications={notifications} role="student" />;
}
