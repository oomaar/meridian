import type { Semester } from "../types";

export function buildSemesters(): Semester[] {
  return [
    {
      id: "sem-fall-2024",
      code: "FA24",
      name: "Fall 2024",
      startDate: "2024-08-26",
      endDate: "2024-12-18",
      status: "past",
    },
    {
      id: "sem-spring-2025",
      code: "SP25",
      name: "Spring 2025",
      startDate: "2025-01-13",
      endDate: "2025-05-22",
      status: "past",
    },
    {
      id: "sem-fall-2025",
      code: "FA25",
      name: "Fall 2025",
      startDate: "2025-08-25",
      endDate: "2025-12-19",
      status: "past",
    },
    {
      id: "sem-spring-2026",
      code: "SP26",
      name: "Spring 2026",
      startDate: "2026-01-12",
      endDate: "2026-05-22",
      status: "active",
    },
    {
      id: "sem-fall-2026",
      code: "FA26",
      name: "Fall 2026",
      startDate: "2026-08-24",
      endDate: "2026-12-18",
      status: "upcoming",
    },
    {
      id: "sem-spring-2027",
      code: "SP27",
      name: "Spring 2027",
      startDate: "2027-01-11",
      endDate: "2027-05-21",
      status: "planning",
    },
  ];
}
