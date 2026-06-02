import { getInstructorNotifications } from "@/fake-db/dashboards";
import { RoleNotificationsClient } from "@/components/shared/notifications-client/role-notifications-client";

export default function InstructorNotificationsPage() {
  const notifications = getInstructorNotifications();
  return <RoleNotificationsClient notifications={notifications} role="instructor" />;
}
