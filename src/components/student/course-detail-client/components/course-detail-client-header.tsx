import type {
  StudentCourseDetailData,
  StudentCourseDetailLesson,
} from "@/fake-db/dashboards";
import Link from "next/link";
import { MessageInstructorSheet } from "../sheets/message-instructor-sheet/message-instructor-sheet";
import { SyllabusSheet } from "../sheets/syllabus-sheet/syllabus-sheet";

type CourseDetailClientHeaderProps = {
  lesson: StudentCourseDetailLesson;
  dynamicProgress: number;
  gradeTone: "" | "accent" | "warning";
  data: StudentCourseDetailData;
};

export function CourseDetailClientHeader({
  lesson,
  dynamicProgress,
  gradeTone,
  data,
}: CourseDetailClientHeaderProps) {
  const { course, syllabus, grade, modulesTotal } = data;

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">
            <Link href="/student/courses" className="m-breadcrumb-link">
              My courses
            </Link>
            {" · "}
            <span className="m-mono">{course.code}</span>
          </span>
          <h1 className="m-page__h">{course.title}</h1>
          <div className="m-row m-gap-16 m-page__meta-row">
            <span>{course.instructor}</span>
            <span>·</span>
            <span>
              Module {lesson.moduleIdx + 1} of {modulesTotal} ·{" "}
              {Math.round(dynamicProgress * 100)}% complete
            </span>
            <span>·</span>
            <span
              className={`m-badge${gradeTone ? ` m-badge--${gradeTone}` : ""}`}
            >
              Current grade {grade}
            </span>
          </div>
        </div>
        <div className="m-page__actions">
          <SyllabusSheet syllabus={syllabus} course={course} />
          <MessageInstructorSheet
            instructor={course.instructor}
            courseCode={course.code}
          />
        </div>
      </div>
    </>
  );
}
