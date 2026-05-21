import { getAdminUsersPage } from "@/fake-db/dashboards";
import { UsersClient } from "@/components/admin/users-client";

export default function AdminUsersPage() {
  const data = getAdminUsersPage();
  return <UsersClient data={data} />;
}
