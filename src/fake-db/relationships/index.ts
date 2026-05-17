import type {
  Activity,
  Assignment,
  Course,
  Department,
  Instructor,
  Notification,
  Program,
  Semester,
  Student,
  User,
} from "../types";
import { db } from "../universe";

function groupBy<T, K>(items: T[], key: (t: T) => K | undefined): Map<K, T[]> {
  const m = new Map<K, T[]>();
  for (const it of items) {
    const k = key(it);
    if (k === undefined) continue;
    const arr = m.get(k) ?? [];
    arr.push(it);
    m.set(k, arr);
  }
  return m;
}

const studentById = new Map(db.students.map((s) => [s.id, s]));
const instructorById = new Map(db.instructors.map((i) => [i.id, i]));
const courseById = new Map(db.courses.map((c) => [c.id, c]));
const courseByCode = new Map(db.courses.map((c) => [c.code, c]));
const assignmentById = new Map(db.assignments.map((a) => [a.id, a]));
const semesterById = new Map(db.semesters.map((s) => [s.id, s]));
const departmentById = new Map(db.departments.map((d) => [d.id, d]));
const programById = new Map(db.programs.map((p) => [p.id, p]));
const userById = new Map(db.users.map((u) => [u.id, u]));
const assignmentsByCourse = groupBy(db.assignments, (a) => a.courseId);
const coursesByInstructor = groupBy(db.courses, (c) => c.instructorId);
const coursesBySemester = groupBy(db.courses, (c) => c.semesterId);
const coursesByDepartment = groupBy(db.courses, (c) => c.departmentId);
const activityByCourse = groupBy(db.activity, (a) => a.courseId);
const activityByStudent = groupBy(db.activity, (a) => a.studentId);
const activityByInstructor = groupBy(db.activity, (a) => a.instructorId);
const notificationsByUser = groupBy(db.notifications, (n) => n.recipientUserId);

export function getStudent(id: string): Student | undefined {
  return studentById.get(id);
}
export function getInstructor(id: string): Instructor | undefined {
  return instructorById.get(id);
}
export function getCourse(id: string): Course | undefined {
  return courseById.get(id);
}
export function getCourseByCode(code: string): Course | undefined {
  return courseByCode.get(code);
}
export function getAssignment(id: string): Assignment | undefined {
  return assignmentById.get(id);
}
export function getSemester(id: string): Semester | undefined {
  return semesterById.get(id);
}
export function getDepartment(id: string): Department | undefined {
  return departmentById.get(id);
}
export function getProgram(id: string): Program | undefined {
  return programById.get(id);
}
export function getUser(id: string): User | undefined {
  return userById.get(id);
}

export function getStudentsForCourse(courseId: string): Student[] {
  const course = courseById.get(courseId);
  if (!course) return [];
  const out: Student[] = [];
  for (const sid of course.studentIds) {
    const s = studentById.get(sid);
    if (s) out.push(s);
  }
  return out;
}

export function getCoursesForStudent(studentId: string): Course[] {
  const stu = studentById.get(studentId);
  if (!stu) return [];
  const out: Course[] = [];
  for (const cid of stu.enrolledCourseIds) {
    const c = courseById.get(cid);
    if (c) out.push(c);
  }
  return out;
}

export function getCoursesForInstructor(instructorId: string): Course[] {
  return coursesByInstructor.get(instructorId) ?? [];
}
export function getCoursesForSemester(semesterId: string): Course[] {
  return coursesBySemester.get(semesterId) ?? [];
}
export function getCoursesForDepartment(deptId: string): Course[] {
  return coursesByDepartment.get(deptId) ?? [];
}
export function getAssignmentsForCourse(courseId: string): Assignment[] {
  return assignmentsByCourse.get(courseId) ?? [];
}
export function getActivityForCourse(courseId: string): Activity[] {
  return activityByCourse.get(courseId) ?? [];
}
export function getActivityForStudent(studentId: string): Activity[] {
  return activityByStudent.get(studentId) ?? [];
}
export function getActivityForInstructor(instructorId: string): Activity[] {
  return activityByInstructor.get(instructorId) ?? [];
}
export function getNotificationsForUser(userId: string): Notification[] {
  return notificationsByUser.get(userId) ?? [];
}

export function getActiveSemester(): Semester | undefined {
  return db.semesters.find((s) => s.status === "active");
}
