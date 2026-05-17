export type StudentStatus =
  | "active"
  | "leave"
  | "probation"
  | "graduated"
  | "withdrawn";

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  programId: string;
  year: 1 | 2 | 3 | 4 | 5;
  gpa: number;
  status: StudentStatus;
  enrollmentDate: string;
  enrolledCourseIds: string[];
};
