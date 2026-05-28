import type { UsersClientTableFiltersRoleFilter } from "./UsersClientTableFiltersRoleFilter";
import type { UsersClientTableFiltersStatusFilter } from "./UsersClientTableFiltersStatusFilter";

export type UsersClientTableFilters = {
  role: UsersClientTableFiltersRoleFilter;
  status: UsersClientTableFiltersStatusFilter;
  search: string;
};
