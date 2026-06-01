"use client";

import { useState } from "react";
import type {
  StudentCourseDetailData,
  StudentCourseDetailLesson,
} from "@/fake-db/dashboards";
import { CourseDetailClientHeader } from "./components/course-detail-client-header";
import { CourseDetailClientOutlineCard } from "./components/course-detail-client-outline-card/course-detail-client-outline-card";
import { CourseDetailClientLessonContent } from "./components/course-detail-client-lesson-content/course-detail-client-lesson-content";
import { CourseDetailClientLessonResources } from "./components/course-detail-client-lesson-resources";
import { CourseDetailClientDiscussion } from "./components/course-detail-client-discussion";

type StudentCourseDetailClientProps = { data: StudentCourseDetailData };

export function StudentCourseDetailClient({
  data,
}: StudentCourseDetailClientProps) {
  const {
    course,
    grade,
    modules,
    activeModuleIdx,
    activeLessonId: initialLessonId,
    resources,
    threads,
  } = data;

  const allLessons = modules.flatMap((m) => m.lessons);

  const [activeLessonId, setActiveLessonId] = useState(initialLessonId);
  const [openModuleIdx, setOpenModuleIdx] = useState(activeModuleIdx);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    () =>
      new Set(
        allLessons.filter((l) => l.state === "complete").map((l) => l.id),
      ),
  );

  const dynamicProgress =
    allLessons.length > 0 ? completedLessonIds.size / allLessons.length : 0;

  const currentIdx = allLessons.findIndex((l) => l.id === activeLessonId);
  const lesson = allLessons[currentIdx] ?? allLessons[0];

  function goToLesson(l: StudentCourseDetailLesson) {
    setActiveLessonId(l.id);
    setOpenModuleIdx(l.moduleIdx);
  }

  const gradeTone =
    grade === "—"
      ? ""
      : grade.startsWith("A")
        ? "accent"
        : grade.startsWith("B")
          ? ""
          : "warning";

  return (
    <>
      <CourseDetailClientHeader
        lesson={lesson}
        dynamicProgress={dynamicProgress}
        gradeTone={gradeTone}
        data={data}
      />
      <div className="m-page__body m-course-layout">
        <CourseDetailClientOutlineCard
          activeLessonId={activeLessonId}
          completedLessonIds={completedLessonIds}
          goToLesson={goToLesson}
          dynamicProgress={dynamicProgress}
          openModuleIdx={openModuleIdx}
          setOpenModuleIdx={setOpenModuleIdx}
          data={data}
        />
        <CourseDetailClientLessonContent
          allLessons={allLessons}
          currentIdx={currentIdx}
          lesson={lesson}
          setCompletedLessonIds={setCompletedLessonIds}
          goToLesson={goToLesson}
          grade={grade}
          course={course}
          gradeTone={gradeTone}
        />
        <div className="m-stack m-right-col">
          <CourseDetailClientLessonResources resources={resources} />
          <CourseDetailClientDiscussion threads={threads} course={course} />
        </div>
      </div>
    </>
  );
}
