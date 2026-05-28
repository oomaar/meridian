import type { PrmissionsAccess } from "../types/PrmissionsAccess";

type T_Matrix = Record<string, Record<string, PrmissionsAccess>>;

export const MATRIX: T_Matrix = {
  system: {
    admin: "full",
    registrar: "none",
    dean: "none",
    faculty: "none",
    ta: "none",
    student: "none",
  },
  users: {
    admin: "full",
    registrar: "read",
    dean: "read",
    faculty: "none",
    ta: "none",
    student: "none",
  },
  students: {
    admin: "full",
    registrar: "full",
    dean: "read",
    faculty: "read",
    ta: "read",
    student: "read",
  },
  courses: {
    admin: "full",
    registrar: "full",
    dean: "full",
    faculty: "full",
    ta: "read",
    student: "read",
  },
  grades: {
    admin: "full",
    registrar: "full",
    dean: "read",
    faculty: "full",
    ta: "read",
    student: "read",
  },
  financial: {
    admin: "full",
    registrar: "read",
    dean: "none",
    faculty: "none",
    ta: "none",
    student: "read",
  },
  reporting: {
    admin: "full",
    registrar: "full",
    dean: "full",
    faculty: "read",
    ta: "none",
    student: "none",
  },
  support: {
    admin: "full",
    registrar: "read",
    dean: "read",
    faculty: "read",
    ta: "read",
    student: "read",
  },
};
