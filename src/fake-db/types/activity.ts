export type ActivityType =
  | "assignment_submitted"
  | "assignment_graded"
  | "course_enrolled"
  | "course_dropped"
  | "instructor_announcement"
  | "deadline_approaching"
  | "grade_posted"
  | "policy_published"
  | "comment_added"
  | "user_invited"
  | "roster_imported"
  | "semester_published";

export type ActivityDot =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type Activity = {
  id: string;
  type: ActivityType;
  timestamp: string;
  studentId?: string;
  instructorId?: string;
  courseId?: string;
  assignmentId?: string;
  userId?: string;
  body: string;
  dot: ActivityDot;
};
