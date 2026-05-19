import "server-only";

import { buildActivity } from "./activity";
import { buildAssignments } from "./assignments";
import { buildCourses } from "./courses";
import { buildInstructors } from "./instructors";
import { DEPARTMENTS, PROGRAMS, TENANT } from "./lookups";
import { buildNotifications } from "./notifications";
import { SCALE } from "./seed";
import { buildSemesters } from "./semesters";
import { buildStudents } from "./students";
import type { Universe } from "./types";
import { buildUsers } from "./users";

function build(): Universe {
  const semesters = buildSemesters();
  const users = buildUsers(SCALE.users);
  const instructors = buildInstructors(SCALE.instructors);
  const students = buildStudents(SCALE.students);
  const courses = buildCourses({
    count: SCALE.courses,
    semesters,
    departments: DEPARTMENTS,
    instructors,
    students,
  });
  const assignments = buildAssignments({ courses, semesters });
  const activity = buildActivity({
    count: SCALE.activity,
    students,
    instructors,
    courses,
    assignments,
    users,
  });
  const notifications = buildNotifications({
    count: SCALE.notifications,
    users,
  });

  return {
    tenant: TENANT,
    semesters,
    departments: DEPARTMENTS,
    programs: PROGRAMS,
    instructors,
    students,
    courses,
    assignments,
    activity,
    notifications,
    users,
  };
}

export const db: Universe = build();
