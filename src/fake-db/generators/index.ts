import {
  getActivityForCourse,
  getActivityForInstructor,
  getActivityForStudent,
  getNotificationsForUser,
} from "../relationships";
import type { Activity, Notification } from "../types";
import { db } from "../universe";

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
