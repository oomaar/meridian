import { faker, pad, NOW, isoDate } from "../seed";
import type {
  Activity,
  ActivityDot,
  ActivityType,
  Assignment,
  Course,
  Instructor,
  Student,
  User,
} from "../types";

const TYPE_DOT: Record<ActivityType, ActivityDot> = {
  assignment_submitted: "accent",
  assignment_graded: "success",
  course_enrolled: "info",
  course_dropped: "warning",
  instructor_announcement: "accent",
  deadline_approaching: "warning",
  grade_posted: "success",
  policy_published: "info",
  comment_added: "default",
  user_invited: "info",
  roster_imported: "success",
  semester_published: "accent",
};

const POLICIES = [
  "late submission policy",
  "academic integrity guidelines",
  "office hours protocol",
  "grading rubric",
  "auditing policy",
];

export function buildActivity(opts: {
  count: number;
  students: Student[];
  instructors: Instructor[];
  courses: Course[];
  assignments: Assignment[];
  users: User[];
}): Activity[] {
  const { count, students, instructors, courses, assignments, users } = opts;
  const courseById = new Map(courses.map((c) => [c.id, c]));
  const instructorById = new Map(instructors.map((i) => [i.id, i]));

  const enrolledStudents = students.filter(
    (s) => s.enrolledCourseIds.length > 0
  );
  const activeCourses = courses.filter((c) => c.status === "active");
  const recentAssignments = assignments.filter(
    (a) => a.status === "open" || a.status === "grading" || a.status === "graded"
  );
  const openAssignments = assignments.filter((a) => a.status === "open");

  const events: Activity[] = [];

  for (let i = 0; i < count; i++) {
    const type = faker.helpers.weightedArrayElement<ActivityType>([
      { value: "assignment_submitted", weight: 26 },
      { value: "assignment_graded", weight: 14 },
      { value: "course_enrolled", weight: 8 },
      { value: "course_dropped", weight: 4 },
      { value: "instructor_announcement", weight: 8 },
      { value: "deadline_approaching", weight: 10 },
      { value: "grade_posted", weight: 10 },
      { value: "policy_published", weight: 4 },
      { value: "comment_added", weight: 8 },
      { value: "user_invited", weight: 3 },
      { value: "roster_imported", weight: 3 },
      { value: "semester_published", weight: 2 },
    ]);

    const minutesBack = faker.helpers.weightedArrayElement([
      { value: faker.number.int({ min: 1, max: 60 }), weight: 30 },
      { value: faker.number.int({ min: 60, max: 360 }), weight: 25 },
      { value: faker.number.int({ min: 360, max: 1440 }), weight: 20 },
      { value: faker.number.int({ min: 1440, max: 4320 }), weight: 15 },
      { value: faker.number.int({ min: 4320, max: 14400 }), weight: 10 },
    ]);
    const timestamp = isoDate(new Date(NOW.getTime() - minutesBack * 60_000));

    let body = "";
    let studentId: string | undefined;
    let instructorId: string | undefined;
    let courseId: string | undefined;
    let assignmentId: string | undefined;
    let userId: string | undefined;

    switch (type) {
      case "assignment_submitted": {
        if (recentAssignments.length === 0 || enrolledStudents.length === 0)
          continue;
        const assignment = faker.helpers.arrayElement(recentAssignments);
        const course = courseById.get(assignment.courseId);
        if (!course) continue;
        const student = faker.helpers.arrayElement(enrolledStudents);
        body = `${student.fullName} submitted "${assignment.title}" in ${course.code}`;
        studentId = student.id;
        courseId = course.id;
        assignmentId = assignment.id;
        break;
      }
      case "assignment_graded": {
        if (recentAssignments.length === 0) continue;
        const assignment = faker.helpers.arrayElement(recentAssignments);
        const course = courseById.get(assignment.courseId);
        if (!course) continue;
        const instructor = instructorById.get(course.instructorId);
        body = `${instructor?.fullName ?? "Instructor"} finished grading "${assignment.title}" — ${assignment.submissionCount} submissions`;
        instructorId = instructor?.id;
        courseId = course.id;
        assignmentId = assignment.id;
        break;
      }
      case "course_enrolled": {
        if (enrolledStudents.length === 0 || activeCourses.length === 0)
          continue;
        const student = faker.helpers.arrayElement(enrolledStudents);
        const course = faker.helpers.arrayElement(activeCourses);
        body = `${student.fullName} enrolled in ${course.code} · ${course.title}`;
        studentId = student.id;
        courseId = course.id;
        break;
      }
      case "course_dropped": {
        if (enrolledStudents.length === 0 || activeCourses.length === 0)
          continue;
        const student = faker.helpers.arrayElement(enrolledStudents);
        const course = faker.helpers.arrayElement(activeCourses);
        body = `${student.fullName} dropped ${course.code} after the add/drop deadline`;
        studentId = student.id;
        courseId = course.id;
        break;
      }
      case "instructor_announcement": {
        if (activeCourses.length === 0) continue;
        const course = faker.helpers.arrayElement(activeCourses);
        const instructor = instructorById.get(course.instructorId);
        body = `${instructor?.fullName ?? "Instructor"} posted an announcement in ${course.code}`;
        instructorId = instructor?.id;
        courseId = course.id;
        break;
      }
      case "deadline_approaching": {
        if (openAssignments.length === 0) continue;
        const assignment = faker.helpers.arrayElement(openAssignments);
        const course = courseById.get(assignment.courseId);
        if (!course) continue;
        body = `"${assignment.title}" in ${course.code} is due in ${faker.number.int({ min: 1, max: 5 })} days`;
        courseId = course.id;
        assignmentId = assignment.id;
        break;
      }
      case "grade_posted": {
        if (recentAssignments.length === 0) continue;
        const assignment = faker.helpers.arrayElement(recentAssignments);
        const course = courseById.get(assignment.courseId);
        if (!course) continue;
        const instructor = instructorById.get(course.instructorId);
        body = `${instructor?.fullName ?? "Instructor"} posted grades for "${assignment.title}"`;
        instructorId = instructor?.id;
        courseId = course.id;
        assignmentId = assignment.id;
        break;
      }
      case "policy_published": {
        const user = faker.helpers.arrayElement(users);
        body = `${user.fullName} published an updated ${faker.helpers.arrayElement(POLICIES)}`;
        userId = user.id;
        break;
      }
      case "comment_added": {
        if (enrolledStudents.length === 0 || activeCourses.length === 0)
          continue;
        const student = faker.helpers.arrayElement(enrolledStudents);
        const course = faker.helpers.arrayElement(activeCourses);
        body = `${student.fullName} commented in the ${course.code} discussion`;
        studentId = student.id;
        courseId = course.id;
        break;
      }
      case "user_invited": {
        const inviter = faker.helpers.arrayElement(users);
        body = `${inviter.fullName} invited a new colleague to the workspace`;
        userId = inviter.id;
        break;
      }
      case "roster_imported": {
        if (activeCourses.length === 0) continue;
        const course = faker.helpers.arrayElement(activeCourses);
        body = `Roster import completed for ${course.code} · ${course.studentIds.length} students`;
        courseId = course.id;
        break;
      }
      case "semester_published": {
        const user = faker.helpers.arrayElement(users);
        body = `${user.fullName} published the Fall 2026 course catalog`;
        userId = user.id;
        break;
      }
    }

    events.push({
      id: `act-${pad(events.length + 1, 4)}`,
      type,
      timestamp,
      studentId,
      instructorId,
      courseId,
      assignmentId,
      userId,
      body,
      dot: TYPE_DOT[type],
    });
  }

  events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return events;
}
