import type { AdminUserRow, AdminUsersData } from "@/fake-db/dashboards";
import { InviteUserSheet } from "../sheets/invite-user-sheet/invite-user-sheet";
import { PermissionsMatrixSheet } from "../sheets/permissions-matrix-sheet/permissions-matrix-sheet";

type UsersClientHeaderProps = {
  data: AdminUsersData;
  handleAdd(row: AdminUserRow): void;
};

export function UsersClientHeader({ data, handleAdd }: UsersClientHeaderProps) {
  return (
    <div className="m-page__header">
      <div className="m-page__title">
        <span className="m-page__eyebrow">Administration</span>
        <h1 className="m-page__h">Users &amp; roles</h1>
        <p className="m-page__sub">
          {data.total.toLocaleString()} accounts · 6 role tiers · access
          governed by departmental scopes.
        </p>
      </div>
      <div className="m-page__actions">
        <PermissionsMatrixSheet />
        <InviteUserSheet onAdd={handleAdd} />
      </div>
    </div>
  );
}
