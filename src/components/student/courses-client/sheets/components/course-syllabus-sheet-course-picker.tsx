import type { StudentCoursePageCard } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction } from "react";

type CourseSyllabusSheetCoursePickerProps = {
  courses: StudentCoursePageCard[];
  activeCode: string;
  setActiveCode: Dispatch<SetStateAction<string>>;
};

export function CourseSyllabusSheetCoursePicker({
  courses,
  activeCode,
  setActiveCode,
}: CourseSyllabusSheetCoursePickerProps) {
  return (
    <div className="m-cal-tabs">
      {courses.map((x) => (
        <button
          key={x.code}
          className={`m-cal-tab m-cal-tab-mono${activeCode === x.code ? " m-cal-tab--active" : ""}`}
          onClick={() => setActiveCode(x.code)}
        >
          {x.code}
        </button>
      ))}
    </div>
  );
}
