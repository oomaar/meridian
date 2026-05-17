import type { Activity } from "./activity";
import type { Assignment } from "./assignments";
import type { Course } from "./courses";
import type { Department } from "./departments";
import type { Instructor } from "./instructors";
import type { Notification } from "./notifications";
import type { Program } from "./programs";
import type { Semester } from "./semesters";
import type { Student } from "./students";
import type { Tenant } from "./tenant";
import type { User } from "./users";

export type Universe = {
  tenant: Tenant;
  semesters: Semester[];
  departments: Department[];
  programs: Program[];
  instructors: Instructor[];
  students: Student[];
  courses: Course[];
  assignments: Assignment[];
  activity: Activity[];
  notifications: Notification[];
  users: User[];
};
