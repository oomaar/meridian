"use client";

import { useState } from "react";
import { UsersClientHeader } from "./components/users-client-header";
import { UsersClientRoleSummaryGrid } from "./components/users-client-role-summary-grid/users-client-role-summary-grid";
import { UsersClientTable } from "./components/users-client-table/users-client-table";
import type { AdminUserRow, AdminUsersData } from "@/fake-db/dashboards";

export const Users_Client_PAGE_SIZE = 15;

type UsersClientProps = { data: AdminUsersData };

export function UsersClient({ data }: UsersClientProps) {
  const [rows, setRows] = useState<AdminUserRow[]>(data.rows);

  function handleAdd(row: AdminUserRow) {
    setRows((prev) => [row, ...prev]);
  }

  return (
    <>
      <UsersClientHeader data={data} handleAdd={handleAdd} />
      <div className="m-page__body">
        <div className="m-stack">
          <UsersClientRoleSummaryGrid data={data} />
          <UsersClientTable data={data} rows={rows} setRows={setRows} />
        </div>
      </div>
    </>
  );
}
