import type { AdminUserRow } from "@/fake-db/dashboards";
import { UsersClientTableAvatar } from "./users-client-table-avatar";
import { UsersClientTableMfaBadge } from "./users-client-table-mfa-badge";
import { UsersClientTableRowMenu } from "./users-client-table-row-menu";
import { UsersClientTableUserStatusBadge } from "./users-client-table-user-status-badge";
import { Dispatch, SetStateAction } from "react";

type UsersClientTableRowsProps = {
  visibleRows: AdminUserRow[];
  setRows: Dispatch<SetStateAction<AdminUserRow[]>>;
};

export function UsersClientTableRows({
  visibleRows,
  setRows,
}: UsersClientTableRowsProps) {
  return (
    <tbody>
      {visibleRows.map((u) => (
        <tr key={u.id}>
          <td>
            <UsersClientTableAvatar name={u.fullName} size="sm" />
          </td>
          <td className="m-fw-500">{u.fullName}</td>
          <td className="m-mono m-td-dim">{u.email}</td>
          <td>
            <span
              className="m-role-pill"
              style={
                {
                  "--role-color": u.roleColor,
                } as React.CSSProperties
              }
            >
              <span className="m-role-pill__dot" />
              {u.roleLabel}
            </span>
          </td>
          <td>
            <UsersClientTableMfaBadge mfa={u.mfa} />
          </td>
          <td className="m-mono m-text-3">{u.lastLogin}</td>
          <td>
            <UsersClientTableUserStatusBadge status={u.status} />
          </td>
          <td onClick={(e) => e.stopPropagation()}>
            <UsersClientTableRowMenu
              onDelete={() =>
                setRows((prev) => prev.filter((r) => r.id !== u.id))
              }
            />
          </td>
        </tr>
      ))}
      {visibleRows.length === 0 && (
        <tr>
          <td colSpan={8} className="m-table-empty">
            No users match the current filters.
          </td>
        </tr>
      )}
    </tbody>
  );
}
