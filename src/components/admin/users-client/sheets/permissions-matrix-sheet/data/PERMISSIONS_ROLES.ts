import type { PermissionRole } from "../types/PermissionRole";

export const PERMISSIONS_ROLES: PermissionRole[] = [
  { id: "admin", label: "Admin", color: "var(--m-danger)" },
  { id: "registrar", label: "Registrar", color: "var(--m-accent)" },
  { id: "dean", label: "Dean", color: "var(--m-warning)" },
  { id: "faculty", label: "Faculty", color: "var(--m-info)" },
  { id: "ta", label: "TA", color: "var(--m-success)" },
  { id: "student", label: "Student", color: "var(--m-text-2)" },
];
