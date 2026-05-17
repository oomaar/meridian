export type Role = "admin" | "instructor" | "student";

export type Persona = {
  role: Role;
  fullName: string;
  initials: string;
  roleTitle: string;
  homeHref: string;
  fakeDbId: string;
};

export const PERSONAS: Record<Role, Persona> = {
  admin: {
    role: "admin",
    fullName: "Ines Halvorsen",
    initials: "IH",
    roleTitle: "Registrar",
    homeHref: "/admin/overview",
    fakeDbId: "user-001",
  },
  instructor: {
    role: "instructor",
    fullName: "Linnea Ahmadi",
    initials: "LA",
    roleTitle: "Associate Professor, CS",
    homeHref: "/instructor/dashboard",
    fakeDbId: "inst-001",
  },
  student: {
    role: "student",
    fullName: "Aarav Patel",
    initials: "AP",
    roleTitle: "B.S. Computer Science",
    homeHref: "/student/dashboard",
    fakeDbId: "stu-00001",
  },
};

export const ROLE_ORDER: Role[] = ["admin", "instructor", "student"];

export function roleFromPath(pathname: string): Role {
  if (pathname.startsWith("/instructor")) return "instructor";
  if (pathname.startsWith("/student")) return "student";
  return "admin";
}

export function personaFromPath(pathname: string): Persona {
  return PERSONAS[roleFromPath(pathname)];
}
