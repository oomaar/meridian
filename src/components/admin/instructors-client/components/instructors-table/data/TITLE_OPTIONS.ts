import type { InstructorTitle } from "@/fake-db";

export const TITLE_OPTIONS: { value: InstructorTitle; label: string }[] = [
  { value: "Professor", label: "Professor" },
  { value: "Associate Professor", label: "Assoc. Professor" },
  { value: "Assistant Professor", label: "Asst. Professor" },
  { value: "Lecturer", label: "Lecturer" },
  { value: "Adjunct", label: "Adjunct" },
];
