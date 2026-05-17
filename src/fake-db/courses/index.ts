import { faker, pad, pickN } from "../seed";
import {
  BUILDINGS,
  COURSE_TITLE_PREFIXES_BY_DEPT,
  COURSE_TITLE_SUBJECTS_BY_DEPT,
} from "../lookups";
import type {
  Course,
  CourseStatus,
  Department,
  Instructor,
  MeetingDay,
  MeetingTime,
  Semester,
  Student,
} from "../types";

const SEMESTER_DISTRIBUTION = [
  { status: "past", weight: 50 },
  { status: "active", weight: 24 },
  { status: "upcoming", weight: 18 },
  { status: "planning", weight: 8 },
] as const;

function pickCap(courseNumber: number): number {
  if (courseNumber < 200)
    return faker.number.int({ min: 80, max: 220 });
  if (courseNumber < 300)
    return faker.number.int({ min: 35, max: 80 });
  if (courseNumber < 400)
    return faker.number.int({ min: 20, max: 45 });
  if (courseNumber < 500)
    return faker.number.int({ min: 12, max: 30 });
  return faker.number.int({ min: 6, max: 18 });
}

const MEETING_PATTERNS = [
  { days: ["Mon", "Wed", "Fri"] as MeetingDay[], durationMin: 50, weight: 28 },
  { days: ["Tue", "Thu"] as MeetingDay[],         durationMin: 75, weight: 36 },
  { days: ["Mon", "Wed"] as MeetingDay[],         durationMin: 75, weight: 14 },
  { days: ["Mon"] as MeetingDay[],                durationMin: 165, weight: 6 },
  { days: ["Tue"] as MeetingDay[],                durationMin: 165, weight: 5 },
  { days: ["Wed"] as MeetingDay[],                durationMin: 165, weight: 6 },
  { days: ["Thu"] as MeetingDay[],                durationMin: 165, weight: 5 },
];

function generateMeetingTimes(): MeetingTime[] {
  const choice = faker.helpers.weightedArrayElement(
    MEETING_PATTERNS.map((p) => ({ value: p, weight: p.weight }))
  );
  const startHour = faker.helpers.arrayElement([8, 9, 10, 11, 13, 14, 15, 16, 17]);
  const startMin = faker.helpers.arrayElement([0, 0, 0, 30]);
  const start = `${pad(startHour, 2)}:${pad(startMin, 2)}`;
  const endTotalMin = startHour * 60 + startMin + choice.durationMin;
  const end = `${pad(Math.floor(endTotalMin / 60), 2)}:${pad(endTotalMin % 60, 2)}`;
  return choice.days.map((day) => ({ day, start, end }));
}

function generateTitle(deptCode: string): string {
  const prefixes =
    COURSE_TITLE_PREFIXES_BY_DEPT[deptCode] ?? ["Topics in"];
  const subjects =
    COURSE_TITLE_SUBJECTS_BY_DEPT[deptCode] ?? ["Methods"];
  return `${faker.helpers.arrayElement(prefixes)} ${faker.helpers.arrayElement(
    subjects
  )}`;
}

function semestersByStatus(semesters: Semester[]) {
  const map: Record<string, Semester[]> = {
    past: [],
    active: [],
    upcoming: [],
    planning: [],
  };
  for (const s of semesters) map[s.status].push(s);
  return map;
}

function mapSemesterToCourseStatus(s: Semester["status"]): CourseStatus {
  if (s === "past") return "archived";
  if (s === "active") return "active";
  if (s === "upcoming") return "active";
  return "planning";
}

export function buildCourses(opts: {
  count: number;
  semesters: Semester[];
  departments: Department[];
  instructors: Instructor[];
  students: Student[];
}): Course[] {
  const { count, semesters, departments, instructors, students } = opts;
  const semByStatus = semestersByStatus(semesters);

  const instructorsByDept = new Map<string, Instructor[]>();
  for (const inst of instructors) {
    if (inst.status !== "active") continue;
    const arr = instructorsByDept.get(inst.departmentId) ?? [];
    arr.push(inst);
    instructorsByDept.set(inst.departmentId, arr);
  }

  const activeStudents = students.filter(
    (s) => s.status === "active" || s.status === "probation"
  );

  const baseDeptCount = Math.floor(count / departments.length);
  const remainder = count - baseDeptCount * departments.length;

  const courses: Course[] = [];
  const usedCodes = new Set<string>();

  for (let d = 0; d < departments.length; d++) {
    const dept = departments[d];
    const deptInstructors = instructorsByDept.get(dept.id) ?? [];
    if (deptInstructors.length === 0) continue;

    const deptCourseCount = baseDeptCount + (d < remainder ? 1 : 0);

    for (let c = 0; c < deptCourseCount; c++) {
      let code: string | null = null;
      for (let attempt = 0; attempt < 50; attempt++) {
        const num = faker.number.int({ min: 100, max: 799 });
        const candidate = `${dept.code}-${num}`;
        if (!usedCodes.has(candidate)) {
          code = candidate;
          break;
        }
      }
      if (!code) continue;
      usedCodes.add(code);

      const courseNumber = parseInt(code.split("-")[1]);
      const cap = pickCap(courseNumber);

      const semesterStatus = faker.helpers.weightedArrayElement(
        SEMESTER_DISTRIBUTION.map((s) => ({ value: s.status, weight: s.weight }))
      );
      const candidates = semByStatus[semesterStatus];
      if (candidates.length === 0) continue;
      const semester = faker.helpers.arrayElement(candidates);

      const instructor = faker.helpers.arrayElement(deptInstructors);
      const enrollmentRate = faker.number.float({
        min: 0.5,
        max: 1.0,
        fractionDigits: 2,
      });
      const targetEnrollment = Math.floor(cap * enrollmentRate);

      const studentPool =
        semester.status === "active" || semester.status === "upcoming"
          ? activeStudents
          : students;
      const studentIds = pickN(studentPool, targetEnrollment).map((s) => s.id);

      courses.push({
        id: `course-${code}`,
        code,
        title: generateTitle(dept.code),
        description: faker.lorem.sentence({ min: 14, max: 24 }),
        semesterId: semester.id,
        departmentId: dept.id,
        instructorId: instructor.id,
        studentIds,
        enrollmentCap: cap,
        credits: faker.helpers.weightedArrayElement([
          { value: 3, weight: 60 },
          { value: 4, weight: 30 },
          { value: 1, weight: 5 },
          { value: 2, weight: 5 },
        ]),
        status: mapSemesterToCourseStatus(semester.status),
        meetingTimes: generateMeetingTimes(),
        location: {
          building: faker.helpers.arrayElement(BUILDINGS),
          room: String(faker.number.int({ min: 100, max: 419 })),
        },
      });
    }
  }

  // Back-fill cross-references.
  const instructorById = new Map(instructors.map((i) => [i.id, i]));
  const studentById = new Map(students.map((s) => [s.id, s]));
  const semesterById = new Map(semesters.map((s) => [s.id, s]));

  for (const course of courses) {
    const sem = semesterById.get(course.semesterId);
    if (!sem) continue;
    if (sem.status === "active" || sem.status === "upcoming") {
      const inst = instructorById.get(course.instructorId);
      if (inst) inst.courseIds.push(course.id);
    }
    if (sem.status === "active") {
      for (const sid of course.studentIds) {
        const stu = studentById.get(sid);
        if (stu) stu.enrolledCourseIds.push(course.id);
      }
    }
  }

  return courses;
}
