"use client";

import type {
  StudentCourseDetail,
  StudentCourseDetailLesson,
} from "@/fake-db/dashboards";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { LessonCard } from "./lesson-card/lesson-card";
import { CourseCompleteCard } from "./course-complete-card";

type CourseDetailClientLessonContentProps = {
  allLessons: StudentCourseDetailLesson[];
  currentIdx: number;
  lesson: StudentCourseDetailLesson;
  setCompletedLessonIds: Dispatch<SetStateAction<Set<string>>>;
  goToLesson(l: StudentCourseDetailLesson): void;
  grade: string;
  course: StudentCourseDetail;
  gradeTone: "" | "accent" | "warning";
};

export function CourseDetailClientLessonContent({
  allLessons,
  currentIdx,
  lesson,
  setCompletedLessonIds,
  goToLesson,
  grade,
  course,
  gradeTone,
}: CourseDetailClientLessonContentProps) {
  const [courseComplete, setCourseComplete] = useState(false);

  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const crossingModule =
    !!nextLesson && nextLesson.moduleIdx !== lesson.moduleIdx;
  const isLastLesson = !nextLesson;

  return (
    <div className="m-stack">
      {courseComplete ? (
        <CourseCompleteCard
          course={course}
          grade={grade}
          gradeTone={gradeTone}
          onReview={() => setCourseComplete(false)}
        />
      ) : (
        <LessonCard key={lesson.id} lesson={lesson} />
      )}

      {!courseComplete && (
        <div className="m-row">
          <button
            className="m-btn"
            onClick={() => prevLesson && goToLesson(prevLesson)}
            disabled={!prevLesson}
          >
            <ChevronLeftIcon size={14} /> Previous lesson
          </button>
          <button
            className="m-btn m-btn--primary m-ml-auto"
            onClick={() => {
              setCompletedLessonIds((prev) => new Set([...prev, lesson.id]));
              if (isLastLesson) {
                setCourseComplete(true);
              } else {
                goToLesson(nextLesson!);
              }
            }}
          >
            {isLastLesson ? (
              <>
                <CheckIcon size={14} /> Finish course
              </>
            ) : crossingModule ? (
              <>
                <CheckIcon size={14} /> Complete module
              </>
            ) : (
              <>
                <ChevronRightIcon size={14} /> Next lesson
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
