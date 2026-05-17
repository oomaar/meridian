import { faker, pad, NOW, isoDate } from "../seed";
import type {
  Assignment,
  AssignmentStatus,
  AssignmentType,
  Course,
  Semester,
} from "../types";

const TITLE_TEMPLATES: Record<AssignmentType, string[]> = {
  essay: [
    "Essay {n}: {topic}",
    "Reflection on {topic}",
    "Critical Response: {topic}",
  ],
  exam: [
    "Midterm Exam",
    "Final Exam",
    "Take-home Exam",
    "Comprehensive Exam",
  ],
  project: [
    "Project {n}: {topic}",
    "Capstone: {topic}",
    "Group Project: {topic}",
    "Research Project: {topic}",
  ],
  quiz: ["Quiz {n}", "Weekly Check-in {n}", "Reading Quiz {n}"],
  lab: ["Lab {n}: {topic}", "Practical {n}", "Lab Report: {topic}"],
  presentation: [
    "Presentation {n}: {topic}",
    "Final Presentation",
    "Group Presentation: {topic}",
  ],
};

const ESSAY_TOPICS = [
  "Methodology",
  "Case Studies",
  "Reflection",
  "Synthesis",
  "Comparative Analysis",
];
const PROJECT_TOPICS = [
  "Implementation",
  "Design Brief",
  "Field Study",
  "Research Plan",
  "Final Deliverable",
  "Prototype Review",
];

function topicFor(type: AssignmentType): string {
  if (type === "essay") return faker.helpers.arrayElement(ESSAY_TOPICS);
  if (type === "project" || type === "lab" || type === "presentation")
    return faker.helpers.arrayElement(PROJECT_TOPICS);
  return "";
}

function formatTitle(type: AssignmentType, n: number): string {
  const template = faker.helpers.arrayElement(TITLE_TEMPLATES[type]);
  return template
    .replace("{n}", String(n))
    .replace("{topic}", topicFor(type))
    .trim();
}

function statusFromDueDate(dueDate: Date): AssignmentStatus {
  const daysDelta = (dueDate.getTime() - NOW.getTime()) / 86_400_000;
  if (daysDelta > 0) return "open";
  if (daysDelta >= -2) return "grading";
  return "graded";
}

export function buildAssignments(opts: {
  courses: Course[];
  semesters: Semester[];
}): Assignment[] {
  const { courses, semesters } = opts;
  const semesterById = new Map(semesters.map((s) => [s.id, s]));
  const results: Assignment[] = [];
  let seq = 1;

  for (const course of courses) {
    const sem = semesterById.get(course.semesterId);
    if (!sem) continue;
    if (sem.status !== "active" && sem.status !== "past") continue;

    const assignmentCount = faker.number.int({ min: 4, max: 8 });
    const startDate = new Date(sem.startDate);
    const endDate = new Date(sem.endDate);
    // For active semester, extend the spread two weeks past semester end so
    // the last few assignments fall in finals + early-summer makeup window
    // (otherwise everything is "graded" by NOW and the demo feels stale).
    const effectiveEnd =
      sem.status === "active"
        ? new Date(
            Math.max(
              endDate.getTime(),
              NOW.getTime() + 14 * 86_400_000
            )
          )
        : endDate;
    const semDuration =
      (effectiveEnd.getTime() - startDate.getTime()) / 86_400_000;

    for (let i = 0; i < assignmentCount; i++) {
      const type = faker.helpers.weightedArrayElement<AssignmentType>([
        { value: "essay", weight: 18 },
        { value: "exam", weight: 12 },
        { value: "project", weight: 14 },
        { value: "quiz", weight: 30 },
        { value: "lab", weight: 14 },
        { value: "presentation", weight: 12 },
      ]);
      const dayOffset =
        Math.floor((semDuration * (i + 0.5)) / assignmentCount) +
        faker.number.int({ min: -3, max: 3 });
      const dueDate = new Date(startDate.getTime() + dayOffset * 86_400_000);
      const status: AssignmentStatus =
        sem.status === "past" ? "graded" : statusFromDueDate(dueDate);
      const pointsAvailable =
        type === "exam"
          ? 100
          : type === "project"
          ? faker.helpers.arrayElement([50, 100, 200])
          : faker.helpers.arrayElement([10, 20, 25, 50]);
      const enrolledCount = course.studentIds.length;
      const submissionRate =
        status === "open"
          ? faker.number.float({ min: 0.0, max: 0.4, fractionDigits: 2 })
          : status === "grading"
          ? faker.number.float({ min: 0.7, max: 1.0, fractionDigits: 2 })
          : faker.number.float({ min: 0.85, max: 1.0, fractionDigits: 2 });
      const submissionCount = Math.floor(enrolledCount * submissionRate);

      results.push({
        id: `assn-${pad(seq++, 5)}`,
        courseId: course.id,
        title: formatTitle(type, i + 1),
        type,
        dueDate: isoDate(dueDate),
        pointsAvailable,
        status,
        submissionCount,
        enrolledCount,
      });
    }
  }

  return results;
}
