import type { AdminUsersData } from "@/fake-db/dashboards";
import { Users_Client_PAGE_SIZE } from "../../../users-client";
import { UsersClientTableFilterMenu } from "./users-client-table-filter-menu";
import { Dispatch, SetStateAction } from "react";
import type { UsersClientTableFilters } from "../types/UsersClientTableFilters";
import type { UsersClientTableFiltersStatusFilter } from "../types/UsersClientTableFiltersStatusFilter";
import type { UsersClientTableFiltersRoleFilter } from "../types/UsersClientTableFiltersRoleFilter";
import { STATUS_OPTIONS } from "../data/STATUS_OPTIONS";
import { ROLE_OPTIONS } from "../data/ROLE_OPTIONS";

type UsersClientTableHeaderProps = {
  data: AdminUsersData;
  filters: UsersClientTableFilters;
  setFilters: Dispatch<SetStateAction<UsersClientTableFilters>>;
  setVisible: Dispatch<SetStateAction<number>>;
};

export function UsersClientTableHeader({
  data,
  setVisible,
  filters,
  setFilters,
}: UsersClientTableHeaderProps) {
  function resetPage() {
    setVisible(Users_Client_PAGE_SIZE);
  }

  function handleSearchChange(search: string) {
    setFilters((prev) => ({
      ...prev,
      search,
    }));
  }

  function handleRoleChange(role: UsersClientTableFiltersRoleFilter) {
    setFilters((prev) => ({
      ...prev,
      role,
    }));
  }

  function handleStatusChange(status: UsersClientTableFiltersStatusFilter) {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  }

  return (
    <div className="m-card__head">
      <div>
        <div className="m-card__title">All users</div>
        <div className="m-card__sub">
          system accounts · {data.total.toLocaleString()} total
        </div>
      </div>
      <div className="m-spacer" />
      <div className="m-card-filters">
        <input
          className="m-field__input m-users-search"
          placeholder="Search name or email…"
          value={filters.search}
          onChange={(e) => {
            handleSearchChange(e.target.value);
            setVisible(Users_Client_PAGE_SIZE);
          }}
        />
        <UsersClientTableFilterMenu
          label="Role"
          value={filters.role}
          options={ROLE_OPTIONS}
          onChange={(v) => {
            handleRoleChange(v);
            resetPage();
          }}
        />
        <UsersClientTableFilterMenu
          label="Status"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(v) => {
            handleStatusChange(v);
            resetPage();
          }}
        />
      </div>
    </div>
  );
}
