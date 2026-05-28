import { UsersClientTableFiltersStatusFilter } from "../types/UsersClientTableFiltersStatusFilter";

export const STATUS_OPTIONS: {
  value: UsersClientTableFiltersStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "suspended", label: "Suspended" },
];
