import type { StudentCourseDetailData } from "@/fake-db/dashboards";
import { XIcon } from "lucide-react";
import { Policies } from "./components/policies";
import { GradingBreakdown } from "./components/grading-breakdown";
import { MeetingSchedule } from "./components/meeting-schedule";
import { Instructor } from "./components/instructor";

type SyllabusSheetProps = {
  course: StudentCourseDetailData["course"];
  syllabus: StudentCourseDetailData["syllabus"];
  onClose: () => void;
};

export function SyllabusSheet({
  course,
  syllabus,
  onClose,
}: SyllabusSheetProps) {
  return (
    <>
      <div className="m-sheet-overlay" onClick={onClose} />
      <div className="m-sheet">
        <div className="m-sheet__head">
          <span className="m-sheet__title">
            <span className="m-mono m-sheet__title--mono">{course.code}</span>
            {" · "}Syllabus
          </span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={onClose}
          >
            <XIcon size={14} />
          </button>
        </div>

        <div className="m-sheet__body">
          <Instructor syllabus={syllabus} course={course} />
          <MeetingSchedule course={course} />
          <GradingBreakdown syllabus={syllabus} />
          <Policies syllabus={syllabus} />
        </div>
      </div>
    </>
  );
}
