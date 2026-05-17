export type UserRole = "admin" | "registrar" | "admissions" | "it" | "dean";

export type UserStatus = "active" | "invited" | "suspended";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string | null;
  mfa: boolean;
};
