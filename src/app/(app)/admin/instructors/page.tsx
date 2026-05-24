import { getAdminInstructorsPage } from "@/fake-db/dashboards";
import { InstructorsClient } from "@/components/admin/instructors-client/instructors-client";

export default function AdminInstructorsPage() {
  const { rows, total } = getAdminInstructorsPage();

  return <InstructorsClient rows={rows} total={total} />;
}
