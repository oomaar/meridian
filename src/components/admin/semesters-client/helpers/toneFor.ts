import type { SemesterStatus } from "@/fake-db";

export function toneFor(status: SemesterStatus) {
  if (status === "active") return "accent";
  if (status === "upcoming") return "info";
  if (status === "planning") return "planning";

  return "muted";
}
