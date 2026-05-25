import type { InstructorStatus } from "@/fake-db";

export const STATUS_OPTIONS: { value: InstructorStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "leave", label: "On leave" },
  { value: "retired", label: "Retired" },
];
