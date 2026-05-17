export type SemesterStatus = "past" | "active" | "upcoming" | "planning";

export type Semester = {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SemesterStatus;
};
