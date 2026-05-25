import type { InviteUserRoleOption } from "../types/InviteUserRoleOption";

export const INVITE_USER_ROLES: InviteUserRoleOption[] = [
  { id: "admin", label: "Administrator", color: "var(--m-danger)" },
  { id: "registrar", label: "Registrar", color: "var(--m-accent)" },
  { id: "admissions", label: "Admissions", color: "var(--m-warning)" },
  { id: "it", label: "IT Staff", color: "var(--m-info)" },
  { id: "dean", label: "Dean & Chair", color: "var(--m-warning)" },
];
