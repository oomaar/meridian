import { getAdminNotificationsPage } from "@/fake-db/dashboards";
import { NotificationsClient } from "@/components/admin/notifications-client/notifications-client";

export default function AdminNotificationsPage() {
  const { notifications } = getAdminNotificationsPage();

  return <NotificationsClient notifications={notifications} />;
}
