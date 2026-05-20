import {
  type DepartmentLoad,
  type EnrollmentTrend,
  type SemesterAnalytics,
  generateDepartmentLoad,
  generateEnrollmentTrend,
  generateSemesterAnalytics,
} from "../analytics";
import {
  generateRecentActivity,
  generateRecentActivityForInstructor,
  generateRecentActivityForStudent,
  generateSubmissionThroughput,
  generateSubmissionsLast7d,
  generateUpcomingDeadlines,
  type SubmissionThroughputPoint,
} from "../generators";
import {
  getActiveSemester,
  getCoursesForInstructor,
  getCoursesForStudent,
  getInstructor,
  getStudent,
} from "../relationships";
import type {
  Activity,
  Assignment,
  Course,
  Instructor,
  Semester,
  Student,
} from "../types";
import { db } from "../universe";

export type AdminOverviewData = {
  activeSemester: Semester | undefined;
  analytics: SemesterAnalytics | null;
  enrollmentTrend: EnrollmentTrend;
  departmentLoad: DepartmentLoad;
  recentActivity: Activity[];
  submissionThroughput: SubmissionThroughputPoint[];
  submissionsLast7d: number;
  totals: {
    students: number;
    instructors: number;
    courses: number;
    activeCourses: number;
  };
};

export function getAdminOverview(): AdminOverviewData {
  const sem = getActiveSemester();
  return {
    activeSemester: sem,
    analytics: sem ? generateSemesterAnalytics(sem.id) : null,
    enrollmentTrend: generateEnrollmentTrend(),
    departmentLoad: generateDepartmentLoad(),
    recentActivity: generateRecentActivity(12),
    submissionThroughput: generateSubmissionThroughput(12),
    submissionsLast7d: generateSubmissionsLast7d(),
    totals: {
      students: db.students.length,
      instructors: db.instructors.length,
      courses: db.courses.length,
      activeCourses: db.courses.filter((c) => c.status === "active").length,
    },
  };
}

export type StudentDashboardData = {
  student: Student;
  enrolledCourses: Course[];
  upcomingDeadlines: ReturnType<typeof generateUpcomingDeadlines>;
  recentActivity: Activity[];
};

export function getStudentDashboard(
  studentId: string
): StudentDashboardData | null {
  const student = getStudent(studentId);
  if (!student) return null;
  return {
    student,
    enrolledCourses: getCoursesForStudent(studentId),
    upcomingDeadlines: generateUpcomingDeadlines(studentId, 8),
    recentActivity: generateRecentActivityForStudent(studentId, 10),
  };
}

export type InstructorDashboardData = {
  instructor: Instructor;
  teachingCourses: Course[];
  gradingQueue: Assignment[];
  recentActivity: Activity[];
};

export function getInstructorDashboard(
  instructorId: string
): InstructorDashboardData | null {
  const instructor = getInstructor(instructorId);
  if (!instructor) return null;
  const courses = getCoursesForInstructor(instructorId);
  const courseIds = new Set(courses.map((c) => c.id));
  const gradingQueue = db.assignments
    .filter((a) => courseIds.has(a.courseId) && a.status === "grading")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return {
    instructor,
    teachingCourses: courses,
    gradingQueue,
    recentActivity: generateRecentActivityForInstructor(instructorId, 10),
  };
}
