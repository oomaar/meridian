import type { StudentCourseDetailData } from "@/fake-db/dashboards";
import { CheckIcon, ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

type CourseCompleteCardProps = {
  course: StudentCourseDetailData["course"];
  grade: string;
  gradeTone: string;
  onReview: () => void;
};

export function CourseCompleteCard({
  course,
  grade,
  gradeTone,
  onReview,
}: CourseCompleteCardProps) {
  return (
    <div className="m-card m-complete-card">
      <div className="m-complete-card__icon">
        <CheckIcon size={28} />
      </div>
      <div>
        <h2 className="m-complete-card__title">Course complete</h2>
        <p className="m-complete-card__sub">
          You&apos;ve finished all lessons in{" "}
          <span className="m-mono">{course.code}</span> · {course.title}
        </p>
      </div>
      {grade !== "—" && (
        <span className={`m-badge${gradeTone ? ` m-badge--${gradeTone}` : ""}`}>
          Final grade {grade}
        </span>
      )}
      <div className="m-row m-gap-8 m-complete-card__actions">
        <button className="m-btn m-btn--ghost" onClick={onReview}>
          <ChevronLeftIcon size={14} /> Review lessons
        </button>
        <Link href="/student/courses" className="m-btn m-btn--primary">
          Back to my courses
        </Link>
      </div>
    </div>
  );
}
