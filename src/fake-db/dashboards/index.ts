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
  generateSubmissionThroughput,
  generateSubmissionsLast7d,
  generateUpcomingDeadlines,
  type SubmissionThroughputPoint,
} from "../generators";
import {
  getActiveSemester,
  getCoursesForInstructor,
  getInstructor,
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
  StudentStatus,
  UserStatus,
} from "../types";
import { db } from "../universe";

const WEEK_MS = 7 * 86_400_000;
const DAY_MS = 86_400_000;
const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function generateDailyThroughput(): SubmissionThroughputPoint[] {
  const buckets = new Array<number>(7).fill(0);
  const periodStart = NOW.getTime() - 7 * DAY_MS;
  for (const a of db.assignments) {
    const dueMs = new Date(a.dueDate).getTime();
    if (dueMs < periodStart || dueMs > NOW.getTime()) continue;
    const d = Math.min(6, Math.floor((dueMs - periodStart) / DAY_MS));
    buckets[d] += Math.round(a.submissionCount / 7);
  }
  return buckets.map((v, i) => ({
    l: WEEKDAY[new Date(periodStart + (i + 0.5) * DAY_MS).getUTCDay()],
    v,
  }));
}

function generateTermThroughput(
  startDate: string,
): SubmissionThroughputPoint[] {
  const elapsed = Math.max(
    WEEK_MS,
    NOW.getTime() - new Date(startDate).getTime(),
  );
  const weeks = Math.ceil(elapsed / WEEK_MS);
  return generateSubmissionThroughput(weeks);
}

export type ThroughputByWindow = {
  "7d": SubmissionThroughputPoint[];
  "12w": SubmissionThroughputPoint[];
  term: SubmissionThroughputPoint[];
};

export type AdminOverviewData = {
  activeSemester: Semester | undefined;
  analytics: SemesterAnalytics | null;
  enrollmentTrend: EnrollmentTrend;
  departmentLoad: DepartmentLoad;
  recentActivity: Activity[];
  submissionThroughput: SubmissionThroughputPoint[];
  throughputByWindow: ThroughputByWindow;
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
  const tp12 = generateSubmissionThroughput(12);
  return {
    activeSemester: sem,
    analytics: sem ? generateSemesterAnalytics(sem.id) : null,
    enrollmentTrend: generateEnrollmentTrend(),
    departmentLoad: generateDepartmentLoad(),
    recentActivity: generateRecentActivity(12),
    submissionThroughput: tp12,
    throughputByWindow: {
      "7d": generateDailyThroughput(),
      "12w": tp12,
      term: sem ? generateTermThroughput(sem.startDate) : tp12,
    },
    submissionsLast7d: generateSubmissionsLast7d(),
    totals: {
      students: db.students.length,
      instructors: db.instructors.length,
      courses: db.courses.length,
      activeCourses: db.courses.filter((c) => c.status === "active").length,
    },
  };
}

export type StudentCourseCard = {
  code: string;
  deptCode: string;
  deptColor: string;
  title: string;
  instructor: string;
  progress: number;
  grade: string;
  nextDue: string;
};

export type StudentDeadlineItem = {
  id: string;
  course: string;
  title: string;
  dayLabel: string;
  timeLabel: string;
  inLabel: string;
  type: "assignment" | "paper" | "discussion" | "milestone";
};

export type StudentAnnouncementItem = {
  who: string;
  course: string;
  title: string;
  time: string;
};

export type StudentScheduleEvent = {
  row: number;
  col: number;
  course: string;
  displayTime: string;
  location: string;
  tone: "" | "info" | "warning" | "success";
};

export type ContinueLearning = {
  courseCode: string;
  courseTitle: string;
  moduleSub: string;
  lessonTitle: string;
  lessonDesc: string;
  lessonMeta: string;
  progress: number;
  minutesLeft: number;
} | null;

export type TermOverview = {
  creditsThisTerm: number;
  totalTermCredits: number;
  gpa: number;
  degreeProgress: number;
  program: string;
  classYear: number;
  advisorName: string;
};

export type StudentDashboardData = {
  student: { firstName: string; name: string };
  eyebrow: string;
  semesterLabel: string;
  subText: string;
  continueLearning: ContinueLearning;
  courses: StudentCourseCard[];
  announcements: StudentAnnouncementItem[];
  deadlines: StudentDeadlineItem[];
  scheduleEvents: StudentScheduleEvent[];
  termOverview: TermOverview;
};

function numToLetterGrade(n: number): string {
  if (n >= 97) return "A+";
  if (n >= 93) return "A";
  if (n >= 90) return "A−";
  if (n >= 87) return "B+";
  if (n >= 83) return "B";
  if (n >= 80) return "B−";
  if (n >= 77) return "C+";
  if (n >= 73) return "C";
  if (n >= 70) return "C−";
  if (n >= 67) return "D+";
  if (n >= 63) return "D";
  if (n >= 60) return "D−";
  return "F";
}

function fmtDueShort(d: Date): string {
  const diffDays = Math.ceil((d.getTime() - NOW.getTime()) / DAY_MS);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 6)
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
  return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()]} ${d.getDate()}`;
}

function fmtMeetingTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  const h12 = h > 12 ? h - 12 : h;
  return `${h12}:${mStr}`;
}

const DEPT_TONE: Record<string, StudentScheduleEvent["tone"]> = {
  CS: "info",
  PHIL: "info",
  LING: "info",
  MATH: "warning",
  HIST: "warning",
  ART: "warning",
  MUS: "warning",
  BIO: "success",
  CHEM: "success",
  ENG: "success",
};

const ADVISOR_POOL = [
  "Prof. Mateusz Carvalho",
  "Prof. Vihaan Krishnan",
  "Prof. Saoirse Walsh",
  "Prof. Linnea Ahmadi",
  "Prof. Adaeze Okafor",
  "Prof. Henrik Lindqvist",
];

const ANN_TEMPLATES = [
  (code: string) => `Office hours rescheduled — check ${code} announcements`,
  (code: string) => `Midterm results posted for ${code}`,
  (code: string) => `Workshop session moved — see updated room in ${code}`,
  (code: string) => `Supplementary readings added to ${code} module`,
  (code: string) => `Grades released for last week's ${code} quiz`,
];

// Returns the active student with the most enrolled courses — used by all student-facing functions
// so every screen shows consistent data for the same persona.
function getDefaultStudent() {
  const active = db.students.filter(
    (s) => s.status === "active" && s.enrolledCourseIds.length >= 4,
  );
  if (active.length === 0) {
    // fallback: just pick the most-enrolled active student
    return (
      [...db.students]
        .filter((s) => s.status === "active")
        .sort(
          (a, b) => b.enrolledCourseIds.length - a.enrolledCourseIds.length,
        )[0] ?? db.students[0]
    );
  }
  // Use a stable pick so the same student is always returned
  return active[strHash(active[0].id) % active.length];
}

export function getStudentDashboard(): StudentDashboardData | null {
  const student = getDefaultStudent();
  if (!student) return null;

  const enrolledCourses = student.enrolledCourseIds
    .map((id) => db.courses.find((c) => c.id === id))
    .filter(Boolean) as Course[];

  const semester =
    db.semesters.find((s) => s.status === "active") ?? db.semesters[0];
  const semStart = new Date(semester.startDate).getTime();
  const weekNum = Math.max(
    1,
    Math.floor((NOW.getTime() - semStart) / WEEK_MS) + 1,
  );
  const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][NOW.getDay()];
  const eyebrow = `${semester.name} · Week ${weekNum} · ${dayName} ${MONTH_NAMES[NOW.getMonth()]} ${NOW.getDate()}`;

  // ── deadlines ────────────────────────────────────────────────────────────
  const rawDeadlines = generateUpcomingDeadlines(student.id, 6);
  const deadlines: StudentDeadlineItem[] = rawDeadlines.slice(0, 5).map((d) => {
    const due = new Date(d.dueDate);
    const diffDays = Math.ceil((due.getTime() - NOW.getTime()) / DAY_MS);
    const dayLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      due.getDay()
    ];
    const h = due.getUTCHours();
    const m = due.getUTCMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    const timeLabel = `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
    const inLabel =
      diffDays <= 0
        ? "today"
        : diffDays === 1
          ? "tomorrow"
          : `in ${diffDays} days`;
    const asgn = db.assignments.find((a) => a.id === d.assignmentId);
    const typeMap: Record<string, StudentDeadlineItem["type"]> = {
      essay: "paper",
      exam: "assignment",
      quiz: "assignment",
      lab: "assignment",
      project: "milestone",
      presentation: "discussion",
    };
    return {
      id: d.assignmentId,
      course: d.courseCode,
      title: d.title,
      dayLabel,
      timeLabel,
      inLabel,
      type: asgn ? (typeMap[asgn.type] ?? "assignment") : "assignment",
    };
  });

  // ── courses ──────────────────────────────────────────────────────────────
  const courses: StudentCourseCard[] = enrolledCourses.slice(0, 5).map((c) => {
    const sh = strHash(student.id + c.id);
    const dept = db.departments.find((d) => d.id === c.departmentId);
    const deptCode = dept?.code ?? c.code.split("-")[0];
    const deptColor = DEPT_COLORS_MAP[deptCode] ?? "var(--m-accent)";
    const instructor = db.instructors.find((i) => i.id === c.instructorId);
    const instructorName = instructor
      ? `Prof. ${instructor.firstName} ${instructor.lastName}`
      : "—";
    const progress = (10 + (sh % 81)) / 100;
    const ch = strHash(c.id);
    const avgGrade = ch % 20 === 0 ? null : 68 + (ch % 1500) / 100;
    const sh2 = strHash(student.id + c.id + "g");
    const gradeNum = avgGrade
      ? Math.max(
          45,
          Math.min(
            100,
            Math.round(avgGrade + (sh % 21) - 10 + (sh2 % 21) - 10),
          ),
        )
      : null;
    const grade = gradeNum ? numToLetterGrade(gradeNum) : "—";
    const courseDl = rawDeadlines.find((dl) => dl.courseId === c.id);
    const nextDue = courseDl
      ? `${courseDl.title} · ${fmtDueShort(new Date(courseDl.dueDate))}`
      : "No upcoming";
    return {
      code: c.code,
      deptCode,
      deptColor,
      title: c.title,
      instructor: instructorName,
      progress,
      grade,
      nextDue,
    };
  });

  // ── announcements ─────────────────────────────────────────────────────────
  const announcements: StudentAnnouncementItem[] = [];
  for (let i = 0; i < Math.min(2, enrolledCourses.length); i++) {
    const c = enrolledCourses[i];
    const sh = strHash(student.id + c.id + "ann");
    const instructor = db.instructors.find((ins) => ins.id === c.instructorId);
    const who = instructor
      ? `Prof. ${instructor.firstName} ${instructor.lastName}`
      : "Instructor";
    announcements.push({
      who,
      course: c.code,
      title: ANN_TEMPLATES[sh % ANN_TEMPLATES.length](c.code),
      time: i === 0 ? "1h ago" : "Yesterday",
    });
  }
  announcements.push({
    who: "Academic Advising",
    course: "Advising",
    title: `${semester.name.includes("Spring") ? "Summer" : "Spring"} registration opens soon — check your portal`,
    time: "2 days ago",
  });

  // ── schedule ──────────────────────────────────────────────────────────────
  const DAY_TO_COL: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
  };
  const scheduleEvents: StudentScheduleEvent[] = [];
  for (const c of enrolledCourses) {
    const dept = db.departments.find((d) => d.id === c.departmentId);
    const deptCode = dept?.code ?? c.code.split("-")[0];
    const tone = DEPT_TONE[deptCode] ?? "";
    for (const mt of c.meetingTimes) {
      const col = DAY_TO_COL[mt.day];
      if (col === undefined) continue;
      const hour = parseInt(mt.start.split(":")[0], 10);
      const row = hour - 9;
      if (row < 0 || row > 6) continue;
      scheduleEvents.push({
        row,
        col,
        course: c.code,
        displayTime: fmtMeetingTime(mt.start),
        location: `${c.location.building} ${c.location.room}`,
        tone,
      });
    }
  }

  // ── continue learning ────────────────────────────────────────────────────
  let continueLearning: StudentDashboardData["continueLearning"] = null;
  if (enrolledCourses.length > 0) {
    const c = enrolledCourses[0];
    const sh = strHash(student.id + c.id);
    const modIdx = (sh % 4) + 1;
    const lesIdx = (sh % 6) + 1;
    const lessonId = `L${modIdx}.${lesIdx}`;
    const progress = (20 + (sh % 60)) / 100;
    const minutesLeft = 10 + (sh % 40);
    continueLearning = {
      courseCode: c.code,
      courseTitle: c.title,
      moduleSub: `${c.code} · Module ${modIdx} · Lesson ${lesIdx}`,
      lessonTitle: `Workshop — ${c.title} pt. ${(sh % 2) + 1}`,
      lessonDesc: `Continue the practical implementation from the previous session. Complete the remaining exercises and submit your work to the autograder by the deadline.`,
      lessonMeta: `${lessonId} · workshop · 60 min`,
      progress,
      minutesLeft,
    };
  }

  // ── term overview ─────────────────────────────────────────────────────────
  const program = db.programs.find((p) => p.id === student.programId);
  const programName = program
    ? `${program.degreeType}. ${program.name}`
    : "B.S. Computer Science";
  const classYear = 2025 + Math.max(1, 5 - student.year);
  const degreeProgress = Math.round((student.year - 1) * 25 + 12);
  const creditsThisTerm = enrolledCourses.reduce((s, c) => s + c.credits, 0);
  const sh = strHash(student.id);
  const advisorName = ADVISOR_POOL[sh % ADVISOR_POOL.length];

  const dueSoon = deadlines.filter(
    (d) =>
      ["today", "tomorrow"].includes(d.inLabel) ||
      d.inLabel.startsWith("in 2") ||
      d.inLabel.startsWith("in 3"),
  ).length;
  const subText =
    dueSoon > 0
      ? `You have ${dueSoon === 1 ? "one assignment" : `${dueSoon} assignments`} due this week. Check your upcoming deadlines.`
      : "You're all caught up this week. Keep up the good work!";

  return {
    student: { firstName: student.firstName, name: student.fullName },
    eyebrow,
    semesterLabel: semester.name,
    subText,
    continueLearning,
    courses,
    announcements,
    deadlines,
    scheduleEvents,
    termOverview: {
      creditsThisTerm,
      totalTermCredits: 18,
      gpa: student.gpa,
      degreeProgress,
      program: programName,
      classYear,
      advisorName,
    },
  };
}

export type InstructorDashboardData = {
  instructor: Instructor;
  teachingCourses: Course[];
  gradingQueue: Assignment[];
  recentActivity: Activity[];
};

export function getInstructorDashboard(
  instructorId: string,
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
  return { events: db.activity };
}

export type AdminNotificationsData = {
  notifications: Notification[];
};

export function getAdminNotificationsPage(): AdminNotificationsData {
  return { notifications: db.notifications };
}

export function getStudentNotifications(): Notification[] {
  const student = getDefaultStudent();
  if (!student) return [];

  const enrolledCourses = student.enrolledCourseIds
    .map((id) => db.courses.find((c) => c.id === id))
    .filter(Boolean) as Course[];

  const items: Notification[] = [];
  const DAY_MS = 24 * 60 * 60 * 1000;

  const bodies: Array<{
    kind: Notification["kind"];
    body: string;
    minsAgo: number;
    read: boolean;
  }> = [
    {
      kind: "system",
      body: `Grade released for ${enrolledCourses[0]?.code ?? "CS-101"}: Quiz 3 — you scored 91/100.`,
      minsAgo: 18,
      read: false,
    },
    {
      kind: "mention",
      body: `Prof. ${db.instructors[0]?.lastName ?? "Smith"} posted an announcement in ${enrolledCourses[1]?.code ?? "MATH-201"}: "No class this Friday."`,
      minsAgo: 55,
      read: false,
    },
    {
      kind: "system",
      body: `Assignment due in 24h: ${enrolledCourses[0]?.code ?? "CS-101"} — Lab 4: Recursion. Submit before midnight.`,
      minsAgo: 90,
      read: false,
    },
    {
      kind: "system",
      body: `Grade released for ${enrolledCourses[1]?.code ?? "MATH-201"}: Midterm Exam — you scored 78/100.`,
      minsAgo: 60 * 5,
      read: true,
    },
    {
      kind: "approval",
      body: `Your enrollment in ${enrolledCourses[2]?.code ?? "PHYS-301"} has been confirmed for the upcoming semester.`,
      minsAgo: 60 * 12,
      read: true,
    },
    {
      kind: "mention",
      body: `Prof. ${db.instructors[1]?.lastName ?? "Johnson"} mentioned you in ${enrolledCourses[0]?.code ?? "CS-101"}: "Great work on the last project, Ines!"`,
      minsAgo: 60 * 24,
      read: true,
    },
    {
      kind: "system",
      body: `Deadline reminder: ${enrolledCourses[2]?.code ?? "PHYS-301"} — Final Project due in 3 days.`,
      minsAgo: 60 * 36,
      read: true,
    },
    {
      kind: "system",
      body: `Grade released for ${enrolledCourses[0]?.code ?? "CS-101"}: Essay 1 — you scored 85/100.`,
      minsAgo: 60 * 48,
      read: true,
    },
  ];

  bodies.forEach((b, i) => {
    const ts = new Date(NOW.getTime() - b.minsAgo * 60_000);
    items.push({
      id: `student-notif-${i + 1}`,
      kind: b.kind,
      recipientUserId: student.id,
      body: b.body,
      timestamp: ts.toISOString(),
      read: b.read,
    });
  });

  return items;
}

export function getInstructorNotifications(): Notification[] {
  const instructor = db.instructors[0];
  if (!instructor) return [];

  const courses = db.courses
    .filter((c) => c.instructorId === instructor.id)
    .slice(0, 3);

  const items: Notification[] = [];

  const bodies: Array<{
    kind: Notification["kind"];
    body: string;
    minsAgo: number;
    read: boolean;
  }> = [
    {
      kind: "system",
      body: `${courses[0]?.code ?? "CS-101"} — 4 new submissions received for Lab 4. Grading window opens now.`,
      minsAgo: 10,
      read: false,
    },
    {
      kind: "approval",
      body: `Grading SLA alert: ${courses[1]?.code ?? "MATH-201"} Midterm Exam has 12 ungraded submissions past the 72h window.`,
      minsAgo: 45,
      read: false,
    },
    {
      kind: "mention",
      body: `Student in ${courses[0]?.code ?? "CS-101"} posted a question on Lab 4: "Is tail recursion required for problem 3?"`,
      minsAgo: 80,
      read: false,
    },
    {
      kind: "system",
      body: `Roster sync complete for ${courses[0]?.code ?? "CS-101"}: 2 students added, 1 dropped.`,
      minsAgo: 60 * 4,
      read: true,
    },
    {
      kind: "approval",
      body: `Grade passback to Canvas LMS completed for ${courses[1]?.code ?? "MATH-201"} — all records updated.`,
      minsAgo: 60 * 8,
      read: true,
    },
    {
      kind: "mention",
      body: `Department chair mentioned you in an announcement: "Please submit your final grade reports by Friday."`,
      minsAgo: 60 * 20,
      read: true,
    },
    {
      kind: "system",
      body: `${courses[2]?.code ?? "PHYS-301"} — Office hours reminder sent to all enrolled students.`,
      minsAgo: 60 * 30,
      read: true,
    },
  ];

  bodies.forEach((b, i) => {
    const ts = new Date(NOW.getTime() - b.minsAgo * 60_000);
    items.push({
      id: `instructor-notif-${i + 1}`,
      kind: b.kind,
      recipientUserId: instructor.id,
      body: b.body,
      timestamp: ts.toISOString(),
      read: b.read,
    });
  });

  return items;
}

const DEPT_COLORS_MAP: Record<string, string> = {
  CS: "var(--m-info)",
  MATH: "#9a7fc4",
  PHYS: "var(--m-accent)",
  BIO: "var(--m-success)",
  CHEM: "var(--m-success)",
  ENG: "var(--m-accent)",
  LIT: "var(--m-accent)",
  HIST: "var(--m-warning)",
  PHIL: "var(--m-info)",
  ECON: "var(--m-danger)",
  SOC: "var(--m-warning)",
  POLI: "var(--m-danger)",
  ART: "var(--m-warning)",
  MUS: "#9a7fc4",
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
      ungradedByCourse.set(
        a.courseId,
        (ungradedByCourse.get(a.courseId) ?? 0) + 1,
      );
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
  "Just now",
  "5m ago",
  "1h ago",
  "2h ago",
  "4h ago",
  "8h ago",
  "1d ago",
  "2d ago",
  "3d ago",
  "5d ago",
  "1w ago",
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
    db.courses.filter((c) => c.status === "active").map((c) => c.id),
  );

  const rows: AdminInstructorRow[] = db.instructors.map((inst) => {
    const dept = deptById.get(inst.departmentId);
    const deptCode = dept?.code ?? "??";
    const activeCourseCount = inst.courseIds.filter((id) =>
      activeCourseIdSet.has(id),
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
const TL_END_MS = new Date("2027-07-01").getTime();
const TL_SPAN_MS = TL_END_MS - TL_START_MS;

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

    const left = tlPct(new Date(sem.startDate));
    const right = tlPct(new Date(sem.endDate));

    return {
      id: sem.id,
      code: sem.code,
      name: sem.name,
      dateRange: fmtDateRange(sem.startDate, sem.endDate),
      status: sem.status,
      progress: semProgress(sem),
      stats: {
        students: studentSet.size,
        courses: courses.length,
        instructors: instructorSet.size,
      },
      tlLeft: Math.max(0, left),
      tlWidth: Math.max(0, Math.min(100, right) - Math.max(0, left)),
    };
  });

  return {
    semesters,
    todayPct: Math.min(100, Math.max(0, tlPct(NOW))),
    tlLabels: TL_LABELS,
  };
}

// ─── Admin Users & Roles ──────────────────────────────────────────────────────

function fmtRelative(iso: string | null): string {
  if (!iso) return "Never";
  const diffMs = NOW.getTime() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function hashLastLogin(id: string): string | null {
  const h = strHash(id + "login");
  if (h % 12 === 0) return null;
  const minsAgo = h % (60 * 24 * 14); // up to 14 days ago
  return new Date(NOW.getTime() - minsAgo * 60_000).toISOString();
}

const ROLE_META: Record<string, { label: string; color: string }> = {
  admin: { label: "Administrator", color: "var(--m-danger)" },
  registrar: { label: "Registrar", color: "var(--m-accent)" },
  admissions: { label: "Admissions", color: "var(--m-warning)" },
  it: { label: "IT Staff", color: "var(--m-info)" },
  dean: { label: "Dean & Chair", color: "var(--m-warning)" },
};

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
  roleLabel: string;
  roleColor: string;
  mfa: boolean;
  lastLogin: string;
  status: UserStatus;
};

export type RoleSummaryCard = {
  id: string;
  name: string;
  count: number;
  scope: string;
  color: string;
};

export type AdminUsersData = {
  rows: AdminUserRow[];
  total: number;
  roleSummaries: RoleSummaryCard[];
};

export function getAdminUsersPage(): AdminUsersData {
  // ── Staff accounts (admin, registrar, dean, etc.) ─────────────────────────
  const staffRows: AdminUserRow[] = db.users.map((u) => {
    const meta = ROLE_META[u.role] ?? {
      label: u.role,
      color: "var(--m-text-2)",
    };
    return {
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      roleId: u.role,
      roleLabel: meta.label,
      roleColor: meta.color,
      mfa: u.mfa,
      lastLogin: fmtRelative(u.lastLogin),
      status: u.status,
    };
  });

  // ── Faculty (instructors) ─────────────────────────────────────────────────
  const facultyRows: AdminUserRow[] = db.instructors.map((inst) => ({
    id: inst.id,
    fullName: inst.fullName,
    email: inst.email,
    roleId: "faculty",
    roleLabel: "Faculty",
    roleColor: "var(--m-info)",
    mfa: strHash(inst.id + "mfa") % 3 !== 0,
    lastLogin: fmtRelative(hashLastLogin(inst.id)),
    status: inst.status === "active" ? "active" : "suspended",
  }));

  // ── Teaching Assistants (deterministic subset of students) ────────────────
  const TA_COUNT = 240;
  const taIdSet = new Set<string>();
  const taRows: AdminUserRow[] = [];
  for (const s of db.students) {
    if (taRows.length >= TA_COUNT) break;
    if (strHash(s.id + "ta") % 62 === 0) {
      taIdSet.add(s.id);
      taRows.push({
        id: `ta-${s.id}`,
        fullName: s.fullName,
        email: s.email.replace("@student.", "@ta."),
        roleId: "ta",
        roleLabel: "Teaching Asst.",
        roleColor: "var(--m-success)",
        mfa: strHash(s.id + "tamfa") % 2 === 0,
        lastLogin: fmtRelative(hashLastLogin(s.id + "ta")),
        status: "active",
      });
    }
  }

  // ── Students (all, excluding TAs) ─────────────────────────────────────────
  const studentRows: AdminUserRow[] = db.students
    .filter((s) => !taIdSet.has(s.id))
    .map((s) => ({
      id: s.id,
      fullName: s.fullName,
      email: s.email,
      roleId: "student",
      roleLabel: "Student",
      roleColor: "var(--m-text-2)",
      mfa: strHash(s.id + "mfa") % 5 === 0,
      lastLogin: fmtRelative(hashLastLogin(s.id)),
      status: (s.status === "active" || s.status === "probation"
        ? "active"
        : "suspended") as UserStatus,
    }));

  const rows = [...staffRows, ...facultyRows, ...taRows, ...studentRows];

  // ── Role summary cards ────────────────────────────────────────────────────
  const countByRole = new Map<string, number>();
  for (const u of db.users) {
    countByRole.set(u.role, (countByRole.get(u.role) ?? 0) + 1);
  }
  const roleSummaries: RoleSummaryCard[] = [
    {
      id: "admin",
      name: "Administrators",
      count: countByRole.get("admin") ?? 0,
      scope: "Full system access",
      color: "var(--m-danger)",
    },
    {
      id: "registrar",
      name: "Registrar staff",
      count: countByRole.get("registrar") ?? 0,
      scope: "Roster, holds, transcripts",
      color: "var(--m-accent)",
    },
    {
      id: "dean",
      name: "Deans & Chairs",
      count: countByRole.get("dean") ?? 0,
      scope: "Department oversight",
      color: "var(--m-warning)",
    },
    {
      id: "faculty",
      name: "Faculty",
      count: facultyRows.length,
      scope: "Course delivery, grading",
      color: "var(--m-info)",
    },
    {
      id: "ta",
      name: "Teaching Assistants",
      count: taRows.length,
      scope: "Assist on assigned sections",
      color: "var(--m-success)",
    },
    {
      id: "student",
      name: "Students",
      count: studentRows.length,
      scope: "Personal data & enrolled courses",
      color: "var(--m-text-2)",
    },
  ];

  return { rows, total: rows.length, roleSummaries };
}

// ─── Admin Course Detail ──────────────────────────────────────────────────────

const MODULE_TITLES = [
  "Introduction & Foundations",
  "Core Concepts & Theory",
  "Advanced Techniques",
  "Implementation & Practice",
  "Case Studies & Applications",
  "Review & Assessment",
];

const LESSON_TITLES: Record<string, string[]> = {
  video: [
    "Lecture overview",
    "Concept walkthrough",
    "Demo session",
    "Recorded lecture",
  ],
  reading: [
    "Course readings",
    "Supplemental materials",
    "Research paper",
    "Textbook chapter",
  ],
  quiz: ["Module quiz", "Checkpoint quiz", "Self-assessment"],
  assignment: [
    "Problem set",
    "Lab exercise",
    "Mini project",
    "Written response",
  ],
};

const MODULE_LESSON_SHAPES = [
  ["video", "reading", "video", "quiz"],
  ["video", "reading", "video", "reading", "assignment", "quiz"],
  ["video", "video", "reading", "assignment", "quiz"],
  ["video", "reading", "assignment", "reading", "assignment"],
  ["video", "video", "reading", "assignment", "quiz"],
  ["video", "reading", "assignment", "quiz"],
] as const;

const RESOURCE_NAMES = [
  "Course syllabus.pdf",
  "Lecture slides — Module 1.pdf",
  "Reading list.docx",
  "Assignment rubric.pdf",
  "Lab instructions.pdf",
];

const LAST_ACTIVE_DETAIL = [
  "Just now",
  "5m ago",
  "1h ago",
  "2h ago",
  "4h ago",
  "8h ago",
  "1d ago",
  "2d ago",
  "3d ago",
];

const STANDINGS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

function minsAgoLabel(mins: number): string {
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export type AdminCourseModule = {
  id: string;
  title: string;
  lessonCount: number;
  totalMin: number;
  released: number;
  state: "complete" | "active" | "draft";
};

export type AdminCourseLesson = {
  id: string;
  title: string;
  kind: "video" | "reading" | "quiz" | "assignment";
  duration: string;
  state: "released" | "drafting" | "upcoming" | "scheduled";
};

export type AdminCourseRosterRow = {
  id: string;
  studentNumber: string;
  name: string;
  standing: string;
  grade: number | null;
  attendance: number;
  submitted: number;
  totalAssignments: number;
  lastActive: string;
};

export type AdminCourseSubmission = {
  id: string;
  studentName: string;
  assignmentTitle: string;
  submittedAt: string;
  attempts: number;
  status: "submitted" | "graded" | "late";
};

export type AdminCourseDTO = {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  level: number;
  modality: string;
  deptCode: string;
  deptColor: string;
  location: {
    building: string;
    room: string;
  };
  meetingLabel: string;
  status: CourseStatus;
  enrolled: number;
  cap: number;
  avgGrade: number | null;
  ungraded: number;
  taCount: number;
  weekCount: number;
};

export type AdminInstructorDTO = { id: string; name: string; email: string };

export type AdminEngagementDTO = { l: string; v: number };

export type AdminTeachingTeamDTO = {
  id: string;
  name: string;
  role: string;
};

export type AdminResourceDTO = { name: string; size: string; uploaded: string };

export type AdminCourseDetailData = {
  course: AdminCourseDTO;
  instructor: AdminInstructorDTO;
  teachingTeam: AdminTeachingTeamDTO[];
  modules: AdminCourseModule[];
  moduleLessons: Record<string, AdminCourseLesson[]>;
  resources: AdminResourceDTO[];
  recentSubmissions: AdminCourseSubmission[];
  roster: AdminCourseRosterRow[];
  gradeDistribution: number[];
  gradeSummary: {
    mean: number;
    median: number;
    stdev: number;
    failRate: number;
  };
  engagement: AdminEngagementDTO[];
  assignments: {
    id: string;
    title: string;
    type: string;
    due: string;
    status: string;
    submitted: number;
    total: number;
  }[];
} | null;

export function getAdminCourseDetail(code: string): AdminCourseDetailData {
  const course = db.courses.find((c) => c.code === code);
  if (!course) return null;

  const instructor = db.instructors.find((i) => i.id === course.instructorId);
  const dept = db.departments.find((d) => d.id === course.departmentId);
  if (!instructor || !dept) return null;

  const deptCode = dept.code;
  const deptColor = DEPT_COLORS_MAP[deptCode] ?? "var(--m-accent)";
  const h = strHash(course.id);

  // assignments for this course
  const assignments = db.assignments.filter((a) => a.courseId === course.id);
  const ungraded = assignments.filter((a) => a.status === "grading").length;
  const avgGrade = h % 20 === 0 ? null : 68 + (h % 1500) / 100;

  // meeting label
  const mt = course.meetingTimes;
  const meetingLabel =
    mt.length > 0
      ? `${mt.map((t) => t.day).join("/")} ${mt[0].start}–${mt[0].end}`
      : "TBD";

  const modality = MODALITIES[h % MODALITIES.length];
  const level = courseLevel(course.code);
  const taCount = (h % 3) + 1;

  // teaching team
  const possibleTAs = db.students
    .filter((s) => strHash(s.id + "ta") % 62 === 0)
    .slice(0, 12);
  const teamTAs = possibleTAs
    .slice(
      h % Math.max(1, possibleTAs.length - taCount),
      (h % Math.max(1, possibleTAs.length - taCount)) + taCount,
    )
    .slice(0, taCount);
  const teachingTeam = [
    {
      id: instructor.id,
      name: `Prof. ${instructor.firstName} ${instructor.lastName}`,
      role: "Instructor of Record",
    },
    ...teamTAs.map((ta, i) => ({
      id: `ta-${ta.id}`,
      name: `${ta.firstName} ${ta.lastName}`,
      role: i === 0 ? "Lead TA" : "Teaching Assistant",
    })),
  ];

  // modules
  const numModules = 4 + (h % 3);
  const modules: AdminCourseModule[] = Array.from(
    { length: numModules },
    (_, i) => {
      const mh = strHash(course.id + `mod${i}`);
      const shape = MODULE_LESSON_SHAPES[i % MODULE_LESSON_SHAPES.length];
      const lessonCount = shape.length;
      const totalMin = lessonCount * (20 + (mh % 30));
      const state: "complete" | "active" | "draft" =
        i === 0
          ? "complete"
          : i === 1
            ? "active"
            : mh % 3 === 0
              ? "draft"
              : "draft";
      const released =
        state === "complete"
          ? lessonCount
          : state === "active"
            ? Math.floor(lessonCount / 2)
            : 0;
      return {
        id: `M-0${i + 1}`,
        title: MODULE_TITLES[i % MODULE_TITLES.length],
        lessonCount,
        totalMin,
        released,
        state,
      };
    },
  );

  // lessons per module
  const moduleLessons: Record<string, AdminCourseLesson[]> = {};
  for (const mod of modules) {
    const mIdx = parseInt(mod.id.replace("M-0", "")) - 1;
    const shape = MODULE_LESSON_SHAPES[mIdx % MODULE_LESSON_SHAPES.length];
    moduleLessons[mod.id] = shape.map((kind, li) => {
      const lh = strHash(course.id + mod.id + String(li));
      const opts = LESSON_TITLES[kind];
      const title = opts[lh % opts.length];
      const dMin =
        kind === "video"
          ? 15 + (lh % 30)
          : kind === "reading"
            ? 10 + (lh % 20)
            : 20 + (lh % 15);
      const state: AdminCourseLesson["state"] =
        mod.state === "complete"
          ? "released"
          : mod.state === "draft"
            ? "scheduled"
            : li < mod.released
              ? "released"
              : li === mod.released
                ? "drafting"
                : li === mod.released + 1
                  ? "upcoming"
                  : "scheduled";
      return {
        id: `${mod.id}-L${String(li + 1).padStart(2, "0")}`,
        title,
        kind,
        duration: kind === "reading" ? `${dMin} min read` : `${dMin} min`,
        state,
      };
    });
  }

  // resources
  const numRes = 3 + (h % 3);
  const resources = RESOURCE_NAMES.slice(0, numRes).map((name, i) => ({
    name,
    size: `${100 + (strHash(course.id + name) % 900)}KB`,
    uploaded: `${3 + i} days ago`,
  }));

  // recent submissions
  const subStatuses = ["submitted", "graded", "late"] as const;
  const recentSubmissions: AdminCourseSubmission[] = [];
  const courseStudents = db.students
    .filter((s) => course.studentIds.includes(s.id))
    .slice(0, 12);
  const courseAssigns = assignments.slice(0, 4);
  outer: for (const s of courseStudents) {
    for (const a of courseAssigns) {
      if (recentSubmissions.length >= 8) break outer;
      const sh = strHash(s.id + a.id);
      if (sh % 4 === 0) continue;
      recentSubmissions.push({
        id: `${s.id}-${a.id}`,
        studentName: s.fullName,
        assignmentTitle: a.title,
        submittedAt: minsAgoLabel(sh % (7 * 24 * 60)),
        attempts: 1 + (sh % 3),
        status: subStatuses[sh % subStatuses.length],
      });
    }
  }

  // roster (up to 30 enrolled students)
  const rosterStudents = db.students
    .filter((s) => course.studentIds.includes(s.id))
    .slice(0, 30);
  const roster: AdminCourseRosterRow[] = rosterStudents.map((s) => {
    const sh = strHash(s.id + course.id);
    const sh2 = strHash(s.id + course.id + "g");
    return {
      id: s.id,
      studentNumber: `STU-${s.id.slice(-5).toUpperCase()}`,
      name: s.fullName,
      standing: STANDINGS[(s.year - 1) % STANDINGS.length],
      grade: avgGrade
        ? Math.max(
            45,
            Math.min(
              100,
              Math.round(avgGrade + (sh % 21) - 10 + (sh2 % 21) - 10),
            ),
          )
        : null,
      attendance: 60 + (sh % 41),
      submitted: 4 + (sh % Math.max(1, assignments.length)),
      totalAssignments: assignments.length,
      lastActive: LAST_ACTIVE_DETAIL[sh % LAST_ACTIVE_DETAIL.length],
    };
  });

  // grade distribution (bars at 50,55,…,100) — Gaussian scaled to full enrollment
  const peak = avgGrade != null ? Math.round(avgGrade) : 80 + (h % 10);
  const effectiveN = Math.max(course.studentIds.length, 40);
  const gradeDistribution = Array.from({ length: 11 }, (_, i) => {
    const g = 50 + i * 5;
    return avgGrade != null
      ? Math.max(
          0,
          Math.round(
            ((effectiveN * Math.exp(-0.5 * ((g - peak) / 12) ** 2)) /
              (12 * Math.sqrt(2 * Math.PI))) *
              5 +
              (strHash(course.id + String(i)) % 3),
          ),
        )
      : 0;
  });

  // grade summary from roster
  const grades = roster.map((r) => r.grade ?? 0).filter(Boolean);
  const mean = grades.length
    ? grades.reduce((a, b) => a + b, 0) / grades.length
    : 0;
  const sorted = [...grades].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
  const stdev = grades.length
    ? Math.sqrt(grades.reduce((a, g) => a + (g - mean) ** 2, 0) / grades.length)
    : 0;
  const failRate =
    (grades.filter((g) => g < 60).length / (grades.length || 1)) * 100;

  // engagement (12-week trend)
  const engagement = Array.from({ length: 12 }, (_, i) => ({
    l: `W${i + 1}`,
    v: 60 + (strHash(course.id + `eng${i}`) % 40),
  }));

  return {
    course: {
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description,
      credits: course.credits,
      level,
      modality,
      deptCode,
      deptColor,
      location: course.location,
      meetingLabel,
      status: course.status,
      enrolled: course.studentIds.length,
      cap: course.enrollmentCap,
      avgGrade,
      ungraded,
      taCount,
      weekCount: 16,
    },
    instructor: {
      id: instructor.id,
      name: `Prof. ${instructor.firstName} ${instructor.lastName}`,
      email: `${instructor.firstName.toLowerCase()}.${instructor.lastName.toLowerCase()}@aldridge.edu`,
    },
    teachingTeam,
    modules,
    moduleLessons,
    resources,
    recentSubmissions,
    roster,
    gradeDistribution,
    gradeSummary: {
      mean: Math.round(mean * 10) / 10,
      median: Math.round(median * 10) / 10,
      stdev: Math.round(stdev * 10) / 10,
      failRate: Math.round(failRate * 10) / 10,
    },
    engagement,
    assignments: assignments.slice(0, 8).map((a) => ({
      id: a.id,
      title: a.title,
      type: a.type,
      due: a.dueDate,
      status: a.status,
      submitted: a.submissionCount,
      total: a.enrolledCount,
    })),
  };
}

// ── Student Courses Page ──────────────────────────────────────────────────────

export type StudentCoursePageCard = {
  code: string;
  deptCode: string;
  deptColor: string;
  title: string;
  description: string;
  instructor: string;
  credits: number;
  status: CourseStatus;
  progress: number;
  grade: string;
  gradeNum: number | null;
  modulesComplete: number;
  modulesTotal: number;
  meetingDisplay: string;
  location: string;
  nextDue: string;
};

export type StudentCoursesPageData = {
  student: { firstName: string; name: string };
  semesterLabel: string;
  activeCourses: number;
  totalCredits: number;
  gpa: number;
  courses: StudentCoursePageCard[];
};

function letterToGpa(grade: string): number {
  const map: Record<string, number> = {
    "A+": 4.0,
    A: 4.0,
    "A−": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B−": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C−": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D−": 0.7,
    F: 0.0,
  };
  return map[grade] ?? 0;
}

function fmtMeeting(times: Course["meetingTimes"]): string {
  if (!times.length) return "—";
  const days = times.map((t) => t.day).join(" / ");
  const first = times[0];
  const fmt = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    const ampm = h >= 12 ? "pm" : "am";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")}${ampm}`;
  };
  return `${days} · ${fmt(first.start)}–${fmt(first.end)}`;
}

export type StudentSidebarCourse = { code: string; title: string };

export function getStudentSidebarCourses(): StudentSidebarCourse[] {
  const student = getDefaultStudent();
  if (!student) return [];
  return student.enrolledCourseIds
    .map((id) => db.courses.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => ({ code: c!.code, title: c!.title })) as StudentSidebarCourse[];
}

export function getStudentCoursesPage(): StudentCoursesPageData | null {
  const student = getDefaultStudent();
  if (!student) return null;

  const enrolledCourses = student.enrolledCourseIds
    .map((id) => db.courses.find((c) => c.id === id))
    .filter(Boolean) as Course[];

  const semester =
    db.semesters.find((s) => s.status === "active") ?? db.semesters[0];
  const semStart = new Date(semester.startDate).getTime();
  const weekNum = Math.max(
    1,
    Math.floor((NOW.getTime() - semStart) / WEEK_MS) + 1,
  );
  const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const semesterLabel = `${semester.name} · Week ${weekNum} · ${MONTH_NAMES[NOW.getMonth()]} ${NOW.getDate()}`;

  const rawDeadlines = generateUpcomingDeadlines(student.id, 10);

  const courses: StudentCoursePageCard[] = enrolledCourses.map((c) => {
    const sh = strHash(student.id + c.id);
    const dept = db.departments.find((d) => d.id === c.departmentId);
    const deptCode = dept?.code ?? c.code.split("-")[0];
    const deptColor = DEPT_COLORS_MAP[deptCode] ?? "var(--m-accent)";
    const instructor = db.instructors.find((i) => i.id === c.instructorId);
    const instructorName = instructor
      ? `Prof. ${instructor.firstName} ${instructor.lastName}`
      : "—";
    const progress = (10 + (sh % 81)) / 100;
    const ch = strHash(c.id);
    const avgGrade = ch % 20 === 0 ? null : 68 + (ch % 1500) / 100;
    const sh2 = strHash(student.id + c.id + "g");
    const gradeNum = avgGrade
      ? Math.max(
          45,
          Math.min(
            100,
            Math.round(avgGrade + (sh % 21) - 10 + (sh2 % 21) - 10),
          ),
        )
      : null;
    const grade = gradeNum ? numToLetterGrade(gradeNum) : "—";
    const modulesTotal = 4 + (ch % 3);
    const modulesComplete = Math.max(
      0,
      Math.min(modulesTotal, Math.round(progress * modulesTotal)),
    );
    const courseDl = rawDeadlines.find((dl) => dl.courseId === c.id);
    const nextDue = courseDl
      ? `${courseDl.title} · ${fmtDueShort(new Date(courseDl.dueDate))}`
      : "No upcoming deadlines";

    return {
      code: c.code,
      deptCode,
      deptColor,
      title: c.title,
      description: c.description,
      instructor: instructorName,
      credits: c.credits,
      status: c.status,
      progress,
      grade,
      gradeNum,
      modulesComplete,
      modulesTotal,
      meetingDisplay: fmtMeeting(c.meetingTimes),
      location: `${c.location.building} ${c.location.room}`,
      nextDue,
    };
  });

  const gradedCourses = courses.filter((c) => c.gradeNum !== null);
  const gpa =
    gradedCourses.length > 0
      ? Math.round(
          (gradedCourses.reduce((sum, c) => sum + letterToGpa(c.grade), 0) /
            gradedCourses.length) *
            100,
        ) / 100
      : 0;
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const activeCourses = courses.filter((c) => c.status === "active").length;

  return {
    student: {
      firstName: student.firstName,
      name: `${student.firstName} ${student.lastName}`,
    },
    semesterLabel,
    activeCourses,
    totalCredits,
    gpa,
    courses,
  };
}

// ── Student Course Detail Page ────────────────────────────────────────────────

export type StudentCourseDetailLesson = {
  id: string;
  title: string;
  kind: "video" | "reading" | "quiz" | "assignment";
  duration: string;
  state: "complete" | "in-progress" | "upcoming";
  description: string;
  objectives: string[];
  scrubProgress: number;
  moduleIdx: number;
  moduleTitle: string;
  lessonIdx: number;
  lessonOf: number;
  quizQuestions?: { stem: string; options: string[]; correctIdx: number }[];
};

export type StudentCourseDetailModule = {
  id: string;
  idx: number;
  title: string;
  lessonCount: number;
  completedCount: number;
  totalMin: number;
  state: "complete" | "in-progress" | "upcoming";
  lessons: StudentCourseDetailLesson[];
};

export type Thread = { who: string; time: string; body: string };

export type Syllabus = {
  officeHours: string;
  email: string;
  grading: { label: string; pct: number; color: string }[];
  policies: { title: string; body: string }[];
};

export type StudentCourseDetail = {
  code: string;
  title: string;
  instructor: string;
  deptCode: string;
  deptColor: string;
  credits: number;
  meetingDisplay: string;
};

export type Resource = { name: string; meta: string };

export type StudentCourseDetailData = {
  course: StudentCourseDetail;
  progress: number;
  modulesComplete: number;
  modulesTotal: number;
  grade: string;
  modules: StudentCourseDetailModule[];
  activeModuleIdx: number;
  activeLessonId: string;
  resources: Resource[];
  threads: Thread[];
  syllabus: Syllabus;
};

const LESSON_DESCRIPTIONS = [
  "In this session we build on the foundations from the previous module, walking through the core implementation step by step. By the end you should be comfortable applying the technique to novel problems.",
  "This lecture covers the theoretical underpinnings of the topic, introducing the key concepts and formalisms used throughout the course. We'll work through several worked examples together.",
  "A hands-on workshop where you'll implement the algorithms covered in the readings. Come prepared with your development environment set up — we'll be live-coding from the start.",
  "We revisit the most commonly misunderstood concepts from earlier modules and clarify them with new examples. A good session to consolidate your understanding before the assignment.",
];

const LESSON_OBJECTIVES = [
  [
    "Understand the core invariants required for correctness",
    "Implement the primary algorithm from scratch",
    "Identify common failure modes and how to avoid them",
    "Apply the technique to the provided test cases",
  ],
  [
    "Define the key terms introduced in lecture",
    "Derive the main result from first principles",
    "Contrast this approach with the alternative from Module 1",
    "Complete the checkpoint quiz with confidence",
  ],
  [
    "Set up the development environment for today's exercises",
    "Trace execution through the reference implementation",
    "Extend the starter code with two additional features",
    "Run the provided test harness and interpret the output",
  ],
];

const THREAD_BODIES = [
  "Has anyone found a clean way to handle the edge case where the initial state is empty? The naive approach hits a null pointer on line 42.",
  "Got this working by checking the return value before promoting — the key insight is that the term in the response has to match the current term.",
  "The reading for this week is dense but section 4 finally clicked for me after re-reading it twice. The diagram on page 12 is the one to focus on.",
  "Office hours tomorrow are moved to 3pm — Prof confirmed in the course chat.",
];

const THREAD_NAMES = [
  "Saoirse Walsh",
  "Olivér Hartmann",
  "Priya Nair",
  "Marcus Webb",
  "Yuki Tanaka",
];

const QUIZ_BANKS: { stem: string; options: string[]; correctIdx: number }[][] =
  [
    [
      {
        stem: "Which property guarantees a committed entry is never overwritten?",
        options: [
          "Log Matching",
          "Leader Completeness",
          "State Machine Safety",
          "Election Safety",
        ],
        correctIdx: 1,
      },
      {
        stem: "A quorum in a 5-node cluster requires how many acknowledgements?",
        options: ["2", "3", "4", "5"],
        correctIdx: 1,
      },
      {
        stem: "What is the role of a term number in the consensus protocol?",
        options: [
          "It tracks committed entries",
          "It acts as a logical clock to detect stale messages",
          "It measures wall-clock time",
          "It identifies leader uptime",
        ],
        correctIdx: 1,
      },
      {
        stem: "When must a candidate step down to follower?",
        options: [
          "After winning an election",
          "On receiving a vote denial",
          "On seeing a higher term in any RPC",
          "After a heartbeat timeout",
        ],
        correctIdx: 2,
      },
    ],
    [
      {
        stem: "Which data structure provides O(1) amortised push and pop?",
        options: ["Linked list", "Dynamic array", "Binary heap", "Hash map"],
        correctIdx: 1,
      },
      {
        stem: "A hash table resize is triggered when:",
        options: [
          "After every insertion",
          "The load factor exceeds a threshold",
          "A collision is detected",
          "Every N operations",
        ],
        correctIdx: 1,
      },
      {
        stem: "The worst-case time complexity of quicksort is:",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctIdx: 2,
      },
      {
        stem: "Which traversal visits a node before its children?",
        options: ["In-order", "Post-order", "Pre-order", "Level-order"],
        correctIdx: 2,
      },
    ],
    [
      {
        stem: "Which HTTP status code indicates a resource was created?",
        options: ["200 OK", "201 Created", "204 No Content", "301 Moved"],
        correctIdx: 1,
      },
      {
        stem: "REST constraints include all of the following EXCEPT:",
        options: [
          "Statelessness",
          "Uniform interface",
          "Shared session state",
          "Layered system",
        ],
        correctIdx: 2,
      },
      {
        stem: "In OAuth 2.0, the access token is issued by the:",
        options: [
          "Resource server",
          "Client",
          "Authorization server",
          "User agent",
        ],
        correctIdx: 2,
      },
      {
        stem: "Which HTTP method is idempotent but not safe?",
        options: ["GET", "POST", "PUT", "PATCH"],
        correctIdx: 2,
      },
    ],
  ];

const OFFICE_HOURS = [
  "Mon / Wed  2:00–3:00 pm · Aldridge Hall 214",
  "Tue / Thu  10:00–11:00 am · Faculty Suite B",
  "Mon / Wed / Fri  1:00–2:00 pm · Engineering Annex 302",
  "Thu  3:00–5:00 pm · Virtual (Zoom link in Canvas)",
];

const GRADING_SCHEMAS: { label: string; pct: number; color: string }[][] = [
  [
    { label: "Assignments", pct: 30, color: "var(--m-info)" },
    { label: "Midterm", pct: 25, color: "var(--m-accent)" },
    { label: "Final exam", pct: 35, color: "var(--m-warning)" },
    { label: "Participation", pct: 10, color: "var(--m-success)" },
  ],
  [
    { label: "Homework", pct: 40, color: "var(--m-info)" },
    { label: "Quizzes", pct: 20, color: "var(--m-accent)" },
    { label: "Midterm", pct: 20, color: "var(--m-warning)" },
    { label: "Final exam", pct: 20, color: "var(--m-success)" },
  ],
  [
    { label: "Labs", pct: 30, color: "var(--m-info)" },
    { label: "Project", pct: 35, color: "var(--m-accent)" },
    { label: "Written responses", pct: 15, color: "var(--m-warning)" },
    { label: "Participation", pct: 20, color: "var(--m-success)" },
  ],
];

const SYLLABUS_POLICIES = [
  {
    title: "Attendance",
    body: "Regular attendance is expected. More than three unexcused absences will result in a grade penalty. Lecture recordings are available but are not a substitute for in-person participation.",
  },
  {
    title: "Late work",
    body: "Assignments submitted within 24 hours of the deadline are accepted with a 10% deduction. Work submitted more than 24 hours late will not be accepted without prior written approval from the instructor.",
  },
  {
    title: "Academic integrity",
    body: "Collaboration is encouraged for understanding concepts, but all submitted work must be your own. Use of AI-generated content without attribution is prohibited. Violations will be referred to the Office of Academic Integrity.",
  },
];

export function getStudentCourseDetail(
  code: string,
): StudentCourseDetailData | null {
  const course = db.courses.find((c) => c.code === code);
  if (!course) return null;

  const h = strHash(course.id);
  const dept = db.departments.find((d) => d.id === course.departmentId);
  const deptCode = dept?.code ?? code.split("-")[0];
  const deptColor = DEPT_COLORS_MAP[deptCode] ?? "var(--m-accent)";
  const instructor = db.instructors.find((i) => i.id === course.instructorId);
  const instructorName = instructor
    ? `Prof. ${instructor.firstName} ${instructor.lastName}`
    : "—";

  // Use the same default student as all other student-facing functions
  const student = getDefaultStudent();

  const sh = strHash((student?.id ?? "s0") + course.id);
  const progress = (10 + (sh % 81)) / 100;
  const ch = strHash(course.id);
  const avgGrade = ch % 20 === 0 ? null : 68 + (ch % 1500) / 100;
  const sh2 = strHash((student?.id ?? "s0") + course.id + "g");
  const gradeNum = avgGrade
    ? Math.max(
        45,
        Math.min(100, Math.round(avgGrade + (sh % 21) - 10 + (sh2 % 21) - 10)),
      )
    : null;
  const grade = gradeNum ? numToLetterGrade(gradeNum) : "—";

  // Modules
  const numModules = 4 + (ch % 3);
  const activeModuleIdx = Math.min(1, numModules - 1);

  const modules: StudentCourseDetailModule[] = Array.from(
    { length: numModules },
    (_, i) => {
      const mh = strHash(course.id + `mod${i}`);
      const shape = MODULE_LESSON_SHAPES[i % MODULE_LESSON_SHAPES.length];
      const totalMin = shape.length * (20 + (mh % 30));
      const modState: StudentCourseDetailModule["state"] =
        i < activeModuleIdx
          ? "complete"
          : i === activeModuleIdx
            ? "in-progress"
            : "upcoming";

      const completedCount =
        modState === "complete"
          ? shape.length
          : modState === "in-progress"
            ? Math.max(1, Math.floor(shape.length * 0.4))
            : 0;

      const moduleTitle = MODULE_TITLES[i % MODULE_TITLES.length];

      const lessons: StudentCourseDetailLesson[] = shape.map((kind, li) => {
        const lh = strHash(course.id + `mod${i}` + String(li));
        const opts = LESSON_TITLES[kind];
        const title = opts[lh % opts.length];
        const dMin =
          kind === "video"
            ? 15 + (lh % 30)
            : kind === "reading"
              ? 10 + (lh % 20)
              : 20 + (lh % 15);
        const lessonState: StudentCourseDetailLesson["state"] =
          modState === "complete"
            ? "complete"
            : modState === "upcoming"
              ? "upcoming"
              : li < completedCount
                ? "complete"
                : li === completedCount
                  ? "in-progress"
                  : "upcoming";
        return {
          id: `M-0${i + 1}-L${String(li + 1).padStart(2, "0")}`,
          title,
          kind,
          duration: kind === "reading" ? `${dMin} min read` : `${dMin} min`,
          state: lessonState,
          description: LESSON_DESCRIPTIONS[lh % LESSON_DESCRIPTIONS.length],
          objectives: LESSON_OBJECTIVES[lh % LESSON_OBJECTIVES.length],
          scrubProgress:
            lessonState === "in-progress"
              ? (lh % 80) / 100 + 0.05
              : lessonState === "complete"
                ? 1
                : 0,
          moduleIdx: i,
          moduleTitle,
          lessonIdx: li,
          lessonOf: shape.length,
          quizQuestions:
            kind === "quiz"
              ? QUIZ_BANKS[lh % QUIZ_BANKS.length].slice(0, 3 + (lh % 2))
              : undefined,
        };
      });

      return {
        id: `M-0${i + 1}`,
        idx: i,
        title: moduleTitle,
        lessonCount: shape.length,
        completedCount,
        totalMin,
        state: modState,
        lessons,
      };
    },
  );

  const modulesComplete = modules.filter((m) => m.state === "complete").length;
  const modulesTotal = numModules;

  // Active lesson — first in-progress lesson in the active module
  const activeMod = modules[activeModuleIdx];
  const activeLessonIdx = activeMod.completedCount;
  const activeL =
    activeMod.lessons[Math.min(activeLessonIdx, activeMod.lessons.length - 1)];

  // Resources
  const numRes = 3 + (h % 2);
  const resources = RESOURCE_NAMES.slice(0, numRes).map((name) => {
    const rh = strHash(course.id + name);
    const sizeKb = 60 + (rh % 800);
    const ext = name.split(".").pop()?.toUpperCase() ?? "FILE";
    return { name, meta: `${ext} · ${sizeKb}KB` };
  });

  // Threads
  const numThreads = 2 + (h % 2);
  const threads = Array.from({ length: numThreads }, (_, i) => {
    const th = strHash(course.id + `thread${i}`);
    return {
      who: THREAD_NAMES[th % THREAD_NAMES.length],
      time: i === 0 ? "12m ago" : i === 1 ? "1h ago" : "3h ago",
      body: THREAD_BODIES[th % THREAD_BODIES.length],
    };
  });

  return {
    course: {
      code: course.code,
      title: course.title,
      instructor: instructorName,
      deptCode,
      deptColor,
      credits: course.credits,
      meetingDisplay: fmtMeeting(course.meetingTimes),
    },
    progress,
    modulesComplete,
    modulesTotal,
    grade,
    modules,
    activeModuleIdx,
    activeLessonId: activeL.id,
    resources,
    threads,
    syllabus: {
      officeHours: OFFICE_HOURS[h % OFFICE_HOURS.length],
      email: instructor
        ? `${instructor.firstName.toLowerCase()}.${instructor.lastName.toLowerCase()}@aldridge.edu`
        : "instructor@aldridge.edu",
      grading: GRADING_SCHEMAS[h % GRADING_SCHEMAS.length],
      policies: SYLLABUS_POLICIES,
    },
  };
}

export type StudentGradeCard = {
  code: string;
  deptCode: string;
  deptColor: string;
  title: string;
  instructor: string;
  grade: string;
  gradeNum: number | null;
  progress: number;
};

export type SemesterGrades = {
  semesterId: string;
  semesterCode: string;
  semesterName: string;
  status: "past" | "active" | "upcoming" | "planning";
  gpa: number;
  courses: StudentGradeCard[];
};

export function getStudentGradesWithHistory(): SemesterGrades[] {
  const student = getDefaultStudent();
  if (!student) return [];

  const semesters = db.semesters
    .filter((s) => s.status === "active" || s.status === "past")
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );

  return semesters.map((semester) => {
    const semesterCourses = student.enrolledCourseIds
      .map((id) =>
        db.courses.find((c) => c.id === id && c.semesterId === semester.id),
      )
      .filter(Boolean) as Course[];

    // For past semesters, add historical courses for realism
    if (semester.status === "past") {
      const semesterAllCourses = db.courses.filter(
        (c) => c.semesterId === semester.id,
      );
      const sh = strHash(student.id + semester.id);
      const courseCountToAdd = 3 + (sh % 3); // Add 3-5 past courses

      for (
        let i = 0;
        i < courseCountToAdd && i < semesterAllCourses.length;
        i++
      ) {
        const idx = (sh + i * 17) % semesterAllCourses.length;
        const course = semesterAllCourses[idx];
        if (!semesterCourses.find((c) => c.id === course.id)) {
          semesterCourses.push(course);
        }
      }
    }

    const courses = semesterCourses.map((c) => {
      const sh = strHash(student.id + c.id);
      const dept = db.departments.find((d) => d.id === c.departmentId);
      const deptCode = dept?.code ?? c.code.split("-")[0];
      const deptColor = DEPT_COLORS_MAP[deptCode] ?? "var(--m-accent)";
      const instructor = db.instructors.find((i) => i.id === c.instructorId);
      const instructorName = instructor
        ? `Prof. ${instructor.firstName} ${instructor.lastName}`
        : "—";
      const progress =
        semester.status === "past" ? 1.0 : (10 + (sh % 81)) / 100;
      const ch = strHash(c.id);
      const avgGrade = ch % 20 === 0 ? null : 68 + (ch % 1500) / 100;
      const sh2 = strHash(student.id + c.id + "g");
      const gradeNum = avgGrade
        ? Math.max(
            45,
            Math.min(
              100,
              Math.round(avgGrade + (sh % 21) - 10 + (sh2 % 21) - 10),
            ),
          )
        : null;
      const grade = gradeNum ? numToLetterGrade(gradeNum) : "—";

      return {
        code: c.code,
        deptCode,
        deptColor,
        title: c.title,
        instructor: instructorName,
        grade,
        gradeNum,
        progress,
      };
    });

    const gpa =
      courses.length > 0
        ? courses.reduce((sum, g) => {
            const map: Record<string, number> = {
              A: 4.0,
              "A-": 3.7,
              "B+": 3.3,
              B: 3.0,
              "B-": 2.7,
              "C+": 2.3,
              C: 2.0,
              "—": 0,
            };
            return sum + (map[g.grade] ?? 0);
          }, 0) / courses.length
        : 0;

    return {
      semesterId: semester.id,
      semesterCode: semester.code,
      semesterName: semester.name,
      status: semester.status,
      gpa,
      courses,
    };
  });
}

export function getStudentDeadlines(): StudentDeadlineItem[] {
  const student = getDefaultStudent();
  if (!student) return [];

  const DAY_MS = 24 * 60 * 60 * 1000;
  const rawDeadlines = generateUpcomingDeadlines(student.id, 50);

  return rawDeadlines.map((d) => {
    const due = new Date(d.dueDate);
    const dayLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      due.getDay()
    ];
    const h = due.getUTCHours();
    const m = due.getUTCMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    const timeLabel = `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
    const diffDays = Math.ceil((due.getTime() - NOW.getTime()) / DAY_MS);
    const inLabel =
      diffDays < 0
        ? "overdue"
        : diffDays === 0
          ? "today"
          : diffDays === 1
            ? "tomorrow"
            : `in ${diffDays} days`;
    const asgn = db.assignments.find((a) => a.id === d.assignmentId);
    const typeMap: Record<string, StudentDeadlineItem["type"]> = {
      essay: "paper",
      exam: "assignment",
      quiz: "assignment",
      lab: "assignment",
      project: "milestone",
      presentation: "discussion",
    };
    return {
      id: d.assignmentId,
      course: d.courseCode,
      title: d.title,
      dayLabel,
      timeLabel,
      inLabel,
      type: asgn ? (typeMap[asgn.type] ?? "assignment") : "assignment",
    };
  });
}

// ─── Instructor Overview ───────────────────────────────────────────────────

function getDefaultInstructor(): Instructor | undefined {
  const activeCourseIds = new Set(
    db.courses.filter((c) => c.status === "active").map((c) => c.id),
  );
  const eligible = db.instructors.filter(
    (i) =>
      i.status === "active" &&
      i.courseIds.some((cid) => activeCourseIds.has(cid)),
  );
  if (eligible.length === 0) return db.instructors[0];
  return eligible[strHash(eligible[0].id) % eligible.length];
}

const MODALITY_LIST = [
  "In-person",
  "In-person",
  "In-person",
  "Hybrid",
  "Hybrid",
  "Online",
] as const;
type CourseModality = (typeof MODALITY_LIST)[number];

function courseModality(courseId: string): CourseModality {
  return MODALITY_LIST[strHash(courseId) % MODALITY_LIST.length];
}

function courseAvgGrade(courseId: string): number {
  return 74 + (strHash(courseId + "avg") % 21);
}

export type InstructorCourseRow = {
  code: string;
  title: string;
  deptAbbr: string;
  enrolled: number;
  cap: number;
  modality: CourseModality;
  ungraded: number;
  avgGrade: number;
};

export type InstructorGradeBar = {
  letter: string;
  pct: number;
  tone: string;
};

export type InstructorCoursePageItem = InstructorCourseRow & {
  gradeBars: InstructorGradeBar[];
  passRate: number;
  location: string;
};

export type InstructorPastCourse = {
  code: string;
  title: string;
  deptAbbr: string;
  enrolled: number;
  avgGrade: number;
  passRate: number;
};

export type InstructorPastSemester = {
  name: string;
  courses: InstructorPastCourse[];
};

export type InstructorCoursesPageData = {
  instructor: Instructor;
  semesterName: string;
  activeCount: number;
  totalStudents: number;
  ungradedTotal: number;
  courses: InstructorCoursePageItem[];
  history: InstructorPastSemester[];
};

function buildGradeBars(courseId: string, avg: number): InstructorGradeBar[] {
  const h1 = strHash(courseId + "gA");
  const h2 = strHash(courseId + "gB");
  const h3 = strHash(courseId + "gC");
  const h4 = strHash(courseId + "gD");
  // Tune around the avg: higher avg → more A/B, lower → more C/D
  const shift = Math.round((avg - 80) / 4);
  const a = Math.max(5, Math.min(40, 12 + shift * 3 + (h1 % 10)));
  const b = Math.max(15, Math.min(45, 32 + shift + (h2 % 10)));
  const c = Math.max(10, Math.min(35, 28 - shift + (h3 % 8)));
  const d = Math.max(3, Math.min(20, 14 - shift * 2 + (h4 % 6)));
  const f = Math.max(1, 100 - a - b - c - d);
  return [
    { letter: "A", pct: a, tone: "success" },
    { letter: "B", pct: b, tone: "info" },
    { letter: "C", pct: c, tone: "default" },
    { letter: "D", pct: d, tone: "warning" },
    { letter: "F", pct: f, tone: "danger" },
  ];
}

export function getInstructorCoursesPageData(): InstructorCoursesPageData | null {
  const instructor = getDefaultInstructor();
  if (!instructor) return null;

  const allSemesters = db.semesters;
  const activeSemester =
    allSemesters.find((s) => s.status === "active") ?? allSemesters[0];
  const pastSemesters = allSemesters
    .filter((s) => s.status === "past")
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .slice(0, 3);

  const allCourses = getCoursesForInstructor(instructor.id);
  const activeCourses = allCourses.filter((c) => c.status === "active");

  const BUILDINGS = [
    "Tucker Hall",
    "Henley Hall",
    "Carver Building",
    "Maxwell Hall",
    "Penn Hall",
  ];

  const courses: InstructorCoursePageItem[] = activeCourses.map((c) => {
    const recentAssignments = db.assignments
      .filter(
        (a) =>
          a.courseId === c.id && new Date(a.dueDate).getTime() <= NOW.getTime(),
      )
      .sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
      )
      .slice(0, 2);
    const ungraded = recentAssignments.reduce((sum, a) => {
      return sum + 3 + (strHash(c.id + a.id + "ungraded") % 14);
    }, 0);
    const avg = courseAvgGrade(c.id);
    const hLoc = strHash(c.id + "loc");
    return {
      code: c.code,
      title: c.title,
      deptAbbr: c.code.split("-")[0],
      enrolled: c.studentIds.length,
      cap: c.enrollmentCap,
      modality: courseModality(c.id),
      ungraded,
      avgGrade: avg,
      gradeBars: buildGradeBars(c.id, avg),
      passRate: 75 + (strHash(c.id + "pass") % 21),
      location: `${BUILDINGS[hLoc % BUILDINGS.length]} ${100 + (hLoc % 120)}`,
    };
  });

  const history: InstructorPastSemester[] = pastSemesters
    .map((sem) => {
      const semCourses = allCourses
        .filter((c) => c.semesterId === sem.id)
        .map((c) => {
          const avg = courseAvgGrade(c.id + sem.id);
          return {
            code: c.code,
            title: c.title,
            deptAbbr: c.code.split("-")[0],
            enrolled: c.studentIds.length,
            avgGrade: avg,
            passRate: 75 + (strHash(c.id + sem.id + "pass") % 21),
          };
        });
      return { name: sem.name, courses: semCourses };
    })
    .filter((s) => s.courses.length > 0);

  const totalStudents = courses.reduce((s, c) => s + c.enrolled, 0);
  const ungradedTotal = courses.reduce((s, c) => s + c.ungraded, 0);

  return {
    instructor,
    semesterName: activeSemester.name,
    activeCount: courses.length,
    totalStudents,
    ungradedTotal,
    courses,
    history,
  };
}

export type InstructorRosterCourse = {
  id: string;
  code: string;
  title: string;
  deptAbbr: string;
  enrolled: number;
  cap: number;
  roster: AdminCourseRosterRow[];
};

export type InstructorRosterData = {
  instructor: { id: string; fullName: string };
  semesterName: string;
  totalStudents: number;
  courses: InstructorRosterCourse[];
};

export function getInstructorRosterData(): InstructorRosterData | null {
  const instructor = getDefaultInstructor();
  if (!instructor) return null;

  const activeSemester =
    db.semesters.find((s) => s.status === "active") ?? db.semesters[0];
  const allCourses = getCoursesForInstructor(instructor.id);
  const activeCourses = allCourses.filter((c) => c.status === "active");

  const courses: InstructorRosterCourse[] = activeCourses.map((c) => {
    const assignments = db.assignments.filter((a) => a.courseId === c.id);
    const h = strHash(c.id);
    const avgGrade = h % 8 === 0 ? null : 55 + (h % 4000) / 100;

    const rosterStudents = db.students
      .filter((s) => c.studentIds.includes(s.id))
      .slice(0, 30);

    const roster: AdminCourseRosterRow[] = rosterStudents.map((s) => {
      const sh = strHash(s.id + c.id);
      const sh2 = strHash(s.id + c.id + "g");
      return {
        id: s.id,
        studentNumber: `STU-${s.id.slice(-5).toUpperCase()}`,
        name: s.fullName,
        standing: STANDINGS[(s.year - 1) % STANDINGS.length],
        grade: avgGrade
          ? Math.max(
              45,
              Math.min(
                100,
                Math.round(avgGrade + (sh % 21) - 10 + (sh2 % 21) - 10),
              ),
            )
          : null,
        attendance: 60 + (sh % 41),
        submitted: 4 + (sh % Math.max(1, assignments.length)),
        totalAssignments: assignments.length,
        lastActive: LAST_ACTIVE_DETAIL[sh % LAST_ACTIVE_DETAIL.length],
      };
    });

    return {
      id: c.id,
      code: c.code,
      title: c.title,
      deptAbbr: c.code.split("-")[0],
      enrolled: c.studentIds.length,
      cap: c.enrollmentCap,
      roster,
    };
  });

  const totalStudents = courses.reduce((s, c) => s + c.enrolled, 0);

  return {
    instructor,
    semesterName: activeSemester?.name ?? "Spring 2025",
    totalStudents,
    courses,
  };
}

export type InstructorScheduleItem = {
  time: string;
  until: string;
  label: string;
  location: string;
  tone: "accent" | "success" | "info" | "default";
};

export type InstructorQueueItem = {
  id: string;
  studentName: string;
  courseCode: string;
  assignmentTitle: string;
  submittedLabel: string;
  attempt: number;
  status: "pending" | "in-review" | "flagged";
  late: boolean;
};

export type InstructorOfficeHoursSlot = {
  day: string;
  start: string;
  end: string;
  type: "drop-in" | "by-appointment";
};

export type InstructorOverviewData = {
  instructor: Instructor;
  semesterName: string;
  weekNum: number;
  scheduleDay: string;
  courseCount: number;
  ungradedTotal: number;
  oldestHours: number;
  avgTurnaroundHours: number;
  courseHealth: string;
  officeLocation: string;
  officeHours: InstructorOfficeHoursSlot[];
  courses: InstructorCourseRow[];
  schedule: InstructorScheduleItem[];
  gradingQueue: InstructorQueueItem[];
};

const OH_PATTERNS: Array<{
  days: string[];
  start: string;
  end: string;
  type: "drop-in" | "by-appointment";
}> = [
  {
    days: ["Monday", "Wednesday"],
    start: "14:00",
    end: "16:00",
    type: "drop-in",
  },
  {
    days: ["Tuesday", "Thursday"],
    start: "10:00",
    end: "11:30",
    type: "drop-in",
  },
  {
    days: ["Monday", "Wednesday", "Friday"],
    start: "09:00",
    end: "10:00",
    type: "drop-in",
  },
  { days: ["Tuesday"], start: "13:00", end: "15:00", type: "drop-in" },
  { days: ["Thursday"], start: "15:00", end: "17:00", type: "by-appointment" },
];

const OFFICE_BUILDINGS = [
  "Tucker Hall",
  "Carver Building",
  "Henley Hall",
  "Maxwell Hall",
  "Webb House",
];

export function getInstructorOverview(): InstructorOverviewData | null {
  const instructor = getDefaultInstructor();
  if (!instructor) return null;

  const semester =
    db.semesters.find((s) => s.status === "active") ?? db.semesters[0];
  const semStart = new Date(semester.startDate).getTime();
  const weekNum = Math.max(1, Math.ceil((NOW.getTime() - semStart) / WEEK_MS));

  const courses = getCoursesForInstructor(instructor.id);
  const activeCourses = courses
    .filter((c) => c.status === "active")
    .slice(0, 4);

  // Per-course stats: use recent past-due assignments for ungraded count
  const courseRows: InstructorCourseRow[] = activeCourses.map((c) => {
    const recentAssignments = db.assignments
      .filter(
        (a) =>
          a.courseId === c.id && new Date(a.dueDate).getTime() <= NOW.getTime(),
      )
      .sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
      )
      .slice(0, 2);
    const ungraded = recentAssignments.reduce((sum, a) => {
      const h = strHash(c.id + a.id + "ungraded");
      return sum + 3 + (h % 14);
    }, 0);
    return {
      code: c.code,
      title: c.title,
      deptAbbr: c.code.split("-")[0],
      enrolled: c.studentIds.length,
      cap: c.enrollmentCap,
      modality: courseModality(c.id),
      ungraded,
      avgGrade: courseAvgGrade(c.id),
    };
  });

  const ungradedTotal = courseRows.reduce((s, r) => s + r.ungraded, 0);
  const overallAvg = courseRows.length
    ? courseRows.reduce((s, r) => s + r.avgGrade, 0) / courseRows.length
    : 85;
  const courseHealth =
    overallAvg >= 90
      ? "A"
      : overallAvg >= 85
        ? "A−"
        : overallAvg >= 80
          ? "B+"
          : "B";

  // Schedule: pick a weekday based on course meeting days
  const PREFER_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
  const prefDay = activeCourses[0]?.meetingTimes[0]?.day ?? "Mon";
  const todayDow = NOW.getDay();
  const dayMap: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
  };
  const targetDow = dayMap[prefDay] ?? 1;
  const daysAhead = (targetDow - todayDow + 7) % 7 || 7;
  const scheduleDate = new Date(NOW.getTime() + daysAhead * DAY_MS);
  const scheduleDay = scheduleDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const TONE_LIST = ["accent", "default", "success", "info"] as const;
  const scheduleItems: InstructorScheduleItem[] = [];

  activeCourses.forEach((c, idx) => {
    const mt =
      c.meetingTimes.find((m) => m.day === prefDay) ?? c.meetingTimes[0];
    if (!mt) return;
    const label = idx === 0 ? `${c.code} · Lecture` : `${c.code} · Lab`;
    scheduleItems.push({
      time: mt.start,
      until: mt.end,
      label,
      location: `${c.location.building} ${c.location.room}`,
      tone: TONE_LIST[idx % TONE_LIST.length],
    });
  });
  scheduleItems.push({
    time: "12:00",
    until: "13:00",
    label: "Office hours",
    location: "Faculty office · drop-in",
    tone: "success",
  });
  scheduleItems.sort((a, b) => a.time.localeCompare(b.time));

  // Grading queue: use the 3 most recently past-due assignments, with real students
  const STATUS_LIST = [
    "pending",
    "pending",
    "pending",
    "flagged",
    "in-review",
  ] as const;
  const SUB_LABELS = [
    "2h ago",
    "5h ago",
    "1 day ago",
    "1 day ago",
    "2 days ago",
    "3 days ago",
    "4 days ago",
  ];
  const queue: InstructorQueueItem[] = [];

  const recentByAssignment = activeCourses.flatMap((c) => {
    return db.assignments
      .filter(
        (a) =>
          a.courseId === c.id && new Date(a.dueDate).getTime() <= NOW.getTime(),
      )
      .sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
      )
      .slice(0, 2)
      .map((a) => ({ asgn: a, course: c }));
  });

  for (const { asgn, course } of recentByAssignment) {
    if (queue.length >= 10) break;
    const studentSample = course.studentIds.slice(0, 4);
    for (const sid of studentSample) {
      if (queue.length >= 10) break;
      const student = db.students.find((s) => s.id === sid);
      if (!student) continue;
      const h = strHash(sid + asgn.id);
      queue.push({
        id: `${asgn.id}-${sid}`,
        studentName: `${student.firstName} ${student.lastName}`,
        courseCode: course.code,
        assignmentTitle: asgn.title,
        submittedLabel: SUB_LABELS[h % SUB_LABELS.length],
        attempt: h % 3 === 0 ? 2 : 1,
        status: STATUS_LIST[h % STATUS_LIST.length],
        late: h % 7 === 0,
      });
    }
  }

  // Office hours
  const ohPattern = OH_PATTERNS[strHash(instructor.id) % OH_PATTERNS.length];
  const officeHours: InstructorOfficeHoursSlot[] = ohPattern.days.map(
    (day) => ({
      day,
      start: ohPattern.start,
      end: ohPattern.end,
      type: ohPattern.type,
    }),
  );
  // Add a by-appointment slot on a different day
  const extraDay = ["Friday", "Wednesday", "Thursday"][
    strHash(instructor.id + "extra") % 3
  ];
  officeHours.push({
    day: extraDay,
    start: "11:00",
    end: "12:00",
    type: "by-appointment",
  });

  const officeBuilding =
    OFFICE_BUILDINGS[strHash(instructor.id + "bldg") % OFFICE_BUILDINGS.length];
  const officeRoom = 100 + (strHash(instructor.id + "room") % 300);

  return {
    instructor,
    semesterName: semester.name,
    weekNum,
    scheduleDay,
    courseCount: activeCourses.length,
    ungradedTotal,
    oldestHours: 52,
    avgTurnaroundHours: 36,
    courseHealth,
    officeLocation: `${officeBuilding} · Room ${officeRoom}`,
    officeHours,
    courses: courseRows,
    schedule: scheduleItems,
    gradingQueue: queue,
  };
}

// ─── Instructor Grading Queue ──────────────────────────────────────────────

export type InstructorGradingQueueItem = {
  id: string;
  studentName: string;
  studentInitials: string;
  courseCode: string;
  assignmentTitle: string;
  assignmentType: string;
  pointsAvailable: number;
  submittedLabel: string;
  attempt: number;
  status: "pending" | "in-review" | "flagged";
  late: boolean;
  submissionId: string;
  dueLabel: string;
};

export type InstructorGradingData = {
  instructor: Instructor;
  semesterName: string;
  totalInQueue: number;
  gradedCount: number;
  queue: InstructorGradingQueueItem[];
};

export function getInstructorGradingData(): InstructorGradingData | null {
  const semester =
    db.semesters.find((s) => s.status === "active") ?? db.semesters[0];

  const SUB_LABELS = [
    "1h ago",
    "2h ago",
    "3h ago",
    "5h ago",
    "8h ago",
    "12h ago",
    "1 day ago",
    "1 day ago",
    "2 days ago",
    "2 days ago",
    "3 days ago",
    "4 days ago",
  ];
  const STATUS_LIST = [
    "pending",
    "pending",
    "pending",
    "pending",
    "flagged",
    "in-review",
  ] as const;
  const DUE_LABELS = [
    "Due today",
    "Due tomorrow",
    "Due Nov 14",
    "Due Nov 16",
    "Due Nov 20",
  ];

  for (const instructor of db.instructors) {
    if (instructor.status !== "active") continue;

    const activeCourses = getCoursesForInstructor(instructor.id)
      .filter((c) => c.status === "active")
      .slice(0, 4);
    if (!activeCourses.length) continue;

    const queue: InstructorGradingQueueItem[] = [];
    let submissionSeq = 9800;

    for (const c of activeCourses) {
      const assignments = db.assignments
        .filter((a) => a.courseId === c.id)
        .sort(
          (a, b) =>
            new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
        )
        .slice(0, 3);

      for (const asgn of assignments) {
        const studentSample = c.studentIds.slice(0, 8);
        for (const sid of studentSample) {
          if (queue.length >= 23) break;
          const student = db.students.find((s) => s.id === sid);
          if (!student) continue;
          const h = strHash(sid + asgn.id + "grading");
          const initials =
            `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
          queue.push({
            id: `grading-${asgn.id}-${sid}`,
            studentName: `${student.firstName} ${student.lastName}`,
            studentInitials: initials,
            courseCode: c.code,
            assignmentTitle: asgn.title,
            assignmentType: asgn.type,
            pointsAvailable: asgn.pointsAvailable,
            submittedLabel: SUB_LABELS[h % SUB_LABELS.length],
            attempt: h % 4 === 0 ? 2 : 1,
            status: STATUS_LIST[h % STATUS_LIST.length],
            late: h % 6 === 0,
            submissionId: `S-${submissionSeq++}`,
            dueLabel: DUE_LABELS[h % DUE_LABELS.length],
          });
        }
        if (queue.length >= 23) break;
      }
      if (queue.length >= 23) break;
    }

    if (!queue.length) continue;

    const gradedCount = Math.max(1, Math.floor(queue.length * 0.2));
    return {
      instructor,
      semesterName: semester.name,
      totalInQueue: queue.length,
      gradedCount,
      queue,
    };
  }

  return null;
}
