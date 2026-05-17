export type AssignmentType =
  | "essay"
  | "exam"
  | "project"
  | "quiz"
  | "lab"
  | "presentation";

export type AssignmentStatus = "draft" | "open" | "grading" | "graded";

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  type: AssignmentType;
  dueDate: string;
  pointsAvailable: number;
  status: AssignmentStatus;
  submissionCount: number;
  enrolledCount: number;
};
