import {
  getActivityForCourse,
  getActivityForInstructor,
  getActivityForStudent,
  getAssignmentsForCourse,
  getCoursesForInstructor,
  getNotificationsForUser,
  getStudent,
} from "../relationships";
import { NOW } from "../seed";
import type {
  Activity,
  Assignment,
  Course,
  Notification,
  Student,
} from "../types";
import { db } from "../universe";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

export function generateRecentActivity(limit = 12): Activity[] {
  return db.activity.slice(0, limit);
}

export function generateRecentActivityForCourse(
  courseId: string,
  limit = 12
): Activity[] {
  return getActivityForCourse(courseId).slice(0, limit);
}

export function generateRecentActivityForStudent(
  studentId: string,
  limit = 12
): Activity[] {
  return getActivityForStudent(studentId).slice(0, limit);
}

export function generateRecentActivityForInstructor(
  instructorId: string,
  limit = 12
): Activity[] {
  return getActivityForInstructor(instructorId).slice(0, limit);
}

export function generateUnreadNotifications(
  userId: string,
  limit = 10
): Notification[] {
  return getNotificationsForUser(userId)
    .filter((n) => !n.read)
    .slice(0, limit);
}

export function generateUnreadCount(userId: string): number {
  return getNotificationsForUser(userId).filter((n) => !n.read).length;
}

export function generateSubmissionsLast7d(): number {
  const cutoff = NOW.getTime() - 7 * DAY_MS;
  let count = 0;
  for (const a of db.activity) {
    if (a.type !== "assignment_submitted") continue;
    if (new Date(a.timestamp).getTime() < cutoff) continue;
    count++;
  }
  return count;
}

export type SubmissionThroughputPoint = { l: string; v: number };

export function generateSubmissionThroughput(
  weeks = 12
): SubmissionThroughputPoint[] {
  const buckets = new Array<number>(weeks).fill(0);
  const periodStart = NOW.getTime() - weeks * WEEK_MS;
  for (const a of db.assignments) {
    const dueMs = new Date(a.dueDate).getTime();
    if (dueMs < periodStart || dueMs > NOW.getTime()) continue;
    const w = Math.min(
      weeks - 1,
      Math.floor((dueMs - periodStart) / WEEK_MS)
    );
    buckets[w] += a.submissionCount;
  }
  return buckets.map((v, i) => ({ l: `w${i + 1}`, v }));
}

export type SampleSubmission = {
  course: Course;
  assignment: Assignment;
  student: Student;
};

function pickSubmissionFor(instructorId: string): SampleSubmission | null {
  const courses = getCoursesForInstructor(instructorId);
  const course = courses.find(
    (c) => c.status === "active" && c.studentIds.length > 0
  );
  if (!course) return null;
  const assignments = getAssignmentsForCourse(course.id);
  const assignment =
    assignments.find((a) => a.status === "grading") ??
    assignments.find((a) => a.status === "graded") ??
    assignments[0];
  if (!assignment) return null;
  const student = getStudent(course.studentIds[0]);
  if (!student) return null;
  return { course, assignment, student };
}

export function generateSampleSubmission(
  instructorIdHint?: string
): SampleSubmission | null {
  if (instructorIdHint) {
    const hit = pickSubmissionFor(instructorIdHint);
    if (hit) return hit;
  }
  // Fallback: scan instructors who actually teach active courses.
  for (const inst of db.instructors) {
    if (inst.courseIds.length === 0) continue;
    const hit = pickSubmissionFor(inst.id);
    if (hit) return hit;
  }
  return null;
}

export function generateUpcomingDeadlines(
  studentId: string | undefined,
  limit = 8
): Array<{
  assignmentId: string;
  courseId: string;
  courseCode: string;
  title: string;
  dueDate: string;
}> {
  const studentCourseIds = studentId
    ? new Set(
        db.students.find((s) => s.id === studentId)?.enrolledCourseIds ?? []
      )
    : null;

  const candidates = db.assignments.filter((a) => {
    if (a.status !== "open") return false;
    if (studentCourseIds && !studentCourseIds.has(a.courseId)) return false;
    return true;
  });

  candidates.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const courseById = new Map(db.courses.map((c) => [c.id, c]));
  return candidates.slice(0, limit).map((a) => {
    const course = courseById.get(a.courseId);
    return {
      assignmentId: a.id,
      courseId: a.courseId,
      courseCode: course?.code ?? a.courseId,
      title: a.title,
      dueDate: a.dueDate,
    };
  });
}
