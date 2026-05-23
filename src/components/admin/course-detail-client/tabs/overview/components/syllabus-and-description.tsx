import { AdminCourseDTO } from "@/fake-db/dashboards";

type SyllabusAndDescriptionProps = {
  course: AdminCourseDTO;
};

export function SyllabusAndDescription({
  course,
}: SyllabusAndDescriptionProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Syllabus &amp; description</span>
        <span className="m-card__sub">Fall 2025</span>
      </div>
      <div className="m-card__body">
        <p className="m-course-desc">{course.description}</p>
        <div className="m-badge-row">
          <span className="m-badge">{course.weekCount} weeks</span>
          <span className="m-badge">{course.meetingLabel}</span>
          <span className="m-badge">
            {course.location.building} {course.location.room}
          </span>
          {course.taCount > 0 && (
            <span className="m-badge m-badge--accent">
              {course.taCount} TA{course.taCount > 1 ? "s" : ""}
            </span>
          )}
          <span className="m-badge">{course.credits} credits</span>
        </div>
      </div>
    </div>
  );
}
