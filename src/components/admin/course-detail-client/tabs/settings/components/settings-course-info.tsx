import { AdminCourseDTO, AdminInstructorDTO } from "@/fake-db/dashboards";

type SettingsCourseInfoProps = {
  course: AdminCourseDTO;
  instructor: AdminInstructorDTO;
};

export function SettingsCourseInfo({
  course,
  instructor,
}: SettingsCourseInfoProps) {
  return (
    <div className="m-card">
      <div className="m-settings-section">
        <p className="m-settings-section__title">Course info</p>
        {[
          { label: "Course code", value: course.code },
          { label: "Department", value: course.deptCode },
          { label: "Level", value: `${course.level}-level` },
          { label: "Instructor", value: instructor.name },
          { label: "Contact", value: instructor.email },
        ].map((row) => (
          <div key={row.label} className="m-settings-row">
            <span className="m-settings-row__label">{row.label}</span>
            <span className="m-settings-row__value m-mono m-td-dim">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
