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
  CourseStatus,
  Instructor,
  Notification,
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

export type AdminActivityData = {
  events: Activity[];
};

export function getAdminActivityPage(): AdminActivityData {
  return { events: db.activity.slice(0, 24) };
}

export type AdminNotificationsData = {
  notifications: Notification[];
};

export function getAdminNotificationsPage(): AdminNotificationsData {
  return { notifications: db.notifications.slice(0, 10) };
}

const DEPT_COLORS_MAP: Record<string, string> = {
  CS:   "var(--m-info)",
  MATH: "#9a7fc4",
  PHYS: "var(--m-accent)",
  BIO:  "var(--m-success)",
  CHEM: "var(--m-success)",
  ENG:  "var(--m-accent)",
  LIT:  "var(--m-accent)",
  HIST: "var(--m-warning)",
  PHIL: "var(--m-info)",
  ECON: "var(--m-danger)",
  SOC:  "var(--m-warning)",
  POLI: "var(--m-danger)",
  ART:  "var(--m-warning)",
  MUS:  "#9a7fc4",
  LING: "var(--m-info)",
};

function strHash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return h;
}

const MODALITIES = [
  "In-person",
  "In-person",
  "In-person",
  "Hybrid",
  "Hybrid",
  "Online",
] as const;
type Modality = (typeof MODALITIES)[number];

function courseLevel(code: string): 100 | 200 | 300 | 400 | 500 {
  const m = code.match(/(\d+)/);
  if (!m) return 100;
  const n = parseInt(m[1]);
  if (n >= 500) return 500;
  return (Math.floor(n / 100) * 100) as 100 | 200 | 300 | 400;
}

export type AdminCourseRow = {
  id: string;
  code: string;
  title: string;
  instructorName: string;
  deptCode: string;
  deptColor: string;
  modality: Modality;
  level: 100 | 200 | 300 | 400 | 500;
  enrolled: number;
  cap: number;
  credits: number;
  avgGrade: number | null;
  ungraded: number;
  status: CourseStatus;
};

export type AdminCoursesData = {
  rows: AdminCourseRow[];
  total: number;
};

export function getAdminCoursesPage(): AdminCoursesData {
  const instructorById = new Map(db.instructors.map((i) => [i.id, i]));
  const deptById = new Map(db.departments.map((d) => [d.id, d]));

  const ungradedByCourse = new Map<string, number>();
  for (const a of db.assignments) {
    if (a.status === "grading") {
      ungradedByCourse.set(a.courseId, (ungradedByCourse.get(a.courseId) ?? 0) + 1);
    }
  }

  const rows: AdminCourseRow[] = db.courses.map((c) => {
    const instructor = instructorById.get(c.instructorId);
    const dept = deptById.get(c.departmentId);
    const deptCode = dept?.code ?? "??";
    const h = strHash(c.id);
    const avgGrade = h % 8 === 0 ? null : 55 + (h % 4000) / 100;
    return {
      id: c.id,
      code: c.code,
      title: c.title,
      instructorName: instructor?.lastName ?? "—",
      deptCode,
      deptColor: DEPT_COLORS_MAP[deptCode] ?? "var(--m-accent)",
      modality: MODALITIES[h % MODALITIES.length],
      level: courseLevel(c.code),
      enrolled: c.studentIds.length,
      cap: c.enrollmentCap,
      credits: c.credits,
      avgGrade,
      ungraded: ungradedByCourse.get(c.id) ?? 0,
      status: c.status,
    };
  });

  return { rows, total: db.courses.length };
}
