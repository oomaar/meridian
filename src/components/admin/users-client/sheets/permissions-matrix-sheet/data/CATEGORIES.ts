import type { PermissionCategory } from "../types/PermissionCategory";

export const CATEGORIES: PermissionCategory[] = [
  { id: "system", label: "System config" },
  { id: "users", label: "User management" },
  { id: "students", label: "Student records" },
  { id: "courses", label: "Course catalog" },
  { id: "grades", label: "Grades & transcripts" },
  { id: "financial", label: "Financial" },
  { id: "reporting", label: "Reporting" },
  { id: "support", label: "Platform support" },
];
