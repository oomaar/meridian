import { getAdminSemestersPage } from "@/fake-db/dashboards";
import { SemestersClient } from "@/components/admin/semesters-client/semesters-client";

export default function AdminSemestersPage() {
  const data = getAdminSemestersPage();

  return <SemestersClient data={data} />;
}
