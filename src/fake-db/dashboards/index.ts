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
import { NOW } from "../seed";
import type {
  Activity,
  Assignment,
  Course,
  CourseStatus,
  Instructor,
  InstructorStatus,
  InstructorTitle,
  Notification,
  Semester,
  SemesterStatus,
  Student,
  StudentStatus,
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

// ─── Admin Students ───────────────────────────────────────────────────────────

const YEAR_TO_STANDING: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Freshman",
  2: "Sophomore",
  3: "Junior",
  4: "Senior",
  5: "Graduate",
};

const LAST_ACTIVE_OPTS = [
  "Just now", "5m ago", "1h ago", "2h ago", "4h ago", "8h ago",
  "1d ago", "2d ago", "3d ago", "5d ago", "1w ago",
];

export type AdminStudentRow = {
  id: string;
  studentNumber: string;
  fullName: string;
  email: string;
  programName: string;
  programCode: string;
  standing: string;
  gpa: number;
  credits: number;
  status: StudentStatus;
  advisorName: string;
  lastActive: string;
  isAdvisee: boolean;
};

export type AdminStudentsData = {
  rows: AdminStudentRow[];
  total: number;
};

export function getAdminStudentsPage(): AdminStudentsData {
  const programById = new Map(db.programs.map((p) => [p.id, p]));
  const instructors = db.instructors;

  const rows: AdminStudentRow[] = db.students.map((s, i) => {
    const program = programById.get(s.programId);
    const h = strHash(s.id);
    const advisor = instructors[h % instructors.length];
    const credits = (s.year - 1) * 28 + (h % 18) + 10;
    return {
      id: s.id,
      studentNumber: `AU-${String(48210 + i).padStart(7, "0")}`,
      fullName: s.fullName,
      email: s.email,
      programName: program?.name ?? "Unknown",
      programCode: program?.code ?? "??",
      standing: YEAR_TO_STANDING[s.year],
      gpa: s.gpa,
      credits,
      status: s.status,
      advisorName: advisor ? `${advisor.firstName} ${advisor.lastName}` : "—",
      lastActive: LAST_ACTIVE_OPTS[h % LAST_ACTIVE_OPTS.length],
      isAdvisee: strHash(s.id + "adv") % 10 < 2,
    };
  });

  return { rows, total: db.students.length };
}

// ─── Admin Instructors ────────────────────────────────────────────────────────

function fmtHireDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export type AdminInstructorRow = {
  id: string;
  fullName: string;
  email: string;
  title: InstructorTitle;
  deptCode: string;
  deptName: string;
  deptColor: string;
  status: InstructorStatus;
  rating: number;
  courseCount: number;
  activeCourseCount: number;
  hireDate: string;
};

export type AdminInstructorsData = {
  rows: AdminInstructorRow[];
  total: number;
};

export function getAdminInstructorsPage(): AdminInstructorsData {
  const deptById = new Map(db.departments.map((d) => [d.id, d]));
  const activeCourseIdSet = new Set(
    db.courses.filter((c) => c.status === "active").map((c) => c.id)
  );

  const rows: AdminInstructorRow[] = db.instructors.map((inst) => {
    const dept = deptById.get(inst.departmentId);
    const deptCode = dept?.code ?? "??";
    const activeCourseCount = inst.courseIds.filter((id) =>
      activeCourseIdSet.has(id)
    ).length;
    return {
      id: inst.id,
      fullName: inst.fullName,
      email: inst.email,
      title: inst.title,
      deptCode,
      deptName: dept?.name ?? "Unknown",
      deptColor: DEPT_COLORS_MAP[deptCode] ?? "var(--m-accent)",
      status: inst.status,
      rating: inst.rating,
      courseCount: inst.courseIds.length,
      activeCourseCount,
      hireDate: fmtHireDate(inst.hireDate),
    };
  });

  return { rows, total: db.instructors.length };
}

// ─── Admin Semesters ──────────────────────────────────────────────────────────

const TL_START_MS = new Date("2025-01-01").getTime();
const TL_END_MS   = new Date("2027-07-01").getTime();
const TL_SPAN_MS  = TL_END_MS - TL_START_MS;

function tlPct(d: Date): number {
  return ((d.getTime() - TL_START_MS) / TL_SPAN_MS) * 100;
}

function semProgress(sem: Semester): number {
  if (sem.status === "past") return 1.0;
  if (sem.status !== "active") return 0.0;
  const s = new Date(sem.startDate).getTime();
  const e = new Date(sem.endDate).getTime();
  return Math.min(1, Math.max(0, (NOW.getTime() - s) / (e - s)));
}

function fmtDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(s)} – ${fmt(e)}, ${e.getFullYear()}`;
}

export type AdminSemesterCard = {
  id: string;
  code: string;
  name: string;
  dateRange: string;
  status: SemesterStatus;
  progress: number;
  stats: { students: number; courses: number; instructors: number };
  tlLeft: number;
  tlWidth: number;
};

export type AdminSemestersData = {
  semesters: AdminSemesterCard[];
  todayPct: number;
  tlLabels: { label: string; pct: number }[];
};

const TL_LABELS: { label: string; pct: number }[] = [
  { label: "Jan '25", pct: tlPct(new Date("2025-01-01")) },
  { label: "Jul '25", pct: tlPct(new Date("2025-07-01")) },
  { label: "Jan '26", pct: tlPct(new Date("2026-01-01")) },
  { label: "Jul '26", pct: tlPct(new Date("2026-07-01")) },
  { label: "Jan '27", pct: tlPct(new Date("2027-01-01")) },
  { label: "Jul '27", pct: 100 },
];

export function getAdminSemestersPage(): AdminSemestersData {
  // per-semester stats
  const coursesBySem = new Map<string, (typeof db.courses)[0][]>();
  for (const c of db.courses) {
    const arr = coursesBySem.get(c.semesterId) ?? [];
    arr.push(c);
    coursesBySem.set(c.semesterId, arr);
  }

  const semesters: AdminSemesterCard[] = db.semesters.map((sem) => {
    const courses = coursesBySem.get(sem.id) ?? [];
    const studentSet = new Set<string>();
    const instructorSet = new Set<string>();
    for (const c of courses) {
      for (const sid of c.studentIds) studentSet.add(sid);
      instructorSet.add(c.instructorId);
    }

    const left  = tlPct(new Date(sem.startDate));
    const right = tlPct(new Date(sem.endDate));

    return {
      id: sem.id,
      code: sem.code,
      name: sem.name,
      dateRange: fmtDateRange(sem.startDate, sem.endDate),
      status: sem.status,
      progress: semProgress(sem),
      stats: {
        students:    studentSet.size,
        courses:     courses.length,
        instructors: instructorSet.size,
      },
      tlLeft:  Math.max(0, left),
      tlWidth: Math.max(0, Math.min(100, right) - Math.max(0, left)),
    };
  });

  return {
    semesters,
    todayPct: Math.min(100, Math.max(0, tlPct(NOW))),
    tlLabels: TL_LABELS,
  };
}
