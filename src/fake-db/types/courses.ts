export type CourseStatus = "draft" | "active" | "archived" | "planning";

export type MeetingDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export type MeetingTime = {
  day: MeetingDay;
  start: string;
  end: string;
};

export type Course = {
  id: string;
  code: string;
  title: string;
  description: string;
  semesterId: string;
  departmentId: string;
  instructorId: string;
  studentIds: string[];
  enrollmentCap: number;
  credits: number;
  status: CourseStatus;
  meetingTimes: MeetingTime[];
  location: { building: string; room: string };
};
