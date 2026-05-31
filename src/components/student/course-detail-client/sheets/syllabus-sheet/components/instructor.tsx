import type { StudentCourseDetailData } from "@/fake-db/dashboards";
import { ClockIcon, MailIcon } from "lucide-react";

type InstructorProps = {
  syllabus: StudentCourseDetailData["syllabus"];
  course: StudentCourseDetailData["course"];
};

export function Instructor({ syllabus, course }: InstructorProps) {
  return (
    <div>
      <div className="m-syllabus-section__label">Instructor</div>
      <div className="m-syllabus-section">
        <div className="m-syllabus-instructor__name">{course.instructor}</div>
        <div className="m-syllabus-instructor__meta">
          <MailIcon size={13} />
          {syllabus.email}
        </div>
        <div className="m-syllabus-instructor__meta">
          <ClockIcon size={13} />
          {syllabus.officeHours}
        </div>
      </div>
    </div>
  );
}
