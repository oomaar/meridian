import { UsersClient } from "@/components/admin/users-client/users-client";
import { getAdminUsersPage } from "@/fake-db/dashboards";

export default function AdminUsersPage() {
  const data = getAdminUsersPage();

  return <UsersClient data={data} />;
}
