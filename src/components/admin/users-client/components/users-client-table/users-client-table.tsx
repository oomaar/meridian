"use client";

import type { AdminUserRow, AdminUsersData } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction, useState } from "react";
import { Users_Client_PAGE_SIZE } from "../../users-client";
import { UsersClientTableHeader } from "./users-client-table-header/users-client-table-header";
import type { UsersClientTableFilters } from "./types/UsersClientTableFilters";
import { UsersClientTableRows } from "./users-client-table-rows/users-client-table-rows";

type UsersClientTableProps = {
  data: AdminUsersData;
  rows: AdminUserRow[];
  setRows: Dispatch<SetStateAction<AdminUserRow[]>>;
};

export function UsersClientTable({
  data,
  rows,
  setRows,
}: UsersClientTableProps) {
  const [visible, setVisible] = useState(Users_Client_PAGE_SIZE);

  const [filters, setFilters] = useState<UsersClientTableFilters>({
    role: "all",
    status: "all",
    search: "",
  });

  const filtered = rows.filter((r) => {
    if (filters.role !== "all" && r.roleId !== filters.role) return false;

    if (filters.status !== "all" && r.status !== filters.status) return false;

    if (filters.search) {
      const searchQuery = filters.search.toLowerCase();

      if (
        !r.fullName.toLowerCase().startsWith(searchQuery) &&
        !r.email.toLowerCase().startsWith(searchQuery)
      )
        return false;
    }

    return true;
  });

  const visibleRows = filtered.slice(0, visible);

  return (
    <div className="m-card">
      <UsersClientTableHeader
        filters={filters}
        setFilters={setFilters}
        data={data}
        setVisible={setVisible}
      />
      <div className="m-card__body--flush">
        <table className="m-table">
          <thead>
            <tr>
              <th className="w-9" />
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>MFA</th>
              <th>Last login</th>
              <th>Status</th>
              <th className="w-8" />
            </tr>
          </thead>
          <UsersClientTableRows visibleRows={visibleRows} setRows={setRows} />
        </table>
        {visible < filtered.length && (
          <div className="border-t border-solid border-m-line px-4.5 py-3">
            <button
              className="m-btn m-btn--ghost w-full justify-center"
              onClick={() => setVisible((v) => v + Users_Client_PAGE_SIZE)}
            >
              Load more ({filtered.length - visible} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
