import type { StudentCourseDetailData } from "@/fake-db/dashboards";

type MeetingScheduleProps = {
  course: StudentCourseDetailData["course"];
};

export function MeetingSchedule({ course }: MeetingScheduleProps) {
  return (
    <div>
      <div className="m-syllabus-section__label">Schedule</div>
      <div className="m-syllabus-schedule">
        <div className="m-syllabus-schedule__row">
          <strong>Meetings: </strong>
          {course.meetingDisplay}
        </div>
        <div className="m-syllabus-schedule__row">
          <strong>Credits: </strong>
          {course.credits} credit hours
        </div>
      </div>
    </div>
  );
}
