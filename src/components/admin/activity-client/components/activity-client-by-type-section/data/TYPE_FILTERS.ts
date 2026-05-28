import type { ActivityType } from "@/fake-db/types/activity";
import type { FilterId } from "../../../types/FilterId";

export const TYPE_FILTERS: {
  id: FilterId;
  label: string;
  types: ActivityType[] | null;
}[] = [
  { id: "all", label: "All events", types: null },
  { id: "submission", label: "Submissions", types: ["assignment_submitted"] },
  {
    id: "grade",
    label: "Grades",
    types: ["assignment_graded", "grade_posted"],
  },
  {
    id: "enrollment",
    label: "Enrollment",
    types: ["course_enrolled", "course_dropped", "roster_imported"],
  },
  {
    id: "announce",
    label: "Announcements",
    types: [
      "instructor_announcement",
      "policy_published",
      "deadline_approaching",
    ],
  },
  {
    id: "system",
    label: "System",
    types: ["semester_published", "user_invited", "comment_added"],
  },
];
