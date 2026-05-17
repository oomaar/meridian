import {
  getActiveSemester,
  getAssignmentsForCourse,
  getCourse,
  getCoursesForSemester,
} from "../relationships";
import type { Course } from "../types";
import { db } from "../universe";

export type SemesterAnalytics = {
  semesterId: string;
  totalCourses: number;
  activeCourses: number;
  totalEnrollment: number;
  totalInstructors: number;
  averageClassSize: number;
  fillRate: number;
  assignmentsCount: number;
  openAssignmentsCount: number;
};

export function generateSemesterAnalytics(
  semesterId: string
): SemesterAnalytics {
  const courses = getCoursesForSemester(semesterId);
  const totalEnrollment = courses.reduce(
    (sum, c) => sum + c.studentIds.length,
    0
  );
  const totalCap = courses.reduce((sum, c) => sum + c.enrollmentCap, 0);
  const fillRate = totalCap > 0 ? totalEnrollment / totalCap : 0;
  const instructorIds = new Set(courses.map((c) => c.instructorId));
  const assignments = courses.flatMap((c) => getAssignmentsForCourse(c.id));

  return {
    semesterId,
    totalCourses: courses.length,
    activeCourses: courses.filter((c) => c.status === "active").length,
    totalEnrollment,
    totalInstructors: instructorIds.size,
    averageClassSize:
      courses.length > 0 ? Math.round(totalEnrollment / courses.length) : 0,
    fillRate: Math.round(fillRate * 100) / 100,
    assignmentsCount: assignments.length,
    openAssignmentsCount: assignments.filter((a) => a.status === "open").length,
  };
}

export type EnrollmentTrend = Array<{
  semesterId: string;
  semesterCode: string;
  enrollment: number;
}>;

export function generateEnrollmentTrend(): EnrollmentTrend {
  return db.semesters
    .filter((s) => s.status === "past" || s.status === "active")
    .map((sem) => {
      const courses = getCoursesForSemester(sem.id);
      return {
        semesterId: sem.id,
        semesterCode: sem.code,
        enrollment: courses.reduce((sum, c) => sum + c.studentIds.length, 0),
      };
    });
}

export type DepartmentLoad = Array<{
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  activeCourses: number;
  activeInstructors: number;
  totalStudents: number;
}>;

export function generateDepartmentLoad(): DepartmentLoad {
  const sem = getActiveSemester();
  if (!sem) return [];
  return db.departments.map((dept) => {
    const courses: Course[] = [];
    for (const c of db.courses) {
      if (c.departmentId === dept.id && c.semesterId === sem.id) courses.push(c);
    }
    const instructorIds = new Set(courses.map((c) => c.instructorId));
    const studentIds = new Set<string>();
    for (const c of courses) for (const s of c.studentIds) studentIds.add(s);
    return {
      departmentId: dept.id,
      departmentCode: dept.code,
      departmentName: dept.name,
      activeCourses: courses.length,
      activeInstructors: instructorIds.size,
      totalStudents: studentIds.size,
    };
  });
}

export type CourseProgress = {
  courseId: string;
  totalAssignments: number;
  completedAssignments: number;
  upcomingAssignments: number;
  averageSubmissionRate: number;
  progressFraction: number;
};

export function generateCourseProgress(
  courseId: string
): CourseProgress | null {
  const course = getCourse(courseId);
  if (!course) return null;
  const assignments = getAssignmentsForCourse(courseId);
  const completed = assignments.filter((a) => a.status === "graded").length;
  const upcoming = assignments.filter((a) => a.status === "open").length;
  const submissionRates = assignments
    .filter((a) => a.enrolledCount > 0)
    .map((a) => a.submissionCount / a.enrolledCount);
  const avgRate =
    submissionRates.length > 0
      ? submissionRates.reduce((a, b) => a + b, 0) / submissionRates.length
      : 0;

  return {
    courseId,
    totalAssignments: assignments.length,
    completedAssignments: completed,
    upcomingAssignments: upcoming,
    averageSubmissionRate: Math.round(avgRate * 100) / 100,
    progressFraction:
      assignments.length > 0 ? completed / assignments.length : 0,
  };
}

export type GradeDistribution = {
  courseId: string;
  buckets: Array<{ label: "A" | "B" | "C" | "D" | "F"; count: number }>;
};

export function generateGradeDistribution(courseId: string): GradeDistribution {
  const course = getCourse(courseId);
  const enrolled = course?.studentIds.length ?? 0;
  // Synthetic but stable per course
  const seed = courseId.length;
  const a = Math.round(enrolled * (0.18 + ((seed * 7) % 10) / 100));
  const b = Math.round(enrolled * (0.36 + ((seed * 11) % 10) / 100));
  const c = Math.round(enrolled * (0.28 + ((seed * 13) % 10) / 100));
  const d = Math.round(enrolled * 0.1);
  const f = Math.max(0, enrolled - a - b - c - d);
  return {
    courseId,
    buckets: [
      { label: "A", count: a },
      { label: "B", count: b },
      { label: "C", count: c },
      { label: "D", count: d },
      { label: "F", count: f },
    ],
  };
}
