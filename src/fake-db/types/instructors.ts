export type InstructorTitle =
  | "Adjunct"
  | "Lecturer"
  | "Assistant Professor"
  | "Associate Professor"
  | "Professor";

export type InstructorStatus = "active" | "leave" | "retired";

export type Instructor = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title: InstructorTitle;
  email: string;
  departmentId: string;
  hireDate: string;
  status: InstructorStatus;
  rating: number;
  courseIds: string[];
};
