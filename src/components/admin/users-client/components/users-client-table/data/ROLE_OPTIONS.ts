import { UsersClientTableFiltersRoleFilter } from "../types/UsersClientTableFiltersRoleFilter";

export const ROLE_OPTIONS: {
  value: UsersClientTableFiltersRoleFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "admin", label: "Administrator" },
  { value: "registrar", label: "Registrar" },
  { value: "admissions", label: "Admissions" },
  { value: "it", label: "IT Staff" },
  { value: "dean", label: "Dean & Chair" },
  { value: "faculty", label: "Faculty" },
  { value: "ta", label: "Teaching Asst." },
  { value: "student", label: "Student" },
];
