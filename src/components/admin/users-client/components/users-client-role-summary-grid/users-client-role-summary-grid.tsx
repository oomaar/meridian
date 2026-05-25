import type { AdminUsersData } from "@/fake-db/dashboards";
import { UsersClientRoleSummaryCard } from "./users-client-role-summary-card";

type UsersClientRoleSummaryGridProps = { data: AdminUsersData };

export function UsersClientRoleSummaryGrid({
  data,
}: UsersClientRoleSummaryGridProps) {
  return (
    <div className="m-grid m-grid-3">
      {data.roleSummaries.map((card) => (
        <UsersClientRoleSummaryCard key={card.id} card={card} />
      ))}
    </div>
  );
}
