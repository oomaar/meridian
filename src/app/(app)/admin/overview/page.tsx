import { getAdminOverview } from "@/fake-db/dashboards";
import { OverviewClient } from "@/components/admin/overview-client/overview-client";

export default function AdminOverviewPage() {
  const data = getAdminOverview();

  return <OverviewClient data={data} />;
}
